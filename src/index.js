import h from './harvester';
import g from './grid';
import { CHANNELS } from './csp';

export * from './csp';

export const riew = (...args) => h.produce('riew', ...args);
export const react = {
  riew: (...args) => h.produce('reactRiew', ...args),
};
export const chan = (...args) => h.produce('channel', ...args);
export const state = (...args) => h.produce('state', ...args);
export const use = (name, ...args) => h.produce(name, ...args);
export const register = (name, whatever) => {
  if (typeof whatever === 'object' || typeof whatever === 'function') {
    whatever.__registered = name;
  }
  h.defineProduct(name, () => whatever);
  return whatever;
};
export const reset = () => (g.reset(), h.reset(), CHANNELS.reset());
export const harvester = h;
export const grid = g;
