import { state, use, subscribe, unsubscribe, destroy, grid } from './index';
import { isEffect } from './state';
import { isObjectEmpty, isPromise, parallel, getFuncName, getId } from './utils';
import { STATE_VALUE_CHANGE } from './constants';
import { chan as Channel, buffer, isChannel } from './csp';
import { isChannelTake } from './csp/channel';

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
    if (obj === null || (typeof obj !== 'undefined' && typeof obj !== 'object')) {
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

  instance.mount = initialData => {
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

  return instance;
}

/*
function normalizeExternalsMap(arr) {
  return arr.reduce((map, item) => {
    if (typeof item === 'string') {
      map = { ...map, ['@' + item]: true };
    } else {
      map = { ...map, ...item };
    }
    return map;
  }, {});
}

export default function createRiew(viewFunc, ...controllers) {
  const instance = {
    id: getId('r'),
    name: getFuncName(viewFunc),
  };
  let active = false;
  let internalStates = [];
  let onUnmountCallbacks = [];
  let subscriptions = {};
  let externals = {};
  let data = state({});

  const updateData = data.mutate((current, newStuff) => {
    if (
      newStuff === null ||
      (typeof newStuff !== 'undefined' && typeof newStuff !== 'object')
    ) {
      throw new Error(
        `A key-value object expected. Instead "${newStuff}" passed.`
      );
    }
    // console.log('updateData', newStuff);
    return { ...current, ...newStuff };
  });
  const render = data
    .map(newStuff => {
      let result = {};

      Object.keys(newStuff).forEach(key => {
        if (isEffect(newStuff[key]) && !newStuff[key].isMutating()) {
          const effect = newStuff[key];
          const state = grid.getNodeById(effect.stateId);

          result[key] = effect();
          if (!subscriptions[effect.stateId])
            subscriptions[effect.stateId] = {};
          subscriptions[effect.stateId][key] = effect;
          grid
            .subscribe(instance)
            .to(state)
            .when(STATE_VALUE_CHANGE, () => {
              updateData(
                Object.keys(subscriptions[effect.stateId]).reduce(
                  (effectsResult, key) => {
                    effectsResult[key] = subscriptions[effect.stateId][key]();
                    return effectsResult;
                  },
                  {}
                )
              );
            });
        } else {
          result[key] = newStuff[key];
        }
      });
      return result;
    })
    .filter(() => active)
    .pipe(viewFunc);

  function processExternals() {
    Object.keys(externals).forEach(key => {
      let external;

      if (key.charAt(0) === '@') {
        key = key.substr(1, key.length);
        external = use(key);
      } else {
        external = externals[key];
      }

      updateData({ [key]: external });
    });
  }

  instance.mount = (initialData = {}) => {
    if (active) {
      updateData(initialData);
      return instance;
    }
    updateData(initialData);
    processExternals();

    let controllersResult = parallel(...controllers)({
      ...data(),
      data: updateData,
      props: data,
      state(...args) {
        const s = state(...args);

        internalStates.push(s);
        return s;
      },
    });
    let done = result => (onUnmountCallbacks = result || []);

    if (isPromise(controllersResult)) {
      controllersResult.then(done);
    } else {
      done(controllersResult);
    }

    active = true;
    subscribe(render, true);
    return instance;
  };
  instance.update = newData => {
    updateData(newData);
  };
  instance.unmount = () => {
    active = false;
    unsubscribe(render);
    onUnmountCallbacks.filter(f => typeof f === 'function').forEach(f => f());
    onUnmountCallbacks = [];
    Object.keys(subscriptions).forEach(stateId =>
      grid.unsubscribe(instance).from(grid.getNodeById(stateId))
    );
    subscriptions = {};
    data.destroy();
    internalStates.forEach(destroy);
    internalStates = [];
    return instance;
  };
  instance.with = (...maps) => {
    instance.__setExternals(maps);
    return instance;
  };
  instance.test = map => {
    const newInstance = createRiew(viewFunc, ...controllers);

    newInstance.__setExternals([map]);
    return newInstance;
  };
  instance.__setExternals = maps => {
    externals = { ...externals, ...normalizeExternalsMap(maps) };
  };
  instance.__data = data;

  return instance;
}
*/
