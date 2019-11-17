import { use } from './index';
import { isObjectEmpty, isPromise, parallel, getFuncName, getId } from './utils';
import { chan as Channel, buffer, isChannel, isChannelTake } from './csp';

const accumulate = () => buffer.reducer((current, newData) => ({ ...current, ...newData }));

function normalizeExternalsMap(arr) {
  return arr.reduce((map, item) => {
    if (typeof item === 'string') {
      map = { ...map, [ '@' + item ]: true };
    } else {
      map = { ...map, ...item };
    }
    return map;
  }, {});
}

export default function createRiew(viewFunc, ...controllers) {
  const instance = {
    id: getId('r'),
    name: getFuncName(viewFunc)
  };
  let channels = [];
  let subscriptions = {};
  let onUnmountCallbacks = [];
  let externals = {};

  function chan(...args) {
    const c = Channel(...args);
    channels.push(c);
    return c;
  }
  function subscribe(key, ch) {
    if (!subscriptions[ `${key}_${ch.id}` ]) {
      subscriptions[ `${key}_${ch.id}` ] = ch.map(v => ({ [ key ]: v })).pipe(viewCh);
    }
  }
  function requireObject(obj) {
    if (typeof obj === 'undefined' || obj === null || (typeof obj !== 'undefined' && typeof obj !== 'object')) {
      throw new Error(`A key-value object expected. Instead "${obj}" passed.`);
    }
  }
  function normalizeExternals() {
    return Object.keys(externals).reduce((obj, key) => {
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
  }
  function normalizeDataMap(data, channelToPush) {
    requireObject(data);
    const normalizedData = Object.keys(data).reduce((obj, key) => {
      let o = data[ key ];
      if (isChannel(o)) {
        subscribe(key, o);
      } else if (isChannelTake(o)) {
        subscribe(key, o.ch);
      } else {
        obj[ key ] = o;
      }
      return obj;
    }, {});

    if (!isObjectEmpty(normalizedData)) {
      channelToPush.put(normalizedData);
    }
  }

  const viewCh = chan(accumulate());
  const propsCh = chan().pipe(viewCh);

  viewCh.takeLatest(data => {
    viewFunc(data);
  });

  instance.mount = (initialData = {}) => {
    requireObject(initialData);
    propsCh.put(initialData);

    let normalizedExternals = normalizeExternals();
    normalizeDataMap(normalizedExternals, viewCh);

    let controllersResult = parallel(
      ...controllers.map(c => () => {
        const dataCh = chan().pipe(viewCh);
        return c({
          ...normalizedExternals,
          props: chan().from(propsCh),
          data: value => normalizeDataMap(value, dataCh),
          state: value => chan().from(value)
        });
      })
    )();
    let done = result => (onUnmountCallbacks = result || []);

    if (isPromise(controllersResult)) {
      controllersResult.then(done);
    } else {
      done(controllersResult);
    }

    return instance;
  };
  instance.unmount = () => {
    onUnmountCallbacks.filter(f => typeof f === 'function').forEach(f => f());
    onUnmountCallbacks = [];
    channels.forEach(c => {
      c.close();
    });
    channels = [];
    Object.keys(subscriptions).forEach(key => subscriptions[ key ].close());
    subscriptions = {};
  };
  instance.update = value => {
    propsCh.put(value);
  };
  instance.with = (...maps) => {
    instance.__setExternals(maps);
    return instance;
  };
  instance.__setExternals = maps => {
    externals = { ...externals, ...normalizeExternalsMap(maps) };
  };
  instance.test = map => {
    const newInstance = createRiew(viewFunc, ...controllers);

    newInstance.__setExternals([ map ]);
    return newInstance;
  };

  return instance;
}
