import equal from 'fast-deep-equal';

import { State } from './state';
import effectFactory from './effect';
import createRiew from './riew';
import reactRiew from './react';
import { gridAddState, gridFreeNode, gridEffectQueueStep, gridAddEffect, gridReset, gridGetNodes } from './grid';

function Harvester() {
  const api = {};
  let commands = {};

  api.defineProduct = (product, func) => {
    if (commands[product]) {
      throw new Error(`An entry with name "${ product }" already exists.`);
    }
    commands[product] = func;
  };
  api.undefineProduct = (product) => {
    if (!commands[product]) {
      throw new Error(`There is no entry with name "${ product }" to be removed.`);
    }
    delete commands[product];
  };
  api.produce = (name, ...args) => {
    if (!commands[name]) {
      throw new Error(`There is no entry with name "${ name }".`);
    }
    return commands[name](...args);
  };
  api.reset = () => {
    commands = {};
    gridReset();
    defineHarvesterBuiltInCapabilities(api);
  };

  return api;
};

const defineHarvesterBuiltInCapabilities = function (h) {
  h.defineProduct('effectFactory', (state) => {
    return effectFactory(state, {
      in(effect) {
        gridAddEffect(effect);
      },
      out(effect) {
        gridFreeNode(effect);
        gridFreeNode(effect.state);
        if ('__exportedAs' in effect) {
          h.undefineProduct(effect.__exportedAs);
        }
      },
      queueStep(effect, q) {
        gridEffectQueueStep([ effect, q ]);
      },
      export(effect, name) {
        effect.__exportedAs = name;
        h.defineProduct(name, () => effect);
      }
    });
  });
  h.defineProduct('state', (initialValue, options = {}) => {
    const state = State(initialValue, options);
    const createEffect = h.produce('effectFactory', state);

    gridAddState(state);
    return createEffect();
  });
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
  h.defineProduct('riew', (viewFunc, ...controllers) => {
    return createRiew(viewFunc, ...controllers);
  });
  h.defineProduct('reactRiew', (viewFunc, ...controllers) => {
    return reactRiew(viewFunc, ...controllers);
  });
};

const h = Harvester();

defineHarvesterBuiltInCapabilities(h);

export default h;
