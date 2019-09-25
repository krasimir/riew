import h from './harvester';
import g from './grid';

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

export { compose, serial, parallel } from './utils';
export const harvester = h;
