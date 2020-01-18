import { chan, buffer } from 'riew';

export const ANSWER = 'ANSWER';
export const START_OVER = 'START_OVER';
export const NEXT_STEP = 'NEXT_STEP';
export const RESET_ERROR = 'RESET_ERROR';
export const SET_ERROR = 'SET_ERROR';
export const IS_COMPLETED = 'IS_COMPLETED';
export const CURRENT_QUESTION = 'CURRENT_QUESTION';
export const GET_ERROR = 'GET_ERROR';
export const GET_QUESTIONS = 'GET_QUESTIONS';
export const NEXT_STEP_CLICK = 'NEXT_STEP_CLICK';

chan(START_OVER);
chan(CURRENT_QUESTION, buffer.sliding());
chan(IS_COMPLETED, buffer.sliding());
chan(NEXT_STEP_CLICK);
