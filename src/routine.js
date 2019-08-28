/* eslint-disable max-len */
import { createState as state, isRineState } from './state';

const noop = function noop() {};

export default function createRoutineInstance(controllerFunc, viewFunc) {
  if (typeof viewFunc === 'undefined') {
    viewFunc = controllerFunc;
    controllerFunc = noop;
  }
  const instance = {};
  let active = false;
  let onOutCallbacks = [];
  let statesMap = null;
  let states = null;
  let onRender = noop;
  const viewProps = state({});
  const updateViewProps = viewProps.mutate((current, newProps) => ({ ...current, ...newProps }));
  const routineProps = state({});
  const updateRoutineProps = routineProps.mutate((current, newProps) => ({ ...current, ...newProps }));

  function isActive() {
    return active;
  }
  function callView() {
    viewFunc(viewProps.get(), onRender);
    onRender = noop;
  }
  function initializeStates() {
    if (statesMap !== null) {
      return Object.keys(statesMap).reduce((values, key) => {
        if (states === null) states = {};
        let alreadyState = isRineState(statesMap[key]);
        let s = states[key] = alreadyState ? statesMap[key] : state(statesMap[key]);

        if (!alreadyState) onOutCallbacks.push(s.teardown);
        s.stream.pipe(value => updateViewProps({ [key]: value }));
        values[key] = s.get();
        return values;
      }, {});
    }
    return {};
  }
  function objectRequired(value, method) {
    if (value === null || (typeof value !== 'undefined' && typeof value !== 'object')) {
      throw new Error(`The routine's "${ method }" method must be called with a key-value object. Instead "${ value }" passed.`);
    }
  }

  instance.__states = () => states;
  instance.isActive = isActive;
  instance.in = (initialProps) => {
    active = true;
    objectRequired(initialProps, 'in');
    updateRoutineProps(initialProps);
    updateViewProps(initializeStates());
    controllerFunc(
      Object.assign(
        {
          render(props) {
            objectRequired(props, 'render');
            if (!active) return Promise.resolve();
            return new Promise(done => {
              onRender = done;
              updateViewProps(props);
            });
          },
          props: routineProps,
          isActive
        },
        states !== null ? { ...states } : {}
      )
    );
    routineProps.stream();
    viewProps.stream.pipe(callView);
    callView();
    return instance;
  };
  instance.update = updateRoutineProps;
  instance.out = () => {
    onOutCallbacks.forEach(f => f());
    onOutCallbacks = [];
    viewProps.teardown();
    states = null;
    active = false;
    return instance;
  };
  instance.withState = (map) => {
    statesMap = map;
    return instance;
  };

  return instance;
}
