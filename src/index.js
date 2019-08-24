import { createState, mergeStates } from './state';
import routine from './react';
import { compose as c } from './utils';

export const state = createState;
export const merge = mergeStates;
export const compose = c;
export const react = { routine };
