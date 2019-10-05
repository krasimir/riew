import h from './harvester';
import g from './grid';
import { CANCEL_EFFECT, STATE_VALUE_CHANGE } from './constants';
import { isEffect } from './state';

export const state = (initialValue) => {
  return h.produce('state', initialValue);
};
export const merge = (statesMap) => {
  return h.produce('mergeStates', statesMap);
};
export const riew = (...args) => {
  return h.produce('riew', ...args);
};
export const react = {
  riew: (...args) => {
    return h.produce('reactRiew', ...args);
  }
};
export const use = (name, ...args) => {
  return h.produce(name, ...args);
};
export const register = (name, whatever) => {
  if (typeof whatever === 'object' || typeof whatever === 'function') {
    whatever.__registered = name;
  }
  return h.defineProduct(name, () => whatever);
};
export const reset = () => (g.reset(), h.reset());
export const cancel = effect => effect.emit(CANCEL_EFFECT);
export const subscribe = (effect, initialCall) => {
  if (effect.isMutating()) {
    throw new Error('You should not subscribe an effect that mutates the state. This will lead to endless recursion.');
  }
  if (!isEffect(effect)) {
    throw new Error('You must pass an effect to the subscribe function.');
  }

  if (initialCall) effect();
  const state = grid.getNodeById(effect.stateId);

  return grid.subscribe(
    state,
    STATE_VALUE_CHANGE,
    () => effect(),
    `${ state.id }_${ effect.id }`
  );
};
export const unsubscribe = (effect) => {
  const state = grid.getNodeById(effect.stateId);

  return grid.unsubscribe(
    state,
    STATE_VALUE_CHANGE,
    `${ state.id }_${ effect.id }`
  );
};
export const destroy = (effect) => {
  grid
    .nodes()
    .filter(node => node.id === effect.stateId || node.stateId === effect.stateId)
    .forEach(node => {
      node.destroy();
      grid.remove(node);
      if ('__registered' in node) { // in case of exported effect
        h.undefineProduct(node.__registered);
      }
    });
};
export const test = function (effect, callback) {
  const state = grid.getNodeById(effect.stateId);
  const test = _fork(state, effect);
  const tools = {
    setValue(newValue) {
      test.items = [
        { type: 'map', func: [ () => newValue ] },
        ...test.items
      ];
    },
    swap(index, funcs, type) {
      if (!Array.isArray(funcs)) funcs = [funcs];
      test.items[index].func = funcs;
      if (type) {
        test.items[index].type = type;
      }
    },
    swapFirst(funcs, type) {
      tools.swap(0, funcs, type);
    },
    swapLast(funcs, type) {
      tools.swap(test.items.length - 1, funcs, type);
    }
  };

  callback(tools);
  return test;
};
export const _fork = (state, effect, newItem) => {
  const newItems = [ ...effect.items ];

  if (newItem) {
    newItems.push(newItem);
  }
  return h.produce('effect', state, newItems);
};

export { compose, serial, parallel } from './utils';
export const harvester = h;
export const grid = g;
