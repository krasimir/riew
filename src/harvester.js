import equal from 'fast-deep-equal';

import { State } from './state';
import createEffect, { isEffect } from './effect';
import createRiew from './riew';
import reactRiew from './react';
import grid from './grid';
import createEventBus from './eventBus';
import {
  STATE_DESTROY,
  EFFECT_EXPORTED,
  EFFECT_FORK
} from './constants';
import { implementLoggableInterface } from './interfaces';

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
    const product = products[type](...args);

    return product;
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
    (initialValue, loggable) => {
      const emit = createEventBus({
        [ STATE_DESTROY ]: () => {
          const removed = grid.remove(state);

          state.destroy();
          removed.filter(isEffect).forEach(e => {
            if ('__exportedAs' in e) {
              h.undefineProduct(e.__exportedAs);
            }
          });
        },
        [ EFFECT_EXPORTED ]: (effect, name) => {
          effect.__exportedAs = name;
          h.defineProduct(name, () => effect);
        },
        [ EFFECT_FORK ]: (effect, newItem) => {
          const newItems = [ ...effect.items ];

          if (newItem) {
            newItems.push(newItem);
          }

          const newEffect = createEffect(state, newItems, emit);

          grid.add(newEffect, effect.id);
          return newEffect;
        }
      });
      const state = State(initialValue, emit);
      const effect = createEffect(state, [], emit);

      implementLoggableInterface(state, loggable);

      grid.add(state);
      grid.add(effect, state.id);
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
    return createRiew(viewFunc, ...controllers);
  });

  // ------------------------------------------------------------------ reactRiew
  h.defineProduct('reactRiew', (viewFunc, ...controllers) => {
    return reactRiew(viewFunc, ...controllers);
  });
};

const h = Harvester();

defineHarvesterBuiltInCapabilities(h);

export default h;