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
  RIEW_CREATED,
  RIEW_RENDER
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

  // ------------------------------------------------------------------ effect factory
  h.defineProduct('effectFactory', (state, loggable) => {
    const factory = effectFactory(state, {
      in(effect) {
        gridAdd(effect);
        logger.log(EFFECT_ADDED, effect);
      },
      out(effect) {
        gridFreeNode(effect);
        if ('__exportedAs' in effect) {
          h.undefineProduct(effect.__exportedAs);
        }
        logger.log(EFFECT_REMOVED, effect);
      },
      queueStep(effect, q, phase) {
        logger.log(EFFECT_STEP, effect, q, phase);
      },
      teardown(effect) {
        gridFreeNode(effect);
        gridFreeNode(effect.state);
        if ('__exportedAs' in effect) {
          h.undefineProduct(effect.__exportedAs);
        }
        logger.log(EFFECT_TEARDOWN, effect);
      },
      export(effect, name) {
        effect.__exportedAs = name;
        h.defineProduct(name, () => effect);
        logger.log(EFFECT_EXPORTED, effect, name);
      },
      fork(items) {
        return factory(items);
      }
    }, loggable);

    return factory;
  });

  // ------------------------------------------------------------------ state
  h.defineProduct('state', (initialValue, loggable) => {
    const state = State(initialValue, loggable);
    const factory = h.produce('effectFactory', state, loggable);
    const effect = factory();

    gridAdd(state);
    logger.log(STATE_CREATED, state);
    return effect;
  });

  // ------------------------------------------------------------------ mergeStates
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

  // ------------------------------------------------------------------ riew
  h.defineProduct('riew', (viewFunc, ...controllers) => {
    return createRiew({
      created(riew) {
        logger.log(RIEW_CREATED, riew, viewFunc, controllers);
      },
      render(riew, props) {
        logger.log(RIEW_RENDER, riew, props);
      }
    })(viewFunc, ...controllers);
  });

  // ------------------------------------------------------------------ reactRiew
  h.defineProduct('reactRiew', (viewFunc, ...controllers) => {
    return reactRiew(viewFunc, ...controllers);
  });
};

const h = Harvester();

defineHarvesterBuiltInCapabilities(h);

export default h;
