import { sliding, fixed } from 'riew';

export const ANSWER = fixed();
export const START_OVER = fixed();
export const NEXT_STEP = sliding();
export const RESET_ERROR = sliding();
export const SET_ERROR = sliding();
export const IS_COMPLETED = sliding();
export const CURRENT_QUESTION = sliding();
export const GET_ERROR = sliding();
export const GET_QUESTIONS = sliding();
export const NEXT_STEP_CLICK = fixed();
