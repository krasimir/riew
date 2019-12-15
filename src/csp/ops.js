import { OPEN, CLOSED, ENDED, PUT, TAKE, SLEEP, NOOP, CHANNELS } from './constants';
import { grid, chan } from '../index';

let noop = () => {};

// **************************************************** PUT

export function put(id, item, callback) {
  const doPut = (ch, item, callback) => {
    let state = ch.state();
    if (state === CLOSED || state === ENDED) {
      callback(state);
    } else {
      ch.subscribers.forEach(s => s(item));
      ch.buff.put(item, callback);
    }
  };

  let ch = isChannel(id) ? id : chan(id);
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

  let ch = isChannel(id) ? id : chan(id);
  if (typeof callback === 'function') {
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
  let ch = isChannel(id) ? id : chan(id);
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
  let ch = isChannel(id) ? id : chan(id);
  ch.state(OPEN);
  ch.buff.reset();
  return { ch, op: NOOP };
}
export function schannelReset(id) {
  channelReset(id);
}

// **************************************************** pubsub

export function sub(id, callback) {
  let ch = isChannel(id) ? id : chan(id);
  if (!ch.subscribers.find(c => c === callback)) {
    ch.subscribers.push(callback);
  }
}
export function unsub(id, callback) {
  let ch = isChannel(id) ? id : chan(id);
  ch.subscribers = ch.subscribers.filter(c => {
    if (c !== callback) {
      return true;
    }
    return false;
  });
}
export function sleep(ms, callback) {
  if (typeof callback === 'function') {
    setTimeout(callback, ms);
  } else {
    return { op: SLEEP, ms };
  }
}
export function onSubscriberAdded(id, callback) {
  let ch = isChannel(id) ? id : chan(id);
  ch.onSubscriberAddedCallback = callback;
}
export function onSubscriberRemoved(id, callback) {
  let ch = isChannel(id) ? id : chan(id);
  ch.onSubscriberRemovedCallback = callback;
}

// **************************************************** other

export const isChannel = ch => ch && ch[ '@channel' ] === true;

// **************************************************** routine

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
      default:
        throw new Error(`Unrecognized operation ${i.value.op} for a routine.`);
    }
  })();

  return routineApi;
}
