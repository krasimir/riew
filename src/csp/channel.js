import { getId } from '../utils';
import { OPEN, CLOSED, ENDED } from './constants';
import { grid } from '../index';
import buffer from './buffer';

// **************************************************** chan / channel

export function chan(...args) {
  let state = OPEN;
  let [ id, buff ] = normalizeChannelArguments(args);
  let api = { id, '@channel': true };

  const initializeOp = next => {
    let result;
    let callback = next;
    if (typeof next === 'undefined') {
      result = new Promise(resolve => (callback = resolve));
    }
    return [ result, callback ];
  };

  api.put = (item, next) => {
    let [ result, callback ] = initializeOp(next);
    let state = api.state();
    if (state === chan.CLOSED || state === chan.ENDED) {
      callback(state);
    } else {
      api.buff.put(item, callback);
    }
    return result;
  };

  api.take = next => {
    let [ result, callback ] = initializeOp(next);
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
