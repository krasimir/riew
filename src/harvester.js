import equal from 'fast-deep-equal';

import { State } from './state';
import effectFactory from './effect';
import createRiew from './riew';
import reactRiew from './react';
import { gridAdd, gridFreeNode, gridReset, gridGetNodes } from './grid';

const MAX_NUM_OF_EVENTS = 850;
const STATE_CREATED = 'STATE_CREATED';
const EFFECT_ADDED = 'EFFECT_ADDED';
const EFFECT_REMOVED = 'EFFECT_REMOVED';
const EFFECT_TEARDOWN = 'EFFECT_TEARDOWN';
const EFFECT_STEP = 'EFFECT_STEP';
const EFFECT_EXPORTED = 'EFFECT_EXPORTED';
const RIEW_CREATED = 'RIEW_CREATED';

function Harvester() {
  const api = {};
  const events = [];
  let products = {};

  api.defineProduct = (product, func) => {
    if (products[product]) {
      throw new Error(`An entry with name "${ product }" already exists.`);
    }
    products[product] = func;
  };
  api.undefineProduct = (product) => {
    if (!products[product]) {
      throw new Error(`There is no entry with name "${ product }" to be removed.`);
    }
    delete products[product];
  };
  api.produce = (product, ...args) => {
    if (!products[product]) {
      throw new Error(`There is no entry with name "${ product }".`);
    }
    return products[product](...args);
  };
  api.reset = () => {
    products = {};
    gridReset();
    defineHarvesterBuiltInCapabilities(api);
  };
  api.createRecorder = (shouldRecord = true) => (type, ...payload) => {
    if (__DEV__ && shouldRecord) {
      if (events.length > MAX_NUM_OF_EVENTS) {
        events.shift();
      }
      events.push({ type, payload });
    }
  };
  api.events = () => events;
  api.grid = () => gridGetNodes();

  return api;
};

const defineHarvesterBuiltInCapabilities = function (h) {

  // ---------------------- effect factory
  h.defineProduct('effectFactory', (state, recordEvent) => {
    const factory = effectFactory(state, {
      in(effect) {
        gridAdd(effect);
        recordEvent(EFFECT_ADDED, effect);
      },
      out(effect) {
        gridFreeNode(effect);
        gridFreeNode(effect.state);
        if ('__exportedAs' in effect) {
          h.undefineProduct(effect.__exportedAs);
        }
        recordEvent(EFFECT_REMOVED, effect);
      },
      teardown(effect) {
        recordEvent(EFFECT_TEARDOWN, effect);
      },
      queueStep(effect, q) {
        recordEvent(EFFECT_STEP, effect, q);
      },
      export(effect, name) {
        effect.__exportedAs = name;
        h.defineProduct(name, () => effect);
        recordEvent(EFFECT_EXPORTED, effect, name);
      },
      fork(items) {
        return factory(items);
      }
    });

    return factory;
  });

  // ---------------------- state
  h.defineProduct('state', (initialValue, shouldRecordEvents) => {
    const recordEvent = h.createRecorder(shouldRecordEvents);
    const state = State(initialValue);
    const factory = h.produce('effectFactory', state, recordEvent);
    const effect = factory();

    gridAdd(state);
    recordEvent(STATE_CREATED, state);
    return effect;
  });

  // ---------------------- mergeStates
  h.defineProduct('mergeStates', (statesMap) => {
    const fetchSourceValues = () => Object.keys(statesMap).reduce((result, key) => {
      const [ s ] = statesMap[key];

      result[key] = s();
      return result;
    }, {});
    const effect = h.produce('state');

    effect.state.get = fetchSourceValues;
    effect.state.set = newValue => {
      if (typeof newValue !== 'object') {
        throw new Error('Wrong merged state value. Must be key-value pairs.');
      }
      Object.keys(newValue).forEach(key => {
        if (!statesMap[key]) {
          throw new Error(`There is no state with key "${ key }".`);
        }
        const [ getChildState, setChildState ] = statesMap[key];

        if (!equal(newValue[key], getChildState())) {
          setChildState(newValue[key]);
        }
      }, {});
    };

    Object.keys(statesMap).forEach(key => {
      statesMap[key].pipe(effect.state.triggerListeners).subscribe();
    });

    return effect;
  });

  // ---------------------- riew
  h.defineProduct('riew', (viewFunc, ...controllers) => {
    const r = createRiew(viewFunc, ...controllers);

    h.createRecorder()(RIEW_CREATED, viewFunc, controllers);
    return r;
  });

  // ---------------------- reactRiew
  h.defineProduct('reactRiew', (viewFunc, ...controllers) => {
    return reactRiew(viewFunc, ...controllers);
  });
};

const h = Harvester();

defineHarvesterBuiltInCapabilities(h);

export default h;
