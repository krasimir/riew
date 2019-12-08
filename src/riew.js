import { use } from './index';
import { isObjectEmpty, getFuncName, getId, requireObject, accumulate } from './utils';
import { chan as Channel, state as State, isChannel, isState, go } from './csp';

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
  const riew = {
    id: getId('r'),
    name: getFuncName(viewFunc)
  };
  let renderer = Renderer(viewFunc);
  let channels = [];
  let states = [];
  let cleanups = [];
  let runningRoutines = [];
  let externals = {};
  const chan = function (...args) {
    const ch = Channel(...args);
    channels.push(ch);
    return ch;
  };
  const state = function (...args) {
    const s = State(...args);
    states.push(s);
    return s;
  };
  const viewCh = chan(`${riew.name}_view`);
  const propsCh = chan(`${riew.name}_props`);

  const normalizeRenderData = value =>
    Object.keys(value).reduce((obj, key) => {
      if (isChannel(value[ key ])) {
        let ch = value[ key ];
        ch.subscribe(v => {
          viewCh.put({ [ key ]: v });
        }, ch.id + riew.id);
      } else if (isState(value[ key ])) {
        let state = value[ key ];
        let ch = state.map();
        ch.subscribe(v => {
          viewCh.put({ [ key ]: v });
        }, ch.id + riew.id);
      } else {
        obj[ key ] = value[ key ];
      }
      return obj;
    }, {});

  riew.mount = function (props = {}) {
    requireObject(props);
    propsCh.subscribe(viewCh);
    viewCh.subscribe(renderer.push);
    runningRoutines = routines.map(r =>
      go(
        r,
        [
          {
            render: value => {
              requireObject(value);
              viewCh.put(normalizeRenderData(value));
            },
            chan,
            state,
            props: propsCh,
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
      viewCh.put(normalizeRenderData(externals));
    }
    propsCh.put(props);
  };

  riew.unmount = function () {
    cleanups.forEach(c => c());
    cleanups = [];
    channels.forEach(c => c.close());
    channels = [];
    states.forEach(s => s.destroy());
    states = [];
    runningRoutines.forEach(r => r.stop());
    runningRoutines = [];
    renderer.destroy();
  };

  riew.update = function (props = {}) {
    requireObject(props);
    propsCh.put(props);
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
