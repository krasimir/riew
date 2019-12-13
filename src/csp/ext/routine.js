import { isGeneratorFunction, isPromise } from '../../utils';
import { PUT, TAKE, SLEEP } from '../constants';
import { sub, unsub, topic } from '../../index';

export function go(func, done = () => {}, props = {}) {
  const RUNNING = 'RUNNING';
  const STOPPED = 'STOPPED';
  let state = RUNNING;

  const noop = () => {};
  const routineApi = {
    stop() {
      state = STOPPED;
    }
  };
  const generatorFuncApi = {
    put: (ch, item) => ({ ch, op: PUT, item }),
    take: ch => ({ ch, op: TAKE }),
    sleep: (ms = 0) => ({ op: SLEEP, ms })
  };
  const regularOrAsyncFuncApi = {
    put: (ch, item, callback) => {
      let action = (a, b) => {
        if (typeof ch === 'string') {
          return topic(ch).put(a, b);
        }
        return ch.put(a, b);
      };
      if (typeof callback === 'function') {
        return action(item, callback);
      }
      return new Promise(resolve => action(item, resolve));
    },
    take: (ch, callback) => {
      let action = a => {
        if (typeof ch === 'string') {
          const callback = (...args) => {
            unsub(ch, callback);
            a(...args);
          };
          return sub(ch, callback);
        }
        return ch.take(a);
      };
      if (typeof callback === 'function') {
        return action(callback);
      }
      return new Promise(resolve => action(resolve));
    },
    sleep: (ms = 0, callback = noop) => {
      if (typeof callback === 'function') {
        return setTimeout(() => {
          callback();
        }, ms);
      }
      return new Promise(resolve =>
        setTimeout(() => {
          resolve();
        }, ms)
      );
    }
  };

  if (isGeneratorFunction(func)) {
    const gen = func({ ...props, ...generatorFuncApi });
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
          if (typeof i.value.ch === 'string') {
            topic(i.value.ch).put(i.value.item, next);
          } else {
            i.value.ch.put(i.value.item, next);
          }
          break;
        case TAKE:
          if (typeof i.value.ch === 'string') {
            const callback = (...args) => {
              unsub(i.value.ch, callback);
              next(...args);
            };
            sub(i.value.ch, callback);
          } else {
            i.value.ch.take(next);
          }
          break;
        case SLEEP:
          setTimeout(next, i.value.ms);
          break;
        default:
          throw new Error(`Unrecognized operation ${i.value.op} for a routine.`);
      }
    })();
  } else {
    const result = func({ ...props, ...regularOrAsyncFuncApi });
    if (isPromise(result)) {
      result.then(r => {
        if (done && state === RUNNING) done(r);
      });
    } else {
      if (done && state === RUNNING) done(result);
    }
  }

  return routineApi;
}
