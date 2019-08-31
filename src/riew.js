import { createState as state, isRiewState, isRiewQueueTrigger, MUTABLE } from './state';

function noop() {};
function objectRequired(value, method) {
  if (value === null || (typeof value !== 'undefined' && typeof value !== 'object')) {
    throw new Error(`The riew's "${ method }" method must be called with a key-value object. Instead "${ value }" passed.`);
  }
}

export default function createRiew(viewFunc, controllerFunc = noop, externals = {}) {
  const instance = {};
  let active = false;
  let onOutCallbacks = [];
  let onRender = noop;
  const isActive = () => active;
  const riewProps = state({});
  const updateRiewProps = riewProps.mutate((current, newProps) => ({ ...current, ...newProps }));
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
    props: riewProps,
    isActive
  });
  const updateControllerProps = controllerProps.mutate((current, newProps) => ({ ...current, ...newProps }));

  function callView() {
    viewFunc(viewProps.get(), onRender);
    onRender = noop;
  }
  function processExternals() {
    Object.keys(externals).forEach(key => {
      let isState = isRiewState(externals[key]);
      let isTrigger = isRiewQueueTrigger(externals[key]);
      let s;

      // passing a state
      if (isState) {
        s = externals[key];
        updateControllerProps({ [key]: s });
        updateViewProps({ [key]: s.get() });
        s.stream.pipe(value => updateViewProps({ [key]: value }));

      // passing a trigger
      } else if (isTrigger) {
        let trigger = externals[key];

        if (trigger.__activity() === MUTABLE) {
          throw new Error('Triggers that mutate state can not be sent to the riew. This area is meant only for triggers that fetch data. If you need to pass such triggers use the controller to do that.');
        }

        trigger.__state.stream.filter(isActive).pipe(() => updateViewProps({ [key]: trigger() }))();

      // raw data that is converted to a state
      } else if (key.charAt(0) === '$') {
        const k = key.substr(1, key.length);

        s = state(externals[key]);
        onOutCallbacks.push(s.teardown);
        updateControllerProps({ [k]: s });
        updateViewProps({ [k]: s.get() });
        s.stream.filter(isActive).pipe(value => updateViewProps({ [k]: value }));

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
    updateRiewProps(initialProps);
    processExternals();

    let controllerResult = controllerFunc(controllerProps.get());

    if (controllerResult) {
      if (typeof controllerResult !== 'object') {
        throw new Error('You must return a key-value object from your controller.');
      }
      updateViewProps(controllerResult);
    }
    riewProps.stream();
    viewProps.stream.pipe(callView)();
    return instance;
  };
  instance.update = updateRiewProps;
  instance.out = () => {
    onOutCallbacks.forEach(f => f());
    onOutCallbacks = [];
    riewProps.teardown();
    viewProps.teardown();
    controllerProps.teardown();
    active = false;
    return instance;
  };
  instance.with = (map) => createRiew(viewFunc, controllerFunc, { ...externals, ...map });
  instance.withState = (map) => createRiew(
    viewFunc,
    controllerFunc,
    Object.keys(map).reduce((obj, key) => (obj['$' + key] = map[key], obj), externals)
  );
  instance.test = (map) => createRiew(viewFunc, controllerFunc, { ...externals, ...map });

  return instance;
}
