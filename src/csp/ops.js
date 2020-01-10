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
  ALL_REQUIRED,
} from './constants';
import { grid, chan, use, logger } from '../index';
import { isPromise, isGeneratorFunction, getId, getFuncName } from '../utils';
import { normalizeChannels, normalizeOptions, normalizeTo } from './utils';

const noop = () => {};

// **************************************************** put

export function sput(channels, item, callback = noop) {
  channels = normalizeChannels(channels, 'WRITE');
  const result = channels.map(() => NOTHING);
  const setResult = (idx, value) => {
    result[idx] = value;
    if (!result.includes(NOTHING)) {
      callback(result.length === 1 ? result[0] : result);
    }
  };
  channels.forEach((channel, idx) => {
    const chState = channel.state();
    if (chState !== OPEN) {
      setResult(idx, chState);
    } else {
      channel.buff.put(item, putResult => setResult(idx, putResult));
    }
  });
}
export function put(channels, item) {
  return { channels, op: PUT, item };
}

// **************************************************** take

export function stake(channels, callback, options) {
  channels = normalizeChannels(channels);
  options = normalizeOptions(options);
  if (options.strategy === ALL_REQUIRED) {
    const result = channels.map(() => NOTHING);
    const setResult = (idx, value) => {
      result[idx] = value;
      if (!result.includes(NOTHING)) {
        callback(result.length === 1 ? result[0] : [...result]);
      }
    };
    channels.forEach((channel, idx) => {
      const chState = channel.state();
      if (chState !== OPEN) {
        setResult(idx, chState);
      } else {
        channel.buff.take(takeResult => setResult(idx, takeResult), options);
      }
    });
  } else if (options.strategy === ONE_OF) {
    channels.forEach((channel, idx) => {
      const chState = channel.state();
      if (chState !== OPEN) {
        callback(chState, idx);
      } else {
        channel.buff.take(takeResult => callback(takeResult, idx), options);
      }
    });
  } else {
    throw new Error(`Unrecognized strategy "${options.strategy}"`);
  }
}
export function take(channels, options) {
  return { channels, op: TAKE, options };
}

// **************************************************** read

export function read(channels, options) {
  return { channels, op: READ, options: { ...options, read: true } };
}
export function sread(channels, to, options) {
  return stake(channels, normalizeTo(to), { ...options, read: true });
}
export function unread(channels, callback) {}
export function unreadAll(channels) {}

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
    if (__DEV__) logger.log(ch, 'CHANNEL_CLOSED');
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
    if (__DEV__) logger.log(ch, 'CHANNEL_RESET');
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
      grid.remove(api);
      if (__DEV__) logger.log(api, 'ROUTINE_STOPPED');
    },
    rerun() {
      gen = func(...args);
      next();
      if (__DEV__) logger.log(this, 'ROUTINE_RERUN');
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
        api.stop();
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
    if (state === STOPPED) return;
    const step = gen.next(value);
    if (step.done === true) {
      if (done) done(step.value);
      if (step.value && step.value['@go'] === true) {
        api.rerun();
      } else if (__DEV__) logger.log(api, 'ROUTINE_END');
    } else if (isPromise(step.value)) {
      if (__DEV__) logger.log(api, 'ROUTINE_ASYNC_BEGIN');
      step.value
        .then((...asyncResult) => {
          if (__DEV__) logger.log(api, 'ROUTINE_ASYNC_END');
          next(...asyncResult);
        })
        .catch(err => {
          if (__DEV__) logger.log(api, 'ROUTINE_ASYNC_ERROR', err);
          processGeneratorStep(gen.throw(err));
        });
    } else {
      processGeneratorStep(step);
    }
  }

  next();
  grid.add(api);
  if (__DEV__) logger.log(api, 'ROUTINE_STARTED');

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
