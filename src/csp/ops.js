/* eslint-disable no-use-before-define, no-param-reassign */
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
  READ,
  CALL_ROUTINE,
  FORK_ROUTINE,
  NOTHING,
  ALL_REQUIRED,
  ONE_OF,
} from './constants';
import { grid, chan } from '../index';
import { isPromise } from '../utils';
import { normalizeChannels, normalizeOptions, normalizeTo } from './utils';
import { waitAllStrategy, waitOneStrategy } from './pubsub';

const noop = () => {};

// **************************************************** put

export function put(channels, item) {
  return { channels, op: PUT, item };
}
export function sput(channels, item, callback = noop) {
  channels = normalizeChannels(channels, 'WRITE');
  const data = channels.map(() => NOTHING);
  const putDone = (value, idx) => {
    data[idx] = value;
    if (!data.includes(NOTHING)) {
      callback(data.length === 1 ? data[0] : data);
    }
  };
  channels.forEach((channel, idx) => {
    const state = channel.state();
    if (state === CLOSED || state === ENDED) {
      callback(state);
    } else {
      callSubscribers(channel, item, () =>
        channel.buff.put(item, res => putDone(res, idx))
      );
    }
  });
}
function callSubscribers(ch, item, callback) {
  const subscribers = ch.subscribers.map(() => 1);
  if (subscribers.length === 0) return callback();
  const subscriptions = [...ch.subscribers];
  ch.subscribers = [];
  subscriptions.forEach(s => {
    const { notify, listen } = s;
    if (listen) {
      ch.subscribers.push(s);
    }
    notify(
      item,
      () => (subscribers.shift(), subscribers.length === 0 ? callback() : null)
    );
  });
}

// **************************************************** take

export function take(channels, options) {
  return { channels, op: TAKE, options };
}
export function stake(channels, callback, options) {
  channels = normalizeChannels(channels);
  options = normalizeOptions(options);
  const data = channels.map(() => NOTHING);
  const takeDone = (value, idx) => {
    data[idx] = value;
    if (options.strategy === ONE_OF) {
      callback(value);
    } else if (!data.includes(NOTHING)) {
      callback(data.length === 1 ? data[0] : data);
    }
  };
  channels.forEach((channel, idx) => {
    const state = channel.state();
    if (state === ENDED) {
      takeDone(ENDED, idx);
    } else if (state === CLOSED && channel.buff.isEmpty()) {
      channel.state(ENDED);
      takeDone(ENDED, idx);
    } else {
      channel.buff.take(r => takeDone(r, idx));
    }
  });
}

// **************************************************** read

export function read(channels, options) {
  return { channels, op: READ, options };
}
export function sread(channels, to, options) {
  channels = normalizeChannels(channels);
  options = normalizeOptions(options);
  let f;
  options = normalizeOptions(options);
  switch (options.strategy) {
    case ALL_REQUIRED:
      f = waitAllStrategy;
      break;
    case ONE_OF:
      f = waitOneStrategy;
      break;
    default:
      throw new Error(
        `Subscription strategy not recognized. Expecting ALL_REQUIRED or ONE_OF but "${options.strategy}" given.`
      );
  }
  return f(channels, normalizeTo(to), options);
}
export function unread(channels, callback) {
  channels = normalizeChannels(channels);
  channels.forEach(ch => {
    if (isChannel(callback)) {
      callback = callback.__subFunc;
    }
    ch.subscribers = ch.subscribers.filter(({ to }) => {
      if (to !== callback) {
        return true;
      }
      return false;
    });
  });
}
export function unreadAll(channels) {
  normalizeChannels(channels).forEach(ch => {
    ch.subscribers = [];
  });
}

read.ALL_REQUIRED = ALL_REQUIRED;
read.ONE_OF = ONE_OF;

// **************************************************** close, reset, call, fork, merge, timeout

export function close(channels) {
  channels = normalizeChannels(channels);
  channels.forEach(ch => {
    const newState = ch.buff.isEmpty() ? ENDED : CLOSED;
    ch.state(newState);
    ch.buff.puts.forEach(p => p(newState));
    ch.buff.takes.forEach(t => t(newState));
    grid.remove(ch);
    ch.subscribers = [];
    CHANNELS.del(ch.id);
  });
  return { op: NOOP };
}
export function sclose(id) {
  return close(id);
}
export function channelReset(channels) {
  channels = normalizeChannels(channels);
  channels.forEach(ch => {
    ch.state(OPEN);
    ch.buff.reset();
  });
  return { op: NOOP };
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
export function merge(...channels) {
  const newCh = chan();

  channels.forEach(ch => {
    (function taker() {
      stake(ch, v => {
        if (v !== CLOSED && v !== ENDED && newCh.state() === OPEN) {
          sput(newCh, v, taker);
        }
      });
    })();
  });
  return newCh;
}
export function timeout(interval) {
  const ch = chan();
  setTimeout(() => close(ch), interval);
  return ch;
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
        api.rerun();
      }
      return;
    }
    if (isPromise(i.value)) {
      i.value.then(next).catch(err => gen.throw(err));
      return;
    }
    switch (i.value.op) {
      case PUT:
        sput(i.value.channels, i.value.item, next);
        break;
      case TAKE:
        stake(i.value.channels, next, i.value.options);
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
      case READ:
        sread(i.value.channels, next, i.value.options);
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
