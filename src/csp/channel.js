import { getId } from '../utils';
import { OPEN, CLOSED, ENDED, PUT, TAKE, SLEEP, NOOP } from './constants';
import { grid } from '../index';
import buffer from './buffer';

let channels = {};
let noop = () => {};

export function chan(...args) {
  let state = OPEN;
  let [ id, buff ] = normalizeChannelArguments(args);

  if (channels[ id ]) {
    return channels[ id ];
  }

  let api = (channels[ id ] = {
    id,
    '@channel': true,
    'subscribers': []
  });

  api.isActive = () => api.state() === OPEN;
  api.buff = buff;
  api.state = s => {
    if (typeof s !== 'undefined') state = s;
    return state;
  };
  api.__value = () => {
    console.warn("Riew: you should not get the channel's value directly! This method is here purely for testing purposes.");
    return buff.getValue();
  };

  grid.add(api);
  return api;
}

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
  delete channels[ ch.id ];
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
export const cspReset = () => (channels = {});
export const getChannels = () => channels;
export const channelExists = id => !!channels[ id ];

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

// **************************************************** utils

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
