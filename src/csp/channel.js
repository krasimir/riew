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

  let api = (channels[ id ] = { id, '@channel': true });
  let subscribers = [];
  let onSubscriberAddedCallback = noop;
  let onSubscriberRemovedCallback = noop;

  let isListening = false;
  let listen = () => {
    if (!isListening) {
      isListening = true;
      (function taker() {
        api.take(value => {
          if (value !== CLOSED && value !== ENDED) {
            subscribers.forEach(callback => callback(value));
            taker();
          }
        });
      })();
    }
  };

  api.put = (item, callback = () => {}) => {
    let state = api.state();
    if (state === CLOSED || state === ENDED) {
      callback(state);
    } else {
      api.buff.put(item, callback);
    }
  };

  api.take = callback => {
    let state = api.state();
    if (state === ENDED) {
      callback(ENDED);
    } else {
      if (state === CLOSED && api.buff.isEmpty()) {
        api.state(ENDED);
        callback(ENDED);
      } else {
        api.buff.take(r => callback(r));
      }
    }
  };

  api.close = () => {
    const newState = api.buff.isEmpty() ? ENDED : CLOSED;
    api.state(newState);
    api.buff.puts.forEach(put => put(newState));
    api.buff.takes.forEach(take => take(newState));
    grid.remove(api);
    subscribers = [];
  };

  api.sub = callback => {
    listen();
    if (!subscribers.find(c => c === callback)) {
      subscribers.push(callback);
      onSubscriberAddedCallback(callback);
    }
  };

  api.unsub = callback => {
    subscribers = subscribers.filter(c => {
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
  if (isChannel(id)) id = id.id;
  if (typeof callback === 'function') {
    chan(id).put(item, callback);
  } else {
    return { ch: chan(id), op: PUT, item };
  }
}

export function take(id, callback) {
  if (isChannel(id)) id = id.id;
  if (typeof callback === 'function') {
    chan(id).take(callback);
  } else {
    return { ch: chan(id), op: TAKE };
  }
}

export function close(id) {
  if (isChannel(id)) id = id.id;
  chan(id).close();
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
