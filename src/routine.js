/* eslint-disable max-len */
import { createState as state, isRineState, isRineQueueTrigger, MUTABLE } from './state';

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
      Object.keys(statesMap).forEach(key => {
        if (states === null) states = {};
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
          let trigger = statesMap[key];

          if (trigger.__activity() === MUTABLE) {
            throw new Error('Triggers that mutate state can not be sent to the routine. This area is meant only for triggers that fetch data. If you need pass such triggers use the controller for that.');
          }

          statesMap[key].__state.stream
            .filter(isActive)
            .pipe(() => updateViewProps({ [key]: trigger() }))();

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
  instance.isActive = isActive;
  instance.in = (initialProps) => {
    active = true;
    objectRequired(initialProps, 'in');
    updateRoutineProps(initialProps);
    initializeStates();

    let controllerResult = controllerFunc(
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

    if (controllerResult) {
      if (typeof controllerResult !== 'object') {
        throw new Error('You must return a key-value object from your controller.');
      }
      updateViewProps(controllerResult);
    }
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
  instance.test = (map) => {
    return createRoutineInstance(controllerFunc, viewFunc).withState(map);
  };

  return instance;
}
