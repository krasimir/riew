import { createState, mergeStates } from './state';
import rawRoutine from './routine';
import reactRoutine from './react';

export const state = createState;
export const merge = mergeStates;
export const routine = rawRoutine;
export const react = { routine: reactRoutine };
