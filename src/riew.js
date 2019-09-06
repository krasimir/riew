import { createState as state, isRiewState } from './state';
import registry from './registry';
import { isPromise, parallel } from './utils';

function ensureObject(value, context) {
  if (value === null || (typeof value !== 'undefined' && typeof value !== 'object')) {
    throw new Error(`"${ context }" must be called with a key-value object. Instead "${ value }" passed.`);
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
function accumulate(current, newStuff) {
  return { ...current, ...newStuff };
}

export default function createRiew(viewFunc, ...effects) {
  const instance = {};
  let active = false;
  let internalStates = [];
  let subscriptions = [];
  let onUnmountCallbacks = [];
  let externals = {};

  const effectsProps = state({});
  const viewProps = state({});

  const isActive = () => active;

  // triggers
  const updateViewProps = viewProps.mutate(accumulate);
  const render = updateViewProps.filter(isActive).pipe(value => viewFunc(value));
  const updateEffectsProps = effectsProps.mutate(accumulate);

  // defining the effect api
  updateEffectsProps({
    state(...args) {
      const s = state(...args);

      internalStates.push(s);
      return s;
    },
    render,
    isActive
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

      if (isRiewState(external)) {
        subscriptions.push(
          state.filter(isActive).map(value => ({ [key]: value })).pipe(render).subscribe(true)
        );
      } else {
        updateViewProps({ [key]: external });
      }
      updateEffectsProps({ [key]: external });
    });
  }

  instance.isActive = isActive;
  instance.mount = (initialProps = {}) => {
    ensureObject(initialProps, 'The `mount` method');
    processExternals();

    let effectsResult = parallel(...effects)(effectsProps.get());
    let done = (result) => (onUnmountCallbacks = result || []);

    if (isPromise(effectsResult)) {
      effectsResult.then(done);
    } else {
      done(effectsResult);
    }

    active = true;
    render(initialProps);
    return instance;
  };
  instance.update = updateViewProps;
  instance.unmount = () => {
    internalStates.forEach(s => s.teardown());
    internalStates = [];
    viewProps.teardown();
    effectsProps.teardown();
    active = false;
    onUnmountCallbacks.forEach(f => f());
    return instance;
  };
  instance.with = (...maps) => createRiew(viewFunc, controllerFunc, { ...externals, ...normalizeExternalsMap(maps) });
  instance.test = (map) => createRiew(viewFunc, controllerFunc, { ...externals, ...map });

  return instance;
}
