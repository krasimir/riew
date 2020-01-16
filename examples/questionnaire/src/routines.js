import { take, put, read, go, chan, logger } from 'riew';
import {
  RESET_ERROR,
  SET_ERROR,
  NEXT_STEP,
  START_OVER,
  CURRENT_QUESTION,
  NEXT_STEP_CLICK,
  IS_COMPLETED,
} from './constants';

logger.enable();

export const nextStepRoutine = function*({ render }) {
  yield take(NEXT_STEP_CLICK);
  yield put(RESET_ERROR);
  const question = yield take(CURRENT_QUESTION);
  if (question.answer === null) {
    yield put(SET_ERROR, `Ops, "${question.text}" has no answer.`);
  } else if (yield take(IS_COMPLETED)) {
    render({ completed: true });
  } else {
    yield put(NEXT_STEP);
  }
  return go;
};
export const startOverRoutine = function* RR({ render }) {
  const frames = logger.frames();
  console.log(
    'startOverRoutine',
    frames.length > 0 ? frames[frames.length - 1].actions : []
  );
  yield read(START_OVER);
  render({ completed: false });
  return go;
};
