/* eslint-disable max-len */
import { createState as state, isRineState, isRineQueueTrigger, MUTABLE } from './state';

function noop() {};
function objectRequired(value, method) {
  if (value === null || (typeof value !== 'undefined' && typeof value !== 'object')) {
    throw new Error(`The routine's "${ method }" method must be called with a key-value object. Instead "${ value }" passed.`);
  }
}

export default function createRoutineInstance(controllerFunc, viewFunc) {
  if (typeof viewFunc === 'undefined') {
    viewFunc = controllerFunc;
    controllerFunc = noop;
  }
  const instance = {};
  let active = false;
  let onOutCallbacks = [];
  let statesMap = null;
  let onRender = noop;
  const isActive = () => active;
  const routineProps = state({});
  const updateRoutineProps = routineProps.mutate((current, newProps) => ({ ...current, ...newProps }));
  const viewProps = state({});
  const updateViewProps = viewProps.mutate((current, newProps) => ({ ...current, ...newProps }));
  const controllerProps = state({
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
  });
  const updateControllerProps = controllerProps.mutate((current, newProps) => ({ ...current, ...newProps }));

  function callView() {
    viewFunc(viewProps.get(), onRender);
    onRender = noop;
  }
  function initializeStates() {
    if (statesMap !== null) {
      Object.keys(statesMap).forEach(key => {
        let isState = isRineState(statesMap[key]);
        let isTrigger = isRineQueueTrigger(statesMap[key]);
        let s;

        // passing a state
        if (isState) {
          s = statesMap[key];
          updateControllerProps({ [key]: s });
          updateViewProps({ [key]: s.get() });
          s.stream.pipe(value => updateViewProps({ [key]: value }));

        // passing a trigger
        } else if (isTrigger) {
          let trigger = statesMap[key];

          if (trigger.__activity() === MUTABLE) {
            throw new Error('Triggers that mutate state can not be sent to the routine. This area is meant only for triggers that fetch data. If you need pass such triggers use the controller for that.');
          }

          trigger.__state.stream.filter(isActive).pipe(() => updateViewProps({ [key]: trigger() }))();

        // raw data that is converted to a state
        } else {
          s = state(statesMap[key]);
          onOutCallbacks.push(s.teardown);
          updateControllerProps({ [key]: s });
          updateViewProps({ [key]: s.get() });
          s.stream.filter(isActive).pipe(value => updateViewProps({ [key]: value }));
        }
      });
    }
  }

  instance.isActive = isActive;
  instance.in = (initialProps) => {
    active = true;
    objectRequired(initialProps, 'in');
    updateRoutineProps(initialProps);
    initializeStates();

    let controllerResult = controllerFunc(controllerProps.get());

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
    controllerProps.teardown();
    active = false;
    return instance;
  };
  instance.with = (map) => {
    statesMap = map;
    return instance;
  };
  instance.test = (map) => {
    return createRoutineInstance(controllerFunc, viewFunc).with(map);
  };

  return instance;
}
