import h from './harvester';

export const state = (initialValue) => {
  return h.produce('state', initialValue, true);
};
export const internalState = (initialValue) => {
  return h.produce('state', initialValue, false);
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

export { compose, serial, parallel } from './utils';
export const harvester = h;
