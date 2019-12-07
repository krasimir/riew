import { use } from './index';
import { isObjectEmpty, getFuncName, getId, requireObject, accumulate } from './utils';
import { chan as Channel, isChannel, go, from as From } from './csp';

const Renderer = function (viewFunc) {
  let data = {};
  let inProgress = false;

  return newData => {
    if (newData === Channel.CLOSED || newData === Channel.ENDED) {
      return;
    }
    data = accumulate(data, newData);
    if (!inProgress) {
      inProgress = true;
      Promise.resolve().then(() => {
        viewFunc(data);
        inProgress = false;
      });
    }
  };
};

export default function createRiew(viewFunc, ...routines) {
  const riew = {
    id: getId('r'),
    name: getFuncName(viewFunc)
  };
  const render = Renderer(viewFunc);
  let channels = [];
  let cleanups = [];
  let runningRoutines = [];
  let externals = {};
  const chan = function (...args) {
    const ch = Channel(...args);
    channels.push(ch);
    return ch;
  };
  const viewCh = chan(`${riew.name}_view`);
  const propsCh = chan(`${riew.name}_props`);

  const normalizeRenderData = value =>
    Object.keys(value).reduce((obj, key) => {
      if (isChannel(value[ key ])) {
        let ch = value[ key ];
        ch.subscribe(v => viewCh.put({ [ key ]: v }), ch.id + riew.id);
      } else {
        obj[ key ] = value[ key ];
      }
      return obj;
    }, {});
  const normalizeExternals = () =>
    Object.keys(externals).reduce((obj, key) => {
      let o;
      if (key.charAt(0) === '@') {
        key = key.substr(1, key.length);
        o = use(key);
      } else {
        o = externals[ key ];
      }
      obj[ key ] = o;
      return obj;
    }, {});

  riew.mount = function (props = {}) {
    let normalizedExternals = normalizeExternals();
    requireObject(props);
    if (!isObjectEmpty(normalizedExternals)) {
      viewCh.put(normalizeRenderData(normalizedExternals));
    }
    propsCh.subscribe(viewCh);
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
            from: (...args) => {
              const ch = From(...args);
              channels.push(ch);
              return ch;
            },
            props: propsCh,
            ...normalizedExternals
          }
        ],
        result => {
          if (typeof result === 'function') {
            cleanups.push(result);
          }
        }
      )
    );
    viewCh.subscribe(render);
    propsCh.put(props);
  };

  riew.unmount = function () {
    cleanups.forEach(c => c());
    cleanups = [];
    channels.forEach(c => c.close());
    channels = [];
    runningRoutines.forEach(r => r.stop());
    runningRoutines = [];
  };

  riew.update = function (props = {}) {
    requireObject(props);
    propsCh.put(props);
  };

  riew.with = (...maps) => {
    riew.__setExternals(maps);
    return riew;
  };

  riew.__setExternals = maps => {
    maps = maps.reduce((map, item) => {
      if (typeof item === 'string') {
        map = { ...map, [ '@' + item ]: true };
      } else {
        map = { ...map, ...item };
      }
      return map;
    }, {});
    externals = { ...externals, ...maps };
  };

  riew.test = map => {
    const newInstance = createRiew(viewFunc, ...routines);

    newInstance.__setExternals([ map ]);
    return newInstance;
  };

  return riew;
}
