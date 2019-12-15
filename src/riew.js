import { use } from './index';
import { isObjectEmpty, getFuncName, getId, requireObject, accumulate } from './utils';
import { chan as Channel, state as State, isState, go, sub as Sub, close, sput, stake } from './index';

const Renderer = function (viewFunc) {
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
            viewFunc(data);
          }
          inProgress = false;
        });
      }
    },
    destroy() {
      active = false;
    }
  };
};

export default function createRiew(viewFunc, ...routines) {
  const name = getFuncName(viewFunc);
  const riew = { id: getId(name), name };
  let renderer = Renderer(viewFunc);
  let states = [];
  let cleanups = [];
  let runningRoutines = [];
  let externals = {};
  let subscriptions = {};
  const state = function (...args) {
    const s = State(...args);
    states.push(s);
    return s;
  };
  const sub = function (to, func) {
    if (!(to in subscriptions)) {
      subscriptions[ to ] = true;
      Sub(to, func);
    }
  };
  const VIEW_CHANNEL = `${riew.id}_view`;
  const PROPS_CHANNEL = `${riew.id}_props`;

  const normalizeRenderData = value =>
    Object.keys(value).reduce((obj, key) => {
      if (isState(value[ key ])) {
        sub(value[ key ].READ, v => sput(VIEW_CHANNEL, { [ key ]: v }));
        stake(value[ key ].READ, v => sput(VIEW_CHANNEL, { [ key ]: v }));
      } else if (key.charAt(0) === '$') {
        const viewKey = key.substr(1, key.length);
        sub(value[ key ], v => {
          sput(VIEW_CHANNEL, { [ viewKey ]: v });
        });
        stake(value[ key ], v => sput(VIEW_CHANNEL, { [ viewKey ]: v }));
      } else {
        obj[ key ] = value[ key ];
      }
      return obj;
    }, {});

  riew.mount = function (props = {}) {
    requireObject(props);
    sub(PROPS_CHANNEL, newProps => sput(VIEW_CHANNEL, newProps));
    sub(VIEW_CHANNEL, renderer.push);
    runningRoutines = routines.map(r =>
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
          ...externals
        }
      )
    );
    if (!isObjectEmpty(externals)) {
      sput(VIEW_CHANNEL, normalizeRenderData(externals));
    }
    sput(PROPS_CHANNEL, props);
  };

  riew.unmount = function () {
    cleanups.forEach(c => c());
    cleanups = [];
    states.forEach(s => s.destroy());
    states = [];
    runningRoutines.forEach(r => r.stop());
    runningRoutines = [];
    renderer.destroy();
    close(PROPS_CHANNEL);
    close(VIEW_CHANNEL);
  };

  riew.update = function (props = {}) {
    requireObject(props);
    sput(PROPS_CHANNEL, props);
  };

  riew.with = (...maps) => {
    riew.__setExternals(maps);
    return riew;
  };

  riew.test = map => {
    const newInstance = createRiew(viewFunc, ...routines);

    newInstance.__setExternals([ map ]);
    return newInstance;
  };

  riew.__setExternals = maps => {
    maps = maps.reduce((map, item) => {
      if (typeof item === 'string') {
        map = { ...map, [ item ]: use(item) };
      } else {
        map = { ...map, ...item };
      }
      return map;
    }, {});
    externals = { ...externals, ...maps };
  };

  return riew;
}
