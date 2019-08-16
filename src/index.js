import System from './api/System';
import Registry from './api/Registry';

export { default as System } from './api/System';

export { default as rine } from './api/routine';
export { default as state } from './api/state';
export { default as connect } from './api/connect';
export const put = System.put.bind(System);
export const take = System.take.bind(System);
export const takeEvery = System.takeEvery.bind(System);
export const register = Registry.set.bind(Registry);
export const resolver = Registry.resolver.bind(Registry);
