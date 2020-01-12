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

export function riew(viewFunc, ...routines) {
  const name = getFuncName(viewFunc);
  const renderer = Renderer(value => {
    viewFunc(value);
    logger.log(api, 'RIEW_RENDERED', value);
  });
  const api = {
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
    api.children.push(s);
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

  api.children.push(Channel(VIEW_CHANNEL, buffer.memory()));
  api.children.push(Channel(PROPS_CHANNEL, buffer.memory()));

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

  api.mount = function(props = {}) {
    requireObject(props);
    sput(PROPS_CHANNEL, props);
    subscribe(PROPS_CHANNEL, newProps => sput(VIEW_CHANNEL, newProps));
    subscribe(VIEW_CHANNEL, renderer.push);
    api.children = api.children.concat(
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
    logger.log(api, 'RIEW_MOUNTED', props);
  };

  api.unmount = function() {
    cleanups.forEach(c => c());
    cleanups = [];
    api.children.forEach(c => {
      if (isState(c)) {
        c.destroy();
      } else if (isRoutine(c)) {
        c.stop();
      }
    });
    api.children = [];
    renderer.destroy();
    close(PROPS_CHANNEL);
    close(VIEW_CHANNEL);
    grid.remove(api);
    logger.log(api, 'RIEW_UNMOUNTED');
  };

  api.update = function(props = {}) {
    requireObject(props);
    sput(PROPS_CHANNEL, props);
    logger.log(api, 'RIEW_UPDATED', props);
  };

  api.with = (...maps) => {
    api.__setExternals(maps);
    return api;
  };

  api.test = map => {
    const newInstance = riew(viewFunc, ...routines);

    newInstance.__setExternals([map]);
    return newInstance;
  };

  api.__setExternals = maps => {
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

  grid.add(api);
  logger.log(api, 'RIEW_CREATED');

  return api;
}
