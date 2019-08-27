/* eslint-disable max-len */
import { createState as state, isRineState } from './state';

const noop = function noop() {};

export default function createRoutineInstance(controllerFunc = noop, viewFunc = noop) {
  const instance = {};
  let active = false;
  let onOutCallbacks = [];
  let statesMap = null;
  let states = null;
  let onRender = noop;
  const viewProps = state({});
  const updateViewProps = viewProps.mutate((current, newProps) => ({ ...current, ...newProps }));

  function isActive() {
    return active;
  }
  function callView() {
    viewFunc(viewProps.get(), onRender);
    onRender = noop;
  }
  function applyAndHookStates() {
    if (statesMap !== null) {
      updateViewProps(
        Object.keys(statesMap).reduce((values, key) => {
          if (states === null) states = {};
          let alreadyState = isRineState(statesMap[key]);
          let s = states[key] = alreadyState ? statesMap[key] : state(statesMap[key]);

          if (!alreadyState) onOutCallbacks.push(s.teardown);
          s.stream.pipe(value => updateViewProps({ [key]: value }));
          values[key] = s.get();
          return values;
        }, {})
      );
    }
  }
  function objectRequired(method, value) {
    if (value === null || (typeof value !== 'undefined' && typeof value !== 'object')) {
      throw new Error(`The routine's "${ method }" method must be called with a key-value object. Instead "${ value }" passed.`);
    }
  }

  instance.__states = () => states;
  instance.isActive = isActive;
  instance.in = (initialProps) => {
    active = true;
    objectRequired('in', initialProps);
    updateViewProps(initialProps);
    applyAndHookStates();
    controllerFunc(
      Object.assign(
        {
          render(props) {
            objectRequired('render', props);
            if (!active) return Promise.resolve();
            return new Promise(done => {
              onRender = done;
              updateViewProps(props);
            });
          },
          props: viewProps,
          isActive
        },
        states !== null ? { ...states } : {}
      )
    );
    viewProps.stream.pipe(callView);
    viewProps.stream();
    return instance;
  };
  instance.update = updateViewProps;
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
