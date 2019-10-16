import { state, use } from './index';
import { isEffect } from './state';
import { isPromise, parallel, getFuncName, getId } from './utils';
import { STATE_VALUE_CHANGE } from './constants';
import grid from './grid';

function ensureObject(value, context) {
  if (value === null || (typeof value !== 'undefined' && typeof value !== 'object')) {
    throw new Error(`A key-value object expected. Instead "${ value }" passed.`);
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
  const instance = {
    id: getId('r'),
    name: getFuncName(viewFunc)
  };
  let active = false;
  let internalStates = [];
  let onUnmountCallbacks = [];
  let subscriptions = {};
  let externals = {};

  /*

  what if the controller has a central state and we accumulate all the sources in there
  * props go there
  * externals
  * render calls

  And the View is bound to it. If it changes we re-render (if active=true)

  */

  let [ props, updateProps ] = state({});
  let data = {};
  let api = {};

  const isActive = () => active;

  const updateData = newStuff => {
    ensureObject(newStuff);

    let result = {};

    Object.keys(newStuff).forEach(key => {
      if (isEffect(newStuff[key]) && !newStuff[key].isMutating()) {
        const effect = newStuff[key];
        const state = grid.getNodeById(effect.stateId);

        result[key] = effect();
        if (!subscriptions[effect.stateId]) subscriptions[effect.stateId] = {};
        subscriptions[effect.stateId][key] = effect;
        grid.subscribe(instance).to(state).when(
          STATE_VALUE_CHANGE,
          () => {
            updateData(Object.keys(subscriptions[effect.stateId]).reduce((effectsResult, key) => {
              effectsResult[key] = subscriptions[effect.stateId][key]();
              return effectsResult;
            }, {}));
            render();
          }
        );
      } else {
        result[key] = newStuff[key];
      }
    });
    data = accumulate(data, result);
  };
  const render = () => {
    if (isActive()) {
      viewFunc(data);
    }
  };
  const updateControllerAPI = newMethods => (api = accumulate(api, newMethods));

  // defining the controller api
  updateControllerAPI({
    state(...args) {
      const s = state(...args);

      internalStates.push(s);
      return s;
    },
    render(newData) {
      if (newData) updateData(newData);
      return render();
    },
    isActive,
    props
  });

  function processExternals() {
    Object.keys(externals).forEach(key => {
      let external;

      if (key.charAt(0) === '@') {
        key = key.substr(1, key.length);
        external = use(key);
      } else {
        external = externals[key];
      }

      updateData({ [key]: external });
      updateControllerAPI({ [key]: external });
    });
  }

  instance.isActive = isActive;
  instance.mount = (initialData = {}) => {
    updateData(initialData);
    updateProps(initialData);
    processExternals();
    props.mutate()(initialData);

    let controllersResult = parallel(...controllers)(api);
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
  instance.update = (newData) => {
    updateData(newData);
    updateProps(newData);
    render();
  };
  instance.unmount = () => {
    active = false;
    internalStates.forEach(s => s.destroy());
    internalStates = [];
    onUnmountCallbacks.filter(f => typeof f === 'function').forEach(f => f());
    onUnmountCallbacks = [];
    Object.keys(subscriptions).forEach(stateId => grid.unsubscribe(instance).from(grid.getNodeById(stateId)));
    subscriptions = {};
    return instance;
  };
  instance.with = (...maps) => {
    instance.__setExternals(maps);
    return instance;
  };
  instance.test = (map) => {
    const newInstance = createRiew(viewFunc, ...controllers);

    newInstance.__setExternals([ map ]);
    return newInstance;
  };
  instance.__setExternals = (maps) => {
    externals = { ...externals, ...normalizeExternalsMap(maps) };
  };
  instance.__data = data;

  return instance;
};
