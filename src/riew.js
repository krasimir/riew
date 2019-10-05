import { state, use, subscribe, unsubscribe } from './index';
import { isEffect } from './state';
import { isPromise, parallel, getFuncName, getId } from './utils';
import { RIEW_RENDER, RIEW_UNMOUNT } from './constants';
import { implementObservableInterface } from './interfaces';

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

export default function createRiew(viewFunc, ...controllers) {
  const instance = { id: getId('r'), name: getFuncName(viewFunc) };
  let active = false;
  let internalStates = [];
  let onUnmountCallbacks = [];
  let subscriptions = [];
  let externals = {};

  const [ input ] = state({}, false);
  const [ output ] = state({}, false);
  const [ api ] = state({}, false);

  const isActive = () => active;

  implementObservableInterface(instance);

  // effects
  const updateOutput = output.mutate((current, newStuff) => {
    const result = { ...current };

    if (newStuff) {
      Object.keys(newStuff).forEach(key => {
        if (isEffect(newStuff[key]) && !newStuff[key].isMutating()) {
          const effect = newStuff[key];

          result[key] = effect();
          // const updateEffect = effect.pipe(() => render({ [key]: effect() }));

          // subscribe(updateEffect);
        } else {
          result[key] = newStuff[key];
        }
      });
    }
    return result;
  });
  const render = updateOutput.filter(isActive).pipe(value => {
    viewFunc(value);
    instance.emit(RIEW_RENDER, value);
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
    subscriptions.forEach(s => unsubscribe(s.effect));
    subscriptions = [];
    instance.emit(RIEW_UNMOUNT, output());
    return instance;
  };
  instance.with = (...maps) => {
    instance.__setExternals(maps);
    return instance;
  };
  instance.test = (map) => {
    const newInstance = createRiew(viewFunc, ...controllers);

    newInstance.__setExternals([ map ]);
    return newInstance;
  };
  instance.__setExternals = (maps) => {
    externals = { ...externals, ...normalizeExternalsMap(maps) };
  };
  instance.__output = output;

  return instance;
};
