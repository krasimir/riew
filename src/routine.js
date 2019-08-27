import { createState as state, isRineState } from './state';

const noop = function noop() {};

export default function createRoutineInstance(controllerFunc = noop, viewFunc = noop) {
  let active = false;
  let onOutCallbacks = [];
  let statesMap = null;
  let states = null;
  let onRender = noop;
  const instance = state({});
  const updateProps = instance.mutate((current, newProps) => ({ ...current, ...newProps }));

  function isActive() {
    return active;
  }
  function callView() {
    viewFunc(instance.get(), onRender);
    onRender = noop;
  }
  function resolveStates() {
    if (statesMap !== null) {
      updateProps(
        Object.keys(statesMap).reduce((values, key) => {
          if (states === null) states = {};
          let alreadyState = isRineState(statesMap[key]);
          let s = states[key] = alreadyState ? statesMap[key] : state(statesMap[key]);

          if (!alreadyState) onOutCallbacks.push(s.teardown);
          s.stream.pipe(value => updateProps({ [key]: value }));
          values[key] = s.get();
          return values;
        }, {})
      );
    }
  }

  instance.__states = () => states;
  instance.isActive = isActive;
  instance.in = (initialProps) => {
    active = true;
    resolveStates();
    controllerFunc(
      Object.assign(
        {
          render(props) {
            if (!active) return Promise.resolve();
            return new Promise(done => {
              onRender = done;
              updateProps(props);
            });
          },
          props: instance,
          isActive
        },
        states !== null ? { ...states } : {}
      )
    );
    instance.stream.pipe(callView);
    updateProps(initialProps);
    return instance;
  };
  instance.update = updateProps;
  instance.out = () => {
    onOutCallbacks.forEach(f => f());
    onOutCallbacks = [];
    instance.teardown();
    states = null;
    active = false;
    return instance;
  };
  instance.withProps = (map) => {
    statesMap = map;
    return instance;
  };

  return instance;
}
