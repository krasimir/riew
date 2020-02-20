/* eslint-disable no-param-reassign, no-use-before-define */

import {
  use,
  state as State,
  isState,
  go,
  listen,
  close,
  sput,
  grid,
  logger,
  isRoutine,
  CLOSED,
  ENDED,
  verifyChannel,
  sliding as Sliding,
  fixed as Fixed,
  dropping as Dropping,
  isChannel,
} from './index';
import {
  isObjectEmpty,
  getFuncName,
  getId,
  requireObject,
  accumulate,
} from './utils';

const Renderer = function(pushDataToView) {
  let data = {};
  let inProgress = false;
  let active = true;

  return {
    push(newData) {
      if (newData === CLOSED || newData === ENDED) {
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
  return namedRiew(name, viewFunc, ...routines);
}

export function namedRiew(name, viewFunc, ...routines) {
  const renderer = Renderer(value => {
    viewFunc(value);
    logger.log(api, 'RIEW_RENDERED', value);
  });
  const id = getId(`${name}_riew`);
  const api = {
    id,
    name,
    '@riew': true,
    children: [],
    renderer,
  };
  let cleanups = [];
  let externals = {};
  let subscriptions = {};
  const addChild = function(o) {
    api.children.push(o);
    return o;
  };
  const state = initialValue => addChild(State(initialValue, id));
  const sliding = (n, internalId = null) =>
    addChild(Sliding(n, internalId || `sliding_${name}`, id));
  const fixed = n => addChild(Fixed(n, `fixed_${name}`, id));
  const dropping = n => addChild(Dropping(n, `dropping_${name}`, id));
  const subscribe = function(to, func) {
    if (!(to.id in subscriptions)) {
      subscriptions[to.id] = listen(to, func, { initialCall: true });
    }
  };
  const VIEW_CHANNEL = sliding(1, `sliding_${name}_view`, id);
  const PROPS_CHANNEL = sliding(1, `sliding_${name}_props`, id);

  const normalizeRenderData = value =>
    Object.keys(value).reduce((obj, key) => {
      const ch = verifyChannel(value[key], false);
      if (ch !== null) {
        subscribe(ch, v => sput(VIEW_CHANNEL, { [key]: v }));
      } else if (isState(value[key])) {
        subscribe(value[key].DEFAULT, v => sput(VIEW_CHANNEL, { [key]: v }));
      } else {
        obj[key] = value[key];
      }
      return obj;
    }, {});

  api.mount = function(props = {}) {
    requireObject(props);
    sput(PROPS_CHANNEL, props);
    subscribe(PROPS_CHANNEL, newProps => {
      sput(VIEW_CHANNEL, newProps);
    });
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
          [
            {
              render: value => {
                requireObject(value);
                sput(VIEW_CHANNEL, normalizeRenderData(value));
              },
              state,
              fixed,
              sliding,
              dropping,
              props: PROPS_CHANNEL,
              ...externals,
            },
          ],
          id
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
    Object.keys(subscriptions).forEach(subId => {
      subscriptions[subId]();
    });
    subscriptions = {};
    api.children.forEach(c => {
      if (isState(c)) {
        c.destroy();
      } else if (isRoutine(c)) {
        c.stop();
      } else if (isChannel(c)) {
        close(c);
      }
    });
    api.children = [];
    renderer.destroy();
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
