import { getId, isPromise, isGenerator } from '../utils';
import { PUT, TAKE, TAKE_LATEST, SLEEP, OPEN, CLOSED, ENDED } from './constants';
import { grid } from '../index';
import buffer from './buffer';

// **************************************************** chan / channel

export function chan(...args) {
  let state = OPEN;
  let [ id, buff ] = normalizeChannelArguments(args);
  let api = { id, '@channel': true };

  ops(api);
  implementIterableProtocol(api);

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
  api.setBuffer = b => (buff = api.buff = b);
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
  const gen = genFunc(...args);
  if (!isGenerator(gen)) {
    if (isPromise(gen)) {
      gen.then(() => {
        if (done) done();
      });
      return;
    }
    if (done) done();
    return;
  }
  let alreadyDone = false;
  (function next(value) {
    const i = gen.next(value);
    if (alreadyDone) {
      // There are cases where the channel is closed but then we have more iteration
      return;
    }
    if (i.done === true) {
      alreadyDone = true;
      if (done) done();
      return;
    }
    switch (i.value.op) {
      case PUT:
        i.value.ch.put(i.value.item, next);
        break;
      case TAKE:
        i.value.ch.take(next);
        break;
      case TAKE_LATEST:
        Promise.resolve().then(() => i.value.ch.take(next));
        break;
      case SLEEP:
        setTimeout(next, i.value.ms);
        break;
      default:
        throw new Error(`Unrecognized operation ${i.value.op} for a routine.`);
    }
  })();
}
export function put(ch, item) {
  return { ch, op: PUT, item };
}
export function take(ch) {
  return { ch, op: TAKE };
}
export function takeLatest(ch) {
  return { ch, op: TAKE_LATEST };
}
export function sleep(ms = 0) {
  return { op: SLEEP, ms };
}

// **************************************************** ops

export function ops(ch) {
  let opsTaker = false;
  let pipes = [];

  function taker() {
    if (!opsTaker) {
      opsTaker = true;
      const listen = v => {
        if (v === CLOSED || v === ENDED) {
          return;
        }
        pipes.forEach(p => {
          switch (p.type) {
            case 'pipe':
              if (p.ch.state() === OPEN) {
                p.ch.put(v);
              }
              break;
            case 'map':
              if (p.ch.state() === OPEN) {
                p.ch.put(p.func(v));
              }
              break;
            case 'filter':
              if (p.ch.state() === OPEN && p.func(v)) {
                p.ch.put(v);
              }
              break;
            case 'takeEvery':
              p.func(v);
              break;
          }
        });
        ch.take(listen);
      };
      ch.take(listen);
    }
  }

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
      callback(chan.ENDED);
    } else {
      // When we close a channel we do check if the buffer is empty.
      // If it is not then it is safe to take from it.
      // If it is empty the state here will be ENDED, not CLOSED.
      // So there is no way to reach this point with CLOSED state and an empty buffer.
      if (state === chan.CLOSED && ch.buff.isEmpty()) {
        ch.state(chan.ENDED);
        callback(chan.ENDED);
      } else {
        ch.buff.take(result => callback(result));
      }
    }

    return result;
  };

  ch.takeLatest = func => {
    let result = ch;
    let next = func;
    if (typeof func === 'undefined') {
      result = new Promise(resolve => (next = resolve));
    }
    Promise.resolve().then(() => ch.take(next));
    return result;
  };

  ch.close = () => {
    const newState = ch.buff.isEmpty() ? ENDED : CLOSED;
    ch.state(newState);
    ch.buff.puts.forEach(put => put(newState));
    // We have a pending take only if the buffer is empty.
    // So, closed buffer with no value => ENDED
    ch.buff.takes.forEach(put => put(ENDED));
    if (newState === ENDED) {
      grid.remove(ch);
    }
  };

  ch.reset = () => {
    ch.state(OPEN);
    ch.buff.reset();
  };

  ch.pipe = (...channels) => {
    channels.forEach(channel => {
      if (!pipes.find(({ ch }) => ch === channel)) {
        pipes.push({ type: 'pipe', ch: channel });
      }
    });
    taker();
    return ch;
  };

  ch.map = func => {
    const newCh = chan();
    pipes.push({ ch: newCh, func, type: 'map' });
    taker();
    return newCh;
  };

  ch.filter = func => {
    const newCh = chan();
    pipes.push({ ch: newCh, func, type: 'filter' });
    taker();
    return newCh;
  };

  ch.from = value => {
    if (isChannel(value)) {
      value.pipe(ch);
    } else if (typeof value !== 'undefined') {
      ch.buff.setValue(value);
    }
    return ch;
  };

  ch.takeEvery = func => {
    pipes.push({ func, type: 'takeEvery' });
    taker();
    return ch;
  };
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

export function from(...value) {
  if (typeof value !== 'undefined') {
    return chan().from([ ...value ]);
  }
  return chan();
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

export function isChannelPut(func) {
  return func && func[ '@channel_put' ] === true;
}

export function isChannelTake(func) {
  return func && func[ '@channel_take' ] === true;
}

function implementIterableProtocol(ch) {
  if (typeof Symbol !== 'undefined' && typeof Symbol.iterator !== 'undefined') {
    ch[ Symbol.iterator ] = function () {
      const take = (...args) => ch.take(...args);
      const put = (...args) => ch.put(...args);
      const values = [ take, put ];
      let i = 0;

      take[ '@channel_take' ] = true;
      put[ '@channel_put' ] = true;
      take.ch = put.ch = ch;

      return {
        next: () => ({
          value: values[ i++ ],
          done: i > values.length
        })
      };
    };
  }
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
