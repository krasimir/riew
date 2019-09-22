import { state, use } from './index';
import { isEffect } from './effect';
import { isPromise, parallel, getFuncName, getId } from './utils';
import createEventBus from './eventBus';
import { RIEW_RENDER, RIEW_UNMOUNT, RIEW_CREATED } from './constants';
import { implementLoggableInterface } from './interfaces';

export function isRiew(riew) {
  return riew && riew.mount && riew.unmount;
}

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
const emit = createEventBus();

export default function createRiew(viewFunc, ...controllers) {
  const instance = { id: getId('r'), name: getFuncName(viewFunc) };
  let active = false;
  let internalStates = [];
  let subscriptions = [];
  let onUnmountCallbacks = [];
  let externals = {};

  const [ input ] = state({}, false);
  const [ output ] = state({}, false);
  const [ api ] = state({}, false);

  const isActive = () => active;
  const isSubscribed = s => !!subscriptions.find(effect => effect.state.id === s.id);

  implementLoggableInterface(instance);

  // effects
  const updateOutput = output.mutate((current, newStuff) => {
    const result = { ...current };

    if (newStuff) {
      Object.keys(newStuff).forEach(key => {
        if (isEffect(newStuff[key]) && !newStuff[key].isMutating()) {
          const effect = newStuff[key];

          result[key] = effect();
          if (!isSubscribed(effect.state)) {
            subscriptions.push(
              effect.pipe(() => render({ [key]: effect() })).subscribe().loggability(false)
            );
          }
        } else {
          result[key] = newStuff[key];
        }
      });
    }
    return result;
  });
  const render = updateOutput.filter(isActive).pipe(value => {
    viewFunc(value);
    emit(RIEW_RENDER, instance, value);
  });
  const updateAPI = api.mutate(accumulate);
  const updateInput = input.mutate(accumulate);

  // defining the controller api
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
        external = use(key);
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

    let controllersResult = parallel(...controllers)(api());
    let done = (result) => (onUnmountCallbacks = result || []);

    if (isPromise(controllersResult)) {
      controllersResult.then(done);
    } else {
      done(controllersResult);
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
    output.destroy();
    api.destroy();
    internalStates.forEach(s => s.destroy());
    internalStates = [];
    onUnmountCallbacks.filter(f => typeof f === 'function').forEach(f => f());
    onUnmountCallbacks = [];
    subscriptions.forEach(s => s.unsubscribe());
    subscriptions = [];
    emit(RIEW_UNMOUNT, instance, output());
    return instance;
  };
  instance.__setExternals = (maps) => {
    externals = { ...externals, ...normalizeExternalsMap(maps) };
  };

  instance.with = (...maps) => {
    const newInstance = createRiew(viewFunc, ...controllers);

    newInstance.__setExternals(maps);
    return newInstance;
  };
  instance.test = (map) => {
    const newInstance = createRiew(viewFunc, ...controllers);

    newInstance.__setExternals([ map ]);
    return newInstance;
  };

  emit(RIEW_CREATED, instance, output());
  return instance;
};
