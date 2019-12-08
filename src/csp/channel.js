import { getId, isPromise, isGenerator } from '../utils';
import { PUT, TAKE, SLEEP, OPEN, CLOSED, ENDED } from './constants';
import { grid } from '../index';
import buffer from './buffer';

// **************************************************** chan / channel

export function chan(...args) {
  let state = OPEN;
  let [ id, buff ] = normalizeChannelArguments(args);
  let api = { id, '@channel': true };

  ops(api);

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

// **************************************************** go / generators

export function go(genFunc, args = [], done) {
  const RUNNING = 'RUNNING';
  const STOPPED = 'STOPPED';
  const gen = genFunc(...args);
  let state = RUNNING;
  const api = {
    stop() {
      state = STOPPED;
    }
  };

  if (!isGenerator(gen)) {
    if (isPromise(gen)) {
      gen.then(r => {
        if (done && state === RUNNING) done(r);
      });
      return api;
    }
    if (done && state === RUNNING) done(gen);
    return api;
  }
  let alreadyDone = false;
  (function next(value) {
    if (alreadyDone || state === STOPPED) {
      // There are cases where the channel is closed but then we have more iteration
      return;
    }
    const i = gen.next(value);
    if (i.done === true) {
      alreadyDone = true;
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

  return api;
}
export function put(ch, item) {
  return { ch, op: PUT, item };
}
export function take(ch) {
  return { ch, op: TAKE };
}
export function sleep(ms = 0) {
  return { op: SLEEP, ms };
}

// **************************************************** ops

export function ops(ch) {
  let observers = [];

  ch.put = (item, next) => {
    let result;
    let callback = next;
    if (typeof next === 'undefined') {
      result = new Promise(resolve => (callback = resolve));
    }

    let state = ch.state();
    if (state === chan.CLOSED || state === chan.ENDED) {
      callback(state);
    } else {
      ch.buff.put(item, result => callback(result));
    }

    return result;
  };

  ch.take = next => {
    let result;
    let callback = next;
    if (typeof next === 'undefined') {
      result = new Promise(resolve => (callback = resolve));
    }

    let state = ch.state();
    if (state === chan.ENDED) {
      callback((result = chan.ENDED));
    } else {
      // When we close a channel we do check if the buffer is empty.
      // If it is not then it is safe to take from it.
      // If it is empty the state here will be ENDED, not CLOSED.
      // So there is no way to reach this point with CLOSED state and an empty buffer.
      if (state === chan.CLOSED && ch.buff.isEmpty()) {
        ch.state(chan.ENDED);
        callback((result = chan.ENDED));
      } else {
        ch.buff.take(r => callback((result = r)));
      }
    }

    return result;
  };

  ch.close = () => {
    const newState = ch.buff.isEmpty() ? ENDED : CLOSED;
    ch.state(newState);
    ch.buff.puts.forEach(put => put(newState));
    ch.buff.takes.forEach(take => take(newState));
    grid.remove(ch);
  };

  ch.reset = () => {
    ch.state(OPEN);
    ch.buff.reset();
  };

  ch.map = func => {
    const newCh = chan();
    ch.subscribe(value => newCh.put(func(value)));
    return newCh;
  };

  ch.filter = func => {
    const newCh = chan();
    ch.subscribe(value => {
      if (func(value)) newCh.put(value);
    });
    return newCh;
  };

  ch.isActive = () => ch.state() === OPEN;
}

export function merge(...channels) {
  const newCh = chan();

  channels.map(ch => {
    const listen = () => {
      ch.take(v => {
        if (v !== CLOSED && v !== ENDED && newCh.state() === OPEN) {
          newCh.put(v);
          listen();
        }
      });
    };
    listen();
  });

  return newCh;
}

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
