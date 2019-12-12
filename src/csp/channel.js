import { getId, isGeneratorFunction, isPromise } from '../utils';
import { PUT, TAKE, SLEEP, OPEN, CLOSED, ENDED } from './constants';
import { grid, pub, sub, unsub } from '../index';
import buffer from './buffer';

// **************************************************** chan / channel

export function chan(...args) {
  let state = OPEN;
  let [ id, buff ] = normalizeChannelArguments(args);
  let api = { id, '@channel': true };

  api.put = (item, next) => {
    let result;
    let callback = next;
    if (typeof next === 'undefined') {
      result = new Promise(resolve => (callback = resolve));
    }

    let state = api.state();
    if (state === chan.CLOSED || state === chan.ENDED) {
      callback(state);
    } else {
      api.buff.put(item, callback);
    }
    return result;
  };

  api.take = next => {
    let result;
    let callback = next;
    if (typeof next === 'undefined') {
      result = new Promise(resolve => (callback = resolve));
    }

    let state = api.state();
    if (state === chan.ENDED) {
      callback((result = chan.ENDED));
    } else {
      if (state === chan.CLOSED && api.buff.isEmpty()) {
        api.state(chan.ENDED);
        callback((result = chan.ENDED));
      } else {
        api.buff.take(r => callback((result = r)));
      }
    }
    return result;
  };

  api.close = () => {
    const newState = api.buff.isEmpty() ? ENDED : CLOSED;
    api.state(newState);
    api.buff.puts.forEach(put => put(newState));
    api.buff.takes.forEach(take => take(newState));
    grid.remove(api);
  };

  api.reset = () => {
    api.state(OPEN);
    api.buff.reset();
  };

  api.merge = (...channels) => {
    const newCh = chan();

    [ api, ...channels ].forEach(ch => {
      (function taker() {
        ch.take(v => {
          if (v !== CLOSED && v !== ENDED && newCh.state() === OPEN) {
            newCh.put(v, taker);
          }
        });
      })();
    });
    return newCh;
  };

  let isMultTakerFired = false;
  let taps = [];
  api.mult = (...channels) => {
    if (!isMultTakerFired) {
      isMultTakerFired = true;
      taps = taps.concat(channels);
      (function taker() {
        api.take(v => {
          if (v !== CLOSED && v !== ENDED) {
            let numOfSuccessfulPuts = 0;
            let putFinished = chWithSuccessfulPut => {
              numOfSuccessfulPuts += 1;
              if (numOfSuccessfulPuts >= taps.length) {
                taker();
              }
            };
            taps.forEach((ch, idx) => {
              if (ch.state() === OPEN) {
                ch.put(v, () => putFinished(ch));
              } else {
                numOfSuccessfulPuts += 1;
                taps.splice(idx, 1);
                putFinished();
              }
            });
          }
        });
      })();
    } else {
      channels.forEach(ch => {
        if (!taps.find(c => ch.id === c.id)) {
          taps.push(ch);
        }
      });
    }
  };
  api.unmult = ch => {
    taps = taps.filter(c => c.id !== ch.id);
  };
  api.unmultAll = ch => {
    taps = [];
  };

  api.isActive = () => api.state() === OPEN;
  api.buff = buff;
  api.state = s => {
    if (typeof s !== 'undefined') {
      state = s;
      if (state === ENDED) {
        grid.remove(api);
      }
    }
    return state;
  };
  api.__value = () => {
    console.warn("Riew: you should not get the channel's value directly! This method is here purely for testing purposes.");
    return buff.getValue();
  };

  grid.add(api);
  return api;
}

// **************************************************** constants

chan.OPEN = OPEN;
chan.CLOSED = CLOSED;
chan.ENDED = ENDED;

// **************************************************** go

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
      if (typeof callback === 'function') {
        return ch.put(item, callback);
      }
      return new Promise(resolve => ch.put(item, resolve));
    },
    take: (ch, callback) => {
      if (typeof callback === 'function') {
        return ch.take(callback);
      }
      return new Promise(resolve => ch.take(resolve));
    },
    sleep: (ch, ms = 0, callback = noop) => {
      if (typeof callback === 'function') {
        return setTimeout(() => {
          ch.close();
          callback();
        }, ms);
      }
      return new Promise(resolve =>
        setTimeout(() => {
          ch.close();
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
            pub(i.value.ch, i.value.item, next);
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

// **************************************************** ops

export function timeout(interval) {
  const ch = chan();
  setTimeout(() => ch.close(), interval);
  return ch;
}

// **************************************************** utils

export function isChannel(ch) {
  return ch && ch[ '@channel' ] === true;
}

function normalizeChannelArguments(args) {
  let id, buff;
  if (args.length === 2) {
    id = args[ 0 ];
    buff = args[ 1 ];
  } else if (args.length === 1 && typeof args[ 0 ] === 'string') {
    id = args[ 0 ];
    buff = buffer.fixed();
  } else if (args.length === 1 && typeof args[ 0 ] === 'object') {
    id = getId('ch');
    buff = args[ 0 ];
  } else {
    id = getId('ch');
    buff = buffer.fixed();
  }
  return [ id, buff ];
}
