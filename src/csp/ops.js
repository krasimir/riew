import {
  OPEN,
  CLOSED,
  ENDED,
  PUT,
  TAKE,
  SLEEP,
  NOOP,
  CHANNELS,
  STOP,
  RERUN,
  SUB
} from './constants';
import { grid, chan, isState, isStateWriteChannel, subOnce } from '../index';
import { isPromise } from '../utils';

let noop = () => {};
let normalizeChannel = (id, stateOp = 'READ') => {
  if (isChannel(id)) return id;
  if (isState(id)) return chan(id[stateOp]);
  return chan(id);
};

// **************************************************** PUT

export function put(id, item, callback) {
  const doPut = (ch, item, callback) => {
    let state = ch.state();
    if (state === CLOSED || state === ENDED) {
      callback(state);
    } else {
      ch.subscribers.forEach(({ notify }) => notify(item));
      ch.buff.put(item, callback);
    }
  };

  let ch = normalizeChannel(id, 'WRITE');
  if (typeof callback === 'function') {
    doPut(ch, item, callback);
  } else {
    return { ch, op: PUT, item };
  }
}
export function sput(id, item, callback) {
  return put(id, item, callback || noop);
}

// **************************************************** TAKE

export function take(id, callback) {
  const doTake = (ch, callback) => {
    let state = ch.state();
    if (state === ENDED) {
      callback(ENDED);
    } else {
      if (state === CLOSED && ch.buff.isEmpty()) {
        ch.state(ENDED);
        callback(ENDED);
      } else {
        ch.buff.take(r => callback(r));
      }
    }
  };

  let ch = normalizeChannel(id);
  if (typeof callback === 'function') {
    if (isStateWriteChannel(ch)) {
      console.warn(
        'You are about to `take` from a state WRITE channel. This type of channel is using `ever` buffer which means that will resolve its takes and puts immediately. You probably want to use `sub(<channel>)`.'
      );
    }
    doTake(ch, callback);
  } else {
    return { ch, op: TAKE };
  }
}
export function stake(id, callback) {
  return take(id, callback || noop);
}

// **************************************************** close & reset

export function close(id) {
  let ch = normalizeChannel(id);
  const newState = ch.buff.isEmpty() ? ENDED : CLOSED;
  ch.state(newState);
  ch.buff.puts.forEach(put => put(newState));
  ch.buff.takes.forEach(take => take(newState));
  grid.remove(ch);
  ch.subscribers = [];
  CHANNELS.del(ch.id);
  return { op: NOOP };
}
export function sclose(id) {
  return close(id);
}
export function channelReset(id) {
  let ch = normalizeChannel(id);
  ch.state(OPEN);
  ch.buff.reset();
  return { ch, op: NOOP };
}
export function schannelReset(id) {
  channelReset(id);
}

// **************************************************** other

export const isChannel = ch => ch && ch['@channel'] === true;

// **************************************************** routine

export function go(func, done = () => {}, ...args) {
  const RUNNING = 'RUNNING';
  const STOPPED = 'STOPPED';
  let state = RUNNING;

  const routineApi = {
    stop() {
      state = STOPPED;
    },
    rerun() {
      gen = func(...args);
      next();
    }
  };

  let gen = func(...args);
  function next(value) {
    if (state === STOPPED) {
      return;
    }
    const i = gen.next(value);
    if (i.done === true) {
      if (done) done(i.value);
      return;
    }
    if (isPromise(i.value)) {
      i.value.then(next).catch(err => gen.throw(err));
      return;
    }
    switch (i.value.op) {
      case PUT:
        put(i.value.ch, i.value.item, next);
        break;
      case TAKE:
        take(i.value.ch, next);
        break;
      case NOOP:
        next();
        break;
      case SLEEP:
        setTimeout(next, i.value.ms);
        break;
      case STOP:
        state = STOPPED;
        break;
      case RERUN:
        gen = func(...args);
        next();
        break;
      case SUB:
        subOnce(i.value.ch, next);
        break;
      default:
        throw new Error(`Unrecognized operation ${i.value.op} for a routine.`);
    }
  }

  next();

  return routineApi;
}

export function sleep(ms, callback) {
  if (typeof callback === 'function') {
    setTimeout(callback, ms);
  } else {
    return { op: SLEEP, ms };
  }
}

export function stop() {
  return { op: STOP };
}

export function rerun() {
  return { op: RERUN };
}
