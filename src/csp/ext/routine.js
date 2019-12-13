import { PUT, TAKE, SLEEP } from '../constants';

export function go(func, done = () => {}, ...args) {
  const RUNNING = 'RUNNING';
  const STOPPED = 'STOPPED';
  let state = RUNNING;

  const routineApi = {
    stop() {
      state = STOPPED;
    }
  };

  const gen = func(...args);
  (function next(value) {
    if (state === STOPPED) {
      return;
    }
    const i = gen.next(value);
    if (i.done === true) {
      if (done) done(i.value);
      return;
    }
    switch (i.value.op) {
      case PUT:
        i.value.ch.put(i.value.item, next);
        break;
      case TAKE:
        i.value.ch.take(next);
        break;
      case SLEEP:
        setTimeout(next, i.value.ms);
        break;
      default:
        throw new Error(`Unrecognized operation ${i.value.op} for a routine.`);
    }
  })();

  return routineApi;
}
