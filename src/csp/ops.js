/* eslint-disable no-use-before-define */
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
  SUB,
  CALL_ROUTINE,
  FORK_ROUTINE,
} from './constants';
import { grid, chan, isState, isStateWriteChannel, subOnce } from '../index';
import { isPromise } from '../utils';

const noop = () => {};
const normalizeChannel = (id, stateOp = 'READ') => {
  if (isChannel(id)) return id;
  if (isState(id)) return chan(id[stateOp]);
  return chan(id);
};

// **************************************************** PUT

export function put(id, item, callback) {
  const doPut = (channel, itemToPut, putDone) => {
    const state = channel.state();
    if (state === CLOSED || state === ENDED) {
      callback(state);
    } else {
      callSubscribers(channel, item, () =>
        channel.buff.put(itemToPut, putDone)
      );
    }
  };

  const ch = normalizeChannel(id, 'WRITE');
  if (typeof callback === 'function') {
    doPut(ch, item, callback);
  } else {
    return { ch, op: PUT, item };
  }
}
export function sput(id, item, callback) {
  return put(id, item, callback || noop);
}
function callSubscribers(ch, item, callback) {
  const subscribers = ch.subscribers.map(() => 1);
  if (subscribers.length === 0) return callback();
  ch.subscribers.forEach(({ notify }) =>
    notify(
      item,
      () => (subscribers.shift(), subscribers.length === 0 ? callback() : null)
    )
  );
}

// **************************************************** TAKE

export function take(id, callback) {
  const doTake = (ch, callback) => {
    const state = ch.state();
    if (state === ENDED) {
      callback(ENDED);
    } else if (state === CLOSED && ch.buff.isEmpty()) {
      ch.state(ENDED);
      callback(ENDED);
    } else {
      ch.buff.take(r => callback(r));
    }
  };

  const ch = normalizeChannel(id);
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

// **************************************************** close, reset, call, fork

export function close(id) {
  const ch = normalizeChannel(id);
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
  const ch = normalizeChannel(id);
  ch.state(OPEN);
  ch.buff.reset();
  return { ch, op: NOOP };
}
export function schannelReset(id) {
  channelReset(id);
}
export function call(routine, ...args) {
  return { op: CALL_ROUTINE, routine, args };
}
export function fork(routine, ...args) {
  return { op: FORK_ROUTINE, routine, args };
}

// **************************************************** other

export const isChannel = ch => ch && ch['@channel'] === true;

// **************************************************** routine

export function go(func, done = () => {}, ...args) {
  const RUNNING = 'RUNNING';
  const STOPPED = 'STOPPED';
  let state = RUNNING;

  const api = {
    children: [],
    stop() {
      state = STOPPED;
      this.children.forEach(r => r.stop());
    },
    rerun() {
      gen = func(...args);
      next();
    },
  };
  const addSubRoutine = r => api.children.push(r);

  let gen = func(...args);
  function next(value) {
    if (state === STOPPED) {
      return;
    }
    const i = gen.next(value);
    if (i.done === true) {
      if (done) done(i.value);
      if (i.value && i.value['@go'] === true) {
        gen = func(...args);
        next();
      }
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
      case SUB:
        subOnce(i.value.ch, next);
        break;
      case CALL_ROUTINE:
        addSubRoutine(go(i.value.routine, next, ...i.value.args, ...args));
        break;
      case FORK_ROUTINE:
        addSubRoutine(go(i.value.routine, () => {}, ...args, ...i.value.args));
        next();
        break;
      default:
        throw new Error(`Unrecognized operation ${i.value.op} for a routine.`);
    }
  }

  next();

  return api;
}
go['@go'] = true;

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
