import { createState as state, isRiewQueueTrigger } from './state';
import registry from './registry';
import { isPromise, parallel } from './utils';

function ensureObject(value, context) {
  if (value === null || (typeof value !== 'undefined' && typeof value !== 'object')) {
    throw new Error(`${ context } must be called with a key-value object. Instead "${ value }" passed.`);
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
const accumulate = (current, newStuff) => ({ ...current, ...newStuff });

export default function createRiew(viewFunc, ...controllers) {
  const instance = {};
  let active = false;
  let internalStates = [];
  let subscriptions = [];
  let onUnmountCallbacks = [];
  let externals = {};

  const [ input ] = state({});
  const [ output ] = state({});
  const [ api ] = state({});

  const isActive = () => active;
  const isSubscribed = s => !!subscriptions.find(trigger => trigger.state.id === s.id);

  // triggers
  const updateOutput = output.mutate((current, newStuff) => {
    const result = { ...current };

    if (newStuff) {
      Object.keys(newStuff).forEach(key => {
        if (isRiewQueueTrigger(newStuff[key]) && !newStuff[key].isMutating()) {
          const trigger = newStuff[key];

          result[key] = trigger();
          if (!isSubscribed(trigger.state)) {
            subscriptions.push(
              trigger.pipe(() => render({ [key]: trigger() })).subscribe()
            );
          }
        } else {
          result[key] = newStuff[key];
        }
      });
    }
    return result;
  });
  const render = updateOutput.filter(isActive).pipe(value => viewFunc(value));
  const updateAPI = api.mutate(accumulate);
  const updateInput = input.mutate(accumulate);

  // defining the controller api
  updateAPI({
    state(...args) {
      const s = state(...args);

      internalStates.push(s);
      return s;
    },
    render(newProps) {
      ensureObject(newProps, 'The `render` method');
      return render(newProps);
    },
    isActive,
    props: input
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

      updateOutput({ [key]: external });
      updateAPI({ [key]: external });
    });
  }

  instance.isActive = isActive;
  instance.mount = (initialProps = {}) => {
    ensureObject(initialProps, 'The `mount` method');
    updateInput(initialProps);
    updateOutput(initialProps);
    processExternals();

    let controllersResult = parallel(...controllers)(api());
    let done = (result) => (onUnmountCallbacks = result || []);

    if (isPromise(controllersResult)) {
      controllersResult.then(done);
    } else {
      done(controllersResult);
    }

    active = true;
    render();
    return instance;
  };
  instance.update = (newProps) => {
    render(newProps);
    updateInput(newProps);
  };
  instance.unmount = () => {
    active = false;
    output.teardown();
    api.teardown();
    internalStates.forEach(s => s.teardown());
    internalStates = [];
    onUnmountCallbacks.filter(f => typeof f === 'function').forEach(f => f());
    onUnmountCallbacks = [];
    subscriptions.forEach(s => s.unsubscribe());
    subscriptions = [];
    return instance;
  };
  instance.__setExternals = (maps) => {
    externals = { ...externals, ...normalizeExternalsMap(maps) };
  };

  instance.with = (...maps) => {
    const newInstance = createRiew(viewFunc, ...controllers);

    newInstance.__setExternals(maps);
    return newInstance;
  };
  instance.test = (map) => {
    const newInstance = createRiew(viewFunc, ...controllers);

    newInstance.__setExternals([ map ]);
    return newInstance;
  };

  return instance;
}

