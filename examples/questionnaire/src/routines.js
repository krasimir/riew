import { take, read, put, go, fixed, use } from 'riew';
import { RESET_ERROR, IS_COMPLETED, NEXT_STEP, START_OVER } from './state';

export const NEXT_STEP_CLICK = fixed();

export const nextStepRoutine = function* nextStepRoutine({ render, step }) {
  yield take(NEXT_STEP_CLICK);
  yield put(RESET_ERROR);
  const question = yield read(step);
  if (question.answer === null) {
    yield put(use('error'), `Ops, "${question.text}" has no answer.`);
  } else if (yield read(IS_COMPLETED)) {
    render({ completed: true });
  } else {
    yield put(NEXT_STEP);
  }
  return go;
};
export const startOverRoutine = function* startOverRoutine({ render }) {
  yield take(START_OVER);
  render({ completed: false });
  return go;
};
