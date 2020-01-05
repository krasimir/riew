/* eslint-disable no-param-reassign, no-use-before-define */

import {
  use,
  chan as Channel,
  state as State,
  isState,
  go,
  sread,
  close,
  sput,
  stake,
  CHANNELS,
  isChannel,
  buffer,
  grid,
  logger,
} from './index';
import {
  isObjectEmpty,
  getFuncName,
  getId,
  requireObject,
  accumulate,
} from './utils';
import { isRoutine } from './csp';

const Renderer = function(pushDataToView) {
  let data = {};
  let inProgress = false;
  let active = true;

  return {
    push(newData) {
      if (newData === Channel.CLOSED || newData === Channel.ENDED) {
        return;
      }
      data = accumulate(data, newData);
      if (!inProgress) {
        inProgress = true;
        Promise.resolve().then(() => {
          if (active) {
            pushDataToView(data);
          }
          inProgress = false;
        });
      }
    },
    destroy() {
      active = false;
    },
    data() {
      return data;
    },
  };
};

export default function createRiew(viewFunc, ...routines) {
  const name = getFuncName(viewFunc);
  const renderer = Renderer(value => {
    viewFunc(value);
    if (__DEV__) logger.snapshot(riew, 'RIEW_RENDERED', value);
  });
  const riew = {
    id: getId(`riew_${name}`),
    name,
    '@riew': true,
    children: [],
    renderer,
  };
  let cleanups = [];
  let externals = {};
  const subscriptions = {};
  const state = function(...args) {
    const s = State(...args);
    riew.children.push(s);
    return s;
  };
  const subscribe = function(to, func) {
    if (!(to in subscriptions)) {
      subscriptions[to] = true;
      sread(to, func, { listen: true });
    }
  };
  const VIEW_CHANNEL = getId(`channel_view_${name}`);
  const PROPS_CHANNEL = getId(`channel_props_${name}`);

  riew.children.push(Channel(VIEW_CHANNEL, buffer.divorced()));
  riew.children.push(Channel(PROPS_CHANNEL, buffer.divorced()));

  const normalizeRenderData = value =>
    Object.keys(value).reduce((obj, key) => {
      if (CHANNELS.exists(value[key]) || isChannel(value[key])) {
        subscribe(value[key], v => {
          sput(VIEW_CHANNEL, { [key]: v });
        });
        stake(value[key], v => sput(VIEW_CHANNEL, { [key]: v }));
      } else if (isState(value[key])) {
        subscribe(value[key].READ, v => sput(VIEW_CHANNEL, { [key]: v }));
        stake(value[key].READ, v => sput(VIEW_CHANNEL, { [key]: v }));
      } else {
        obj[key] = value[key];
      }
      return obj;
    }, {});

  riew.mount = function(props = {}) {
    requireObject(props);
    sput(PROPS_CHANNEL, props);
    subscribe(PROPS_CHANNEL, newProps => sput(VIEW_CHANNEL, newProps));
    subscribe(VIEW_CHANNEL, renderer.push);
    riew.children = riew.children.concat(
      routines.map(r =>
        go(
          r,
          result => {
            if (typeof result === 'function') {
              cleanups.push(result);
            }
          },
          {
            render: value => {
              requireObject(value);
              sput(VIEW_CHANNEL, normalizeRenderData(value));
            },
            state,
            props: PROPS_CHANNEL,
            ...externals,
          }
        )
      )
    );
    if (!isObjectEmpty(externals)) {
      sput(VIEW_CHANNEL, normalizeRenderData(externals));
    }
    if (__DEV__) logger.snapshot(riew, 'RIEW_MOUNTED');
  };

  riew.unmount = function() {
    cleanups.forEach(c => c());
    cleanups = [];
    riew.children.forEach(c => {
      if (isState(c)) {
        c.destroy();
      } else if (isRoutine(c)) {
        c.stop();
      }
    });
    riew.children = [];
    renderer.destroy();
    close(PROPS_CHANNEL);
    close(VIEW_CHANNEL);
    grid.remove(riew);
    if (__DEV__) logger.snapshot(riew, 'RIEW_UNMOUNTED');
  };

  riew.update = function(props = {}) {
    requireObject(props);
    sput(PROPS_CHANNEL, props);
    if (__DEV__) logger.snapshot(riew, 'RIEW_UPDATED');
  };

  riew.with = (...maps) => {
    riew.__setExternals(maps);
    return riew;
  };

  riew.test = map => {
    const newInstance = createRiew(viewFunc, ...routines);

    newInstance.__setExternals([map]);
    return newInstance;
  };

  riew.__setExternals = maps => {
    const reducedMaps = maps.reduce((res, item) => {
      if (typeof item === 'string') {
        res = { ...res, [item]: use(item) };
      } else {
        res = { ...res, ...item };
      }
      return res;
    }, {});
    externals = { ...externals, ...reducedMaps };
  };

  return riew;
}
