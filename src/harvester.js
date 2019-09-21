import equal from 'fast-deep-equal';

import { State } from './state';
import createEffect, { isEffect } from './effect';
import createRiew from './riew';
import reactRiew from './react';
import { gridAdd, gridRemove, gridReset, gridGetNodes } from './grid';
import logger from './logger';
import { createEventBus } from './utils';
import {
  STATE_CREATED,
  EFFECT_CREATED,
  EFFECT_REMOVED,
  STATE_DESTROY,
  EFFECT_STEP,
  EFFECT_EXPORTED,
  RIEW_CREATED,
  RIEW_RENDER,
  RIEW_UNMOUNT,
  EFFECT_FORK
} from './constants';

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
    gridReset();
    defineHarvesterBuiltInCapabilities(api);
    logger.clear();
  };
  api.grid = () => gridGetNodes();

  return api;
};

const defineHarvesterBuiltInCapabilities = function (h) {

  // ------------------------------------------------------------------ state
  h.defineProduct(
    'state',
    (initialValue, loggable) => {
      const state = State(initialValue, loggable);
      const emit = createEventBus({
        [ STATE_DESTROY ]: () => {
          const removed = gridRemove(state);

          removed.filter(isEffect).forEach(e => {
            if ('__exportedAs' in e) {
              h.undefineProduct(e.__exportedAs);
            }
            e.cancel();
          });
        },
        [ EFFECT_EXPORTED ]: (effect, name) => {
          effect.__exportedAs = name;
          h.defineProduct(name, () => effect);
          logger.log(EFFECT_EXPORTED, effect, name);
        },
        [ EFFECT_FORK ]: (effect, newItems) => {
          const newEffect = createEffect(state, [ ...effect.__items, ...newItems ], emit);

          gridAdd(newEffect, effect.id);
          return newEffect;
        }
      });
      const effect = createEffect(state, [], emit);

      gridAdd(state);
      gridAdd(effect, state.id);
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
    return createRiew({
      created(riew, props) {
        logger.log(RIEW_CREATED, riew, props, viewFunc, controllers);
      },
      render(riew, props) {
        logger.log(RIEW_RENDER, riew, props, viewFunc, controllers);
      },
      unmount(riew, props) {
        logger.log(RIEW_UNMOUNT, riew, props, viewFunc, controllers);
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
