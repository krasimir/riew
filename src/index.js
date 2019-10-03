import h from './harvester';
import g from './grid';
import { CANCEL_EVENT, STATE_VALUE_CHANGE } from './constants';

export const state = (initialValue, loggable = true) => {
  return h.produce('state', initialValue, loggable);
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
  return h.defineProduct(name, () => whatever);
};
export const reset = () => {
  h.reset();
  g.reset();
};
export const cancel = event => {
  g.emit(CANCEL_EVENT, event);
};
export const subscribe = (effect, initialCall) => {
  if (effect.isMutating()) {
    throw new Error('You should not subscribe an effect that mutates the state. This will lead to endless recursion.');
  }

  if (initialCall) effect();
  return effect.unsubscribe = effect.state.on(STATE_VALUE_CHANGE, () => effect());
};
export const unsubscribe = (effect) => {
  if (effect.unsubscribe) {
    effect.unsubscribe();
  } else {
    console.warn(`Not subscribed yet. (${ effect.id })`);
  }
};
export const destroy = effect => {
  effect.state.destroy();
};

export { compose, serial, parallel } from './utils';
export const harvester = h;
export const grid = g;
