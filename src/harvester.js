import equal from 'fast-deep-equal';

import { State } from './state';
import effectFactory from './effect';
import createRiew from './riew';
import reactRiew from './react';
import { gridAdd, gridFreeNode, gridReset, gridGetNodes } from './grid';
import logger from './logger';
import {
  STATE_CREATED,
  EFFECT_ADDED,
  EFFECT_REMOVED,
  EFFECT_TEARDOWN,
  EFFECT_STEP,
  EFFECT_EXPORTED,
  RIEW_CREATED
} from './constants';

function Harvester() {
  const api = {};
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
        if ('__exportedAs' in effect) {
          h.undefineProduct(effect.__exportedAs);
        }
        recordEvent(EFFECT_REMOVED, effect);
      },
      queueStep(effect, q) {
        recordEvent(EFFECT_STEP, effect, q);
      },
      teardown(effect) {
        gridFreeNode(effect);
        gridFreeNode(effect.state);
        if ('__exportedAs' in effect) {
          h.undefineProduct(effect.__exportedAs);
        }
        recordEvent(EFFECT_TEARDOWN, effect);
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
    const recordEvent = shouldRecordEvents ? logger.log : () => {};
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

    logger.log(RIEW_CREATED, r, viewFunc, controllers);
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
