/* eslint-disable max-len */
import { createState as state, isRineState, isRineQueueTrigger } from './state';

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
  let triggers = null;
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
      Object.keys(statesMap).forEach(key => {
        if (states === null) states = {};
        if (triggers === null) triggers = {};
        let isState = isRineState(statesMap[key]);
        let isTrigger = isRineQueueTrigger(statesMap[key]);
        let s;

        // passing a state
        if (isState) {
          s = statesMap[key];
          updateViewProps({ [key]: s.get() });
          s.stream.pipe(value => updateViewProps({ [key]: value }));
          states[key] = s;

        // passing a trigger
        } else if (isTrigger) {
          triggers[key] = statesMap[key];
          statesMap[key].__state.stream.filter(isActive).pipe(callView);
          updateViewProps({ [key]: triggers[key] });

        // raw data that is converted to a state
        } else {
          s = state(statesMap[key]);
          onOutCallbacks.push(s.teardown);
          updateViewProps({ [key]: s.get() });
          s.stream.filter(isActive).pipe(value => updateViewProps({ [key]: value }));
          states[key] = s;
        }
      });
    }
  }
  function objectRequired(value, method) {
    if (value === null || (typeof value !== 'undefined' && typeof value !== 'object')) {
      throw new Error(`The routine's "${ method }" method must be called with a key-value object. Instead "${ value }" passed.`);
    }
  }

  instance.__states = () => states;
  instance.__triggers = () => triggers;
  instance.isActive = isActive;
  instance.in = (initialProps) => {
    active = true;
    objectRequired(initialProps, 'in');
    updateRoutineProps(initialProps);
    initializeStates();
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
        states !== null ? { ...states, ...triggers } : {}
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
