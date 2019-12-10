import h from './harvester';
import g from './grid';
import { haltAll } from './csp';
export * from './csp';

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
  h.defineProduct(name, () => whatever);
  return whatever;
};
export const reset = () => (g.reset(), h.reset(), haltAll());
export const harvester = h;
export const grid = g;
