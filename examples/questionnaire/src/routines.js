import { take, put, sub, go } from 'riew';
import { RESET_ERROR, SET_ERROR, NEXT_STEP, START_OVER } from './constants';

export const nextStepRoutine = function*({ render }) {
  yield take('NEXT_STEP_CLICK');
  yield put(RESET_ERROR);
  const question = yield take('CURRENT_QUESTION');
  if (question.answer === null) {
    yield put(SET_ERROR, `Ops, "${question.text}" has no answer.`);
  } else if (yield take('IS_COMPLETED')) {
    render({ completed: true });
  } else {
    yield put(NEXT_STEP);
  }
  return go;
};
export const startOverRoutine = function*({ render }) {
  yield sub(START_OVER);
  render({ completed: false });
  return go;
};
