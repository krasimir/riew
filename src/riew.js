import { use } from './index';
import { isObjectEmpty, getFuncName, getId, requireObject, accumulate } from './utils';
import { chan as Channel, state as State, isState, go, pub, sub, halt } from './index';

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
  const state = function (...args) {
    const s = State(...args);
    states.push(s);
    return s;
  };
  const VIEW_TOPIC = `${riew.id}_view`;
  const PROPS_TOPIC = `${riew.id}_props`;

  const normalizeRenderData = value =>
    Object.keys(value).reduce((obj, key) => {
      if (isState(value[ key ])) {
        sub(value[ key ].READ, v => {
          pub(VIEW_TOPIC, { [ key ]: v });
        });
      } else if (key.charAt(0) === '$') {
        const viewKey = key.substr(1, key.length);
        sub(value[ key ], v => {
          pub(VIEW_TOPIC, { [ viewKey ]: v });
        });
      } else {
        obj[ key ] = value[ key ];
      }
      return obj;
    }, {});

  riew.mount = function (props = {}) {
    requireObject(props);
    sub(PROPS_TOPIC, newProps => pub(VIEW_TOPIC, newProps));
    sub(VIEW_TOPIC, renderer.push);
    runningRoutines = routines.map(r =>
      go(
        r,
        [
          {
            render: value => {
              requireObject(value);
              pub(VIEW_TOPIC, normalizeRenderData(value));
            },
            state,
            props: PROPS_TOPIC,
            ...externals
          }
        ],
        result => {
          if (typeof result === 'function') {
            cleanups.push(result);
          }
        }
      )
    );
    if (!isObjectEmpty(externals)) {
      pub(VIEW_TOPIC, normalizeRenderData(externals));
    }
    pub(PROPS_TOPIC, props);
  };

  riew.unmount = function () {
    cleanups.forEach(c => c());
    cleanups = [];
    states.forEach(s => s.destroy());
    states = [];
    runningRoutines.forEach(r => r.stop());
    runningRoutines = [];
    renderer.destroy();
    halt(PROPS_TOPIC);
    halt(VIEW_TOPIC);
  };

  riew.update = function (props = {}) {
    requireObject(props);
    pub(PROPS_TOPIC, props);
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
