import equal from 'fast-deep-equal';

import { State } from './state';
import createRiew from './riew';
import reactRiew from './react';
import grid from './grid';
import { STATE_VALUE_CHANGE } from './constants';
import { subscribe } from './index';

function Harvester() {
  const api = {};
  let products = {};

  api.defineProduct = (type, func) => {
    if (products[type]) {
      throw new Error(`A product with type "${ type }" already exists.`);
    }
    products[type] = func;
  };
  api.undefineProduct = (type) => {
    if (!products[type]) {
      throw new Error(`There is no product with type "${ type }" to be removed.`);
    }
    delete products[type];
  };
  api.produce = (type, ...args) => {
    if (!products[type]) {
      throw new Error(`There is no product with type "${ type }".`);
    }
    return products[type](...args);
  };
  api.reset = () => {
    products = {};
    defineHarvesterBuiltInCapabilities(api);
  };

  return api;
};

const defineHarvesterBuiltInCapabilities = function (h) {

  // ------------------------------------------------------------------ state
  h.defineProduct(
    'state',
    (initialValue) => {
      const state = State(initialValue);

      grid.add(state);
      return h.produce('effect', state);
    }
  );

  // ------------------------------------------------------------------ effect
  h.defineProduct(
    'effect',
    (state, items = []) => {
      const effect = state.createEffect(items);

      grid.add(effect);
      return effect;
    }
  );

  // ------------------------------------------------------------------ mergeStates
  h.defineProduct('mergeStates', (statesMap) => {
    const fetchSourceValues = () => Object.keys(statesMap).reduce((result, key) => {
      const [ s ] = statesMap[key];

      result[key] = s();
      return result;
    }, {});
    const effect = h.produce('state');
    const sInstance = grid.getNodeById(effect.stateId);

    sInstance.get = fetchSourceValues;
    sInstance.set = newValue => {
      if (typeof newValue !== 'object') {
        throw new Error('Wrong merged state value. Must be key-value pairs.');
      }
      Object.keys(newValue).forEach(key => {
        if (!statesMap[key]) {
          throw new Error(`There is no state with key "${ key }".`);
        }
        const [ , setChildState ] = statesMap[key];

        setChildState(newValue[key]);
      }, {});
    };

    Object.keys(statesMap).forEach(key => {
      subscribe(statesMap[key].pipe(() => {
        sInstance.emit(STATE_VALUE_CHANGE, fetchSourceValues());
      }));
    });

    return effect;
  });

  // ------------------------------------------------------------------ riew
  h.defineProduct('riew', (viewFunc, ...controllers) => {
    const riew = createRiew(viewFunc, ...controllers);

    grid.add(riew);
    return riew;
  });

  // ------------------------------------------------------------------ reactRiew
  h.defineProduct('reactRiew', (viewFunc, ...controllers) => {
    return reactRiew(viewFunc, ...controllers);
  });
};

const h = Harvester();

defineHarvesterBuiltInCapabilities(h);

export default h;
