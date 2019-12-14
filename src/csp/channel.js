import { getId } from '../utils';
import { OPEN, CLOSED, ENDED, PUT, TAKE, SLEEP, CLOSE } from './constants';
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

  let api = (channels[ id ] = { id, '@channel': true, 'subscribers': [] });
  let onSubscriberAddedCallback = noop;
  let onSubscriberRemovedCallback = noop;

  let isListening = false;
  let listen = () => {
    if (!isListening) {
      isListening = true;
      (function taker() {
        api.take(value => {
          if (value !== CLOSED && value !== ENDED) {
            api.subscribers.forEach(callback => callback(value));
            taker();
          }
        });
      })();
    }
  };

  api.sub = callback => {
    listen();
    if (!api.subscribers.find(c => c === callback)) {
      api.subscribers.push(callback);
      onSubscriberAddedCallback(callback);
    }
  };

  api.unsub = callback => {
    api.subscribers = api.subscribers.filter(c => {
      if (c !== callback) {
        return true;
      }
      onSubscriberRemovedCallback(c);
      return false;
    });
  };

  api.onSubscriberAdded = callback => {
    onSubscriberAddedCallback = callback;
  };

  api.onSubscriberRemoved = callback => {
    onSubscriberRemovedCallback = callback;
  };

  api.reset = () => {
    api.state(OPEN);
    api.buff.reset();
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

export function put(id, item, callback) {
  const doPut = (ch, item, callback) => {
    let state = ch.state();
    if (state === CLOSED || state === ENDED) {
      callback(state);
    } else {
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

export function close(id) {
  let ch = isChannel(id) ? id : chan(id);
  const newState = ch.buff.isEmpty() ? ENDED : CLOSED;
  ch.state(newState);
  ch.buff.puts.forEach(put => put(newState));
  ch.buff.takes.forEach(take => take(newState));
  grid.remove(ch);
  ch.subscribers = [];
  return { op: CLOSE };
}

export function sub(id, callback) {
  if (isChannel(id)) id = id.id;
  chan(id).sub(callback);
}

export function unsub(id, callback) {
  if (isChannel(id)) id = id.id;
  chan(id).unsub(callback);
}

export function sleep(ms, callback) {
  if (typeof callback === 'function') {
    setTimeout(callback, ms);
  } else {
    return { op: SLEEP, ms };
  }
}

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
      case CLOSE:
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
