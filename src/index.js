import R from './registry';
import Grid from './grid';
import { CHANNELS } from './csp';
import Logger from './logger';
import { resetIds } from './utils';
import reactRiew from './react';

export * from './riew';
export * from './csp';

export const react = {
  riew: (...args) => reactRiew(...args),
};
export const use = (name, ...args) => R.produce(name, ...args);
export const register = (name, whatever) => {
  if (typeof whatever === 'object' || typeof whatever === 'function') {
    whatever.__registered = name;
  }
  R.defineProduct(name, () => whatever);
  return whatever;
};
export const logger = new Logger();
export const grid = new Grid();
export const reset = () => (
  resetIds(), grid.reset(), R.reset(), CHANNELS.reset(), logger.reset()
);
export const registry = R;
