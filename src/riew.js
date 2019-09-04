import { createState as state, isRiewState, queueMethods } from './state';
import registry from './registry';
import { isPromise } from './utils';

function defaultController({ render }) { render(); };
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
function onlyNewStuff(current, newStuff) {
  return newStuff;
}

export default function createRiew(viewFunc, controllerFunc = defaultController, externals = {}) {
  const instance = {};
  let active = false;
  let internalStates = [];
  let onUnmountCallback = () => {};

  const controllerProps = state({});
  const viewProps = state({});
  const input = state({});

  const isActive = () => active;
  const callView = () => {
    viewFunc(viewProps.get());
  };

  // mutations
  const updateViewProps = viewProps.mutate(accumulate);
  const updateControllerProps = controllerProps.mutate(accumulate);
  const updateInput = input.mutate(onlyNewStuff);
  const generateProxies = s => ({
    ...queueMethods.reduce((methods, methodName) => {
      methods[methodName] = (...args) => s.stream[methodName](...args);
      return methods;
    }, {}),
    get: s.get,
    teardown: s.teardown
  });

  // defining the controller api
  updateControllerProps({
    render(props) {
      if (!active) return;
      if (props) updateViewProps(objectRequired(props, 'render'));
      callView();
    },
    state(...args) {
      const s = state(...args);

      internalStates.push(s);
      return s;
    },
    input: generateProxies(input),
    isActive
  });

  // helper functions
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
        updateControllerProps({ [key]: generateProxies(external) });
      } else {
        updateControllerProps({ [key]: external });
        updateViewProps({ [key]: external });
      }
    });
  }

  instance.isActive = isActive;
  instance.mount = (initialProps = {}) => {
    active = true;
    processExternals();
    updateViewProps(objectRequired(initialProps, 'in'));
    updateInput(objectRequired(initialProps, 'in'));

    let controllerResult = controllerFunc(controllerProps.get());
    let done = (result) => {
      onUnmountCallback = result || (() => {});
    };

    if (isPromise(controllerResult)) {
      controllerResult.then(done);
    } else {
      done(controllerResult);
    }
    return instance;
  };
  instance.update = updateInput;
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
