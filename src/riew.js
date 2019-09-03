import { createState as state, isRiewState, isRiewQueueTrigger, IMMUTABLE } from './state';
import registry from './registry';
import { isObjectLiteral, isPromise } from './utils';

function noop() {};
function objectRequired(value, method) {
  if (value === null || (typeof value !== 'undefined' && typeof value !== 'object')) {
    throw new Error(`The riew's "${ method }" method must be called with a key-value object. Instead "${ value }" passed.`);
  }
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

export default function createRiew(viewFunc, controllerFunc = noop, externals = {}) {
  const instance = {};
  let active = false;
  let subscribedStates = [];
  let onPropsCallback;
  const isActive = () => active;
  const viewProps = state({});
  const updateViewProps = viewProps.mutate((current, newProps) => {
    const result = { ...current };

    Object.keys(newProps).forEach(key => {
      if (isRiewState(newProps[key])) {
        let s = newProps[key];

        result[key] = s.get();
        if (!subscribedStates.find(({ id }) => id === s.id)) {
          subscribedStates.push(s);
          s.stream.filter(isActive).pipe(value => updateViewProps({ [key]: value }));
        }
      } else {
        result[key] = newProps[key];
      }
    });
    return result;
  });
  const riewProps = state({});
  const updateRiewProps = (newProps) => {
    const transformed = (onPropsCallback || ((p) => p))(newProps);

    if (isObjectLiteral(transformed)) {
      riewProps.set(transformed);
    } else {
      riewProps.set(newProps);
    }
  };
  const controllerProps = state({
    render(props) {
      if (!active) return;
      objectRequired(props, 'render');
      updateViewProps(props);
    },
    props(callback) {
      onPropsCallback = callback;
    },
    isActive
  });
  const updateControllerProps = controllerProps.mutate((current, newProps) => ({ ...current, ...newProps }));

  function callView() {
    viewFunc({ ...riewProps.get(), ...viewProps.get() });
  }
  function processExternals() {
    Object.keys(externals).forEach(key => {
      let isTrigger = isRiewQueueTrigger(externals[key]);

      // passing a trigger
      if (isTrigger) {
        let trigger = externals[key];

        updateControllerProps({ [key]: trigger });
        // subscribe only if the trigger is not mutating the state
        if (trigger.__activity() === IMMUTABLE) {
          trigger.__state.stream.filter(isActive).pipe(() => updateViewProps({ [key]: trigger() }))();
        } else {
          console.warn('In the view you are not allowed to use directly a trigger that mutates the state. If you need that pass a prop from the controller to the view.');
        }

      // in the registry
      } else if (key.charAt(0) === '@') {
        const k = key.substr(1, key.length);

        updateControllerProps({ [k]: registry.get(k) });
        updateViewProps({ [k]: registry.get(k) });

      // proxy the rest
      } else {
        updateControllerProps({ [key]: externals[key] });
        updateViewProps({ [key]: externals[key] });
      }
    });
  }

  instance.isActive = isActive;
  instance.in = (initialProps = {}) => {
    active = true;
    objectRequired(initialProps, 'in');
    processExternals();

    let controllerResult = controllerFunc(controllerProps.get());
    let done = (result) => {
      if (isObjectLiteral(result)) {
        updateViewProps(result); // <-- this triggers the first render
      } else {
        callView(); // <-- this triggers the first render
      }
    };

    updateRiewProps(initialProps);

    riewProps.stream.filter(isActive).pipe(callView);
    viewProps.stream.filter(isActive).pipe(callView);

    if (isPromise(controllerResult)) {
      controllerResult.then(done);
    } else {
      done(controllerResult);
    }
    return instance;
  };
  instance.update = updateRiewProps;
  instance.out = () => {
    subscribedStates.forEach(s => s.teardown());
    subscribedStates = [];
    riewProps.teardown();
    viewProps.teardown();
    controllerProps.teardown();
    active = false;
    return instance;
  };
  instance.with = (...maps) => createRiew(viewFunc, controllerFunc, { ...externals, ...normalizeExternalsMap(maps) });
  instance.test = (map) => createRiew(viewFunc, controllerFunc, { ...externals, ...map });

  return instance;
}
