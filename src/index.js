import h from './harvester';
import g from './grid';
import { implementStateProxyInterface } from './interfaces';

export const state = implementStateProxyInterface((initialValue, loggable = true, name = 'unknown') => {
  return h.produce('state', initialValue, loggable, name);
});
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
export const grid = g;
