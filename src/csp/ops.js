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
  ONE_OF,
} from './constants';
import { grid, chan, use, logger } from '../index';
import { isPromise, isGeneratorFunction, getId, getFuncName } from '../utils';
import { normalizeChannels, normalizeOptions, normalizeTo } from './utils';

const noop = () => {};

// **************************************************** put

export function put(channels, item) {
  return { channels, op: PUT, item };
}
export function sput(channels, item, callback = noop) {
  channels = normalizeChannels(channels, 'WRITE');
  const result = channels.map(() => NOTHING);
  const items = channels.length > 1 ? item : [item];
  channels.forEach((channel, idx) => {
    const state = channel.state();
    if (state === CLOSED || state === ENDED) {
      callback(state);
    } else {
      callSubscribers(channel, items[idx], () => {
        channel.buff.put(items[idx], value => {
          result[idx] = value;
          if (!result.includes(NOTHING)) {
            callback(result.length === 1 ? result[0] : result);
          }
        });
      });
    }
  });
}
function callSubscribers(channel, item, callback) {
  const notificationProcess = channel.subscribers.map(() => 1); // just to count the notified channels
  if (notificationProcess.length === 0) return callback();
  const subscriptions = [...channel.subscribers];
  channel.subscribers = [];
  subscriptions.forEach(s => {
    const { notify, listen } = s;
    if (listen) {
      channel.subscribers.push(s);
    }
    notify(item, () => {
      notificationProcess.shift();
      if (notificationProcess.length === 0) {
        callback();
      }
    });
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
  const { transform, onError, initialCall, listen } = options;

  const takeDone = (value, idx, done = noop) => {
    data[idx] = value;
    let result = null;
    if (options.strategy === ONE_OF) {
      result = [value, idx];
    } else if (!data.includes(NOTHING)) {
      result = [...data];
    }
    if (result !== null) {
      if (transform) {
        try {
          if (isGeneratorFunction(transform)) {
            go(transform, v => (callback(v), done()), ...result);
          } else {
            callback(transform(...result));
            done();
          }
        } catch (e) {
          if (onError === null) {
            throw e;
          }
          onError(e);
        }
      } else {
        if (options.strategy === ONE_OF) {
          callback(...result);
        } else {
          callback(result.length === 1 ? result[0] : result);
        }
        done();
      }
    }
  };

  const subscriptions = channels.map((channel, idx) => {
    const state = channel.state();
    let subscription = {};
    if (state === ENDED) {
      takeDone(ENDED, idx);
    } else if (state === CLOSED && channel.buff.isEmpty()) {
      channel.state(ENDED);
      takeDone(ENDED, idx);
    } else if (options.read) {
      // reading
      if (!channel.subscribers.find(({ callback: c }) => c === callback)) {
        channel.subscribers.push(
          (subscription = {
            callback,
            notify: (value, done) => takeDone(value, idx, done),
            listen,
          })
        );
      }
      const currentChannelBufValue = channel.value();
      if (initialCall && currentChannelBufValue.length > 0) {
        takeDone(currentChannelBufValue[0], idx);
      }
    } else {
      // taking
      channel.buff.take(r => takeDone(r, idx));
    }
    return subscription;
  });

  return {
    listen() {
      subscriptions.forEach(s => (s.listen = true));
    },
  };
}

// **************************************************** read

export function read(channels, options) {
  return { channels, op: READ, options: { ...options, read: true } };
}
export function sread(channels, to, options) {
  return stake(channels, normalizeTo(to), { ...options, read: true });
}
export function unread(channels, callback) {
  channels = normalizeChannels(channels);
  channels.forEach(ch => {
    if (isChannel(callback)) {
      callback = callback.__subFunc;
    }
    ch.subscribers = ch.subscribers.filter(({ callback: c }) => {
      if (c !== callback) {
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

// **************************************************** close, reset, call, fork, merge, timeout, isChannel

export function close(channels) {
  channels = normalizeChannels(channels);
  channels.forEach(ch => {
    const newState = ch.buff.isEmpty() ? ENDED : CLOSED;
    ch.state(newState);
    ch.buff.puts.forEach(p => p.callback(newState));
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
export const isChannel = ch => ch && ch['@channel'] === true;
export const isRiew = r => r && r['@riew'] === true;
export const isState = s => s && s['@state'] === true;
export const isRoutine = r => r && r['@routine'] === true;
export const isStateReadChannel = s => s && s['@statereadchannel'] === true;
export const isStateWriteChannel = s => s && s['@statewritechannel'] === true;

// **************************************************** go/routine

export function go(func, done = () => {}, ...args) {
  const RUNNING = 'RUNNING';
  const STOPPED = 'STOPPED';
  let state = RUNNING;
  const name = getFuncName(func);

  const api = {
    id: getId(`routine_${name}`),
    '@routine': true,
    name,
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

  function processGeneratorStep(i) {
    switch (i.value.op) {
      case PUT:
        sput(i.value.channels, i.value.item, next);
        break;
      case TAKE:
        stake(
          i.value.channels,
          (...nextArgs) => {
            next(nextArgs.length === 1 ? nextArgs[0] : nextArgs);
          },
          i.value.options
        );
        break;
      case NOOP:
        next();
        break;
      case SLEEP:
        setTimeout(next, i.value.ms);
        break;
      case STOP:
        state = STOPPED;
        grid.remove(api);
        break;
      case READ:
        sread(i.value.channels, next, i.value.options);
        break;
      case CALL_ROUTINE:
        addSubRoutine(go(i.value.routine, next, ...i.value.args));
        break;
      case FORK_ROUTINE:
        addSubRoutine(go(i.value.routine, () => {}, ...i.value.args));
        next();
        break;
      default:
        throw new Error(`Unrecognized operation ${i.value.op} for a routine.`);
    }
  }

  function next(value) {
    if (state === STOPPED) {
      grid.remove(api);
      return;
    }
    const step = gen.next(value);
    if (step.done === true) {
      if (done) done(step.value);
      if (step.value && step.value['@go'] === true) {
        api.rerun();
      }
    } else if (isPromise(step.value)) {
      step.value.then(next).catch(err => processGeneratorStep(gen.throw(err)));
    } else {
      processGeneratorStep(step);
    }
  }

  next();
  grid.add(api);

  return api;
}
go['@go'] = true;
go.with = (...maps) => {
  const reducedMaps = maps.reduce((res, item) => {
    if (typeof item === 'string') {
      res = { ...res, [item]: use(item) };
    } else {
      res = { ...res, ...item };
    }
    return res;
  }, {});
  return (func, done = () => {}, ...args) => {
    args.push(reducedMaps);
    return go(func, done, ...args);
  };
};

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
