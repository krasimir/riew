import { createState, mergeStates } from './state';
import routine from './react';
import utils from './utils';

export const state = createState;
export const merge = mergeStates;
export const compose = utils.compose;
export const react = { routine };
