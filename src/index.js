import { createState, mergeStates } from './state';
import rawRiew from './riew';
import reactRiew from './react';

export const state = createState;
export const merge = mergeStates;
export const riew = rawRiew;
export const react = { riew: reactRiew };
export { compose, serial, parallel } from './utils';
