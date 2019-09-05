import { createState as state, isRiewState } from './state';
import registry from './registry';
import { isPromise } from './utils';

function defaultController() {};
function objectRequired(value, method) {
  if (value === null || (typeof value !== 'undefined' && typeof value !== 'object')) {
    throw new Error(`The riew's "${ method }" method must be called with a key-value object. Instead "${ value }" passed.`);
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

export default function createRiew(viewFunc, controllerFunc = defaultController, externals = {}) {
  const instance = {};
  let active = false;
  let internalStates = [];
  let subscriptions = [];
  let onUnmountCallback = () => {};

  const controllerProps = state({});
  const viewProps = state({});

  const isActive = () => active;

  // triggers
  const updateViewProps = viewProps.mutate(accumulate);
  const render = updateViewProps.filter(isActive).pipe(value => viewFunc(value));
  const updateControllerProps = controllerProps.mutate(accumulate);

  // defining the controller api
  updateControllerProps({
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
      updateControllerProps({ [key]: external });
    });
  }

  instance.isActive = isActive;
  instance.mount = (initialProps = {}) => {
    processExternals();
    updateViewProps(objectRequired(initialProps, 'mount'));

    let controllerResult = controllerFunc(controllerProps.get());
    let done = (result) => {
      onUnmountCallback = result || (() => {});
      active = true;
      render();
    };

    if (isPromise(controllerResult)) {
      controllerResult.then(done);
    } else {
      done(controllerResult);
    }
    return instance;
  };
  instance.update = updateViewProps;
  instance.unmount = () => {
    internalStates.forEach(s => s.teardown());
    internalStates = [];
    viewProps.teardown();
    controllerProps.teardown();
    active = false;
    onUnmountCallback();
    return instance;
  };
  instance.with = (...maps) => createRiew(viewFunc, controllerFunc, { ...externals, ...normalizeExternalsMap(maps) });
  instance.test = (map) => createRiew(viewFunc, controllerFunc, { ...externals, ...map });

  return instance;
}
