import { createState, mergeStates } from './state';
import routine from './react';

export const state = createState;
export const merge = mergeStates;
export const react = { routine };
