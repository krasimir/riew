import { createState as state, isRiewState, isRiewQueueTrigger } from './state';
import registry from './registry';
import { isPromise, parallel } from './utils';

function ensureObject(value, context) {
  if (value === null || (typeof value !== 'undefined' && typeof value !== 'object')) {
    throw new Error(`${ context } must be called with a key-value object. Instead "${ value }" passed.`);
  }
  return value;
}
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
const accumulate = (current, newStuff) => ({ ...current, ...newStuff });

export default function createRiew(viewFunc, ...effects) {
  const instance = {};
  let active = false;
  let internalStates = [];
  let subscriptions = [];
  let onUnmountCallbacks = [];
  let externals = {};

  const input = state({});
  const output = state({});
  const api = state({});

  const isActive = () => active;

  // triggers
  const updateOutput = output.mutate((current, newStuff) => {
    const result = { ...current };

    if (newStuff) {
      Object.keys(newStuff).forEach(key => {
        if (isRiewState(newStuff[key])) {
          result[key] = newStuff[key].get();
          if (!subscriptions.find(trigger => trigger.__state.id === newStuff[key].id)) {
            subscriptions.push(
              newStuff[key].pipe(value => render({ [key]: value })).subscribe()
            );
          }
        } else if (isRiewQueueTrigger(newStuff[key]) && !newStuff[key].isMutating()) {
          result[key] = newStuff[key]();
          if (!subscriptions.find(trigger => trigger.__state.id === newStuff[key].__state.id)) {
            subscriptions.push(
              newStuff[key].pipe(() => render({ [key]: newStuff[key]() })).subscribe()
            );
          }
        } else {
          result[key] = newStuff[key];
        }
      });
    }
    return result;
  });
  const render = updateOutput.filter(isActive).pipe(value => viewFunc(value));
  const updateAPI = api.mutate(accumulate);
  const updateInput = input.mutate(accumulate);

  // defining the effect api
  updateAPI({
    state(...args) {
      const s = state(...args);

      internalStates.push(s);
      return s;
    },
    render(newProps) {
      ensureObject(newProps, 'The `render` method');
      return render(newProps);
    },
    isActive,
    props: input
  });

  function processExternals() {
    Object.keys(externals).forEach(key => {
      let external;

      if (key.charAt(0) === '@') {
        key = key.substr(1, key.length);
        external = registry.get(key);
      } else {
        external = externals[key];
      }

      updateOutput({ [key]: external });
      updateAPI({ [key]: external });
    });
  }

  instance.isActive = isActive;
  instance.mount = (initialProps = {}) => {
    ensureObject(initialProps, 'The `mount` method');
    updateInput(initialProps);
    updateOutput(initialProps);
    processExternals();

    let effectsResult = parallel(...effects)(api.get());
    let done = (result) => (onUnmountCallbacks = result || []);

    if (isPromise(effectsResult)) {
      effectsResult.then(done);
    } else {
      done(effectsResult);
    }

    active = true;
    render();
    return instance;
  };
  instance.update = (newProps) => {
    render(newProps);
    updateInput(newProps);
  };
  instance.unmount = () => {
    active = false;
    output.teardown();
    api.teardown();
    internalStates.forEach(s => s.teardown());
    internalStates = [];
    onUnmountCallbacks.filter(f => typeof f === 'function').forEach(f => f());
    onUnmountCallbacks = [];
    subscriptions.forEach(s => s.unsubscribe());
    subscriptions = [];
    return instance;
  };
  instance.__setExternals = (maps) => {
    externals = { ...externals, ...normalizeExternalsMap(maps) };
  };

  instance.with = (...maps) => {
    const newInstance = createRiew(viewFunc, ...effects);

    newInstance.__setExternals(maps);
    return newInstance;
  };
  instance.test = (map) => {
    const newInstance = createRiew(viewFunc, ...effects);

    newInstance.__setExternals([ map ]);
    return newInstance;
  };

  return instance;
}

