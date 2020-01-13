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
  grid,
  chan,
  use,
  logger,
} from '../index';
import { isPromise, getId, getFuncName } from '../utils';
import { normalizeChannels, normalizeOptions, normalizeTo } from './utils';

const noop = () => {};
const ops = {};

// **************************************************** put

ops.sput = function sput(channels, item, callback = noop) {
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
};
ops.put = function put(channels, item) {
  return { channels, op: PUT, item };
};

// **************************************************** take

ops.stake = function stake(channels, callback, options) {
  channels = normalizeChannels(channels);
  options = normalizeOptions(options);
  callback = normalizeTo(callback);
  let unsubscribers;
  if (options.strategy === ALL_REQUIRED) {
    const result = channels.map(() => NOTHING);
    const setResult = (idx, value) => {
      result[idx] = value;
      if (!result.includes(NOTHING)) {
        callback(result.length === 1 ? result[0] : [...result]);
      }
    };
    unsubscribers = channels.map((channel, idx) => {
      const chState = channel.state();
      if (chState === ENDED) {
        setResult(idx, chState);
      } else if (chState === CLOSED && channel.buff.isEmpty()) {
        channel.state(ENDED);
        setResult(idx, ENDED);
      } else {
        return channel.buff.take(
          takeResult => setResult(idx, takeResult),
          options
        );
      }
    });
  } else if (options.strategy === ONE_OF) {
    const done = (...takeResult) => {
      // This function is here to clean up the unresolved buffer readers.
      // In the ONE_OF strategy there are pending readers that should be
      // killed since one of the others in the list is called. And this
      // should happen only if we are not listening.
      if (!options.listen) {
        unsubscribers.filter(f => f).forEach(f => f());
      }
      callback(...takeResult);
    };
    unsubscribers = channels.map((channel, idx) => {
      const chState = channel.state();
      if (chState === ENDED) {
        done(chState, idx);
      } else if (chState === CLOSED && channel.buff.isEmpty()) {
        channel.state(ENDED);
        done(ENDED, idx);
      } else {
        return channel.buff.take(takeResult => done(takeResult, idx), options);
      }
    });
  } else {
    throw new Error(`Unrecognized strategy "${options.strategy}"`);
  }
  return function unsubscribe() {
    unsubscribers.filter(f => f).forEach(f => f());
  };
};
ops.take = function take(channels, options) {
  return { channels, op: TAKE, options };
};

// **************************************************** read

ops.read = function read(channels, options) {
  return { channels, op: READ, options: { ...options, read: true } };
};
ops.sread = function sread(channels, to, options) {
  return ops.stake(channels, to, { ...options, read: true });
};
ops.unreadAll = function unreadAll(channel) {
  channel.buff.deleteReaders();
};

// **************************************************** close, reset, call, fork, merge, timeout, isChannel

ops.close = function close(channels) {
  channels = normalizeChannels(channels);
  channels.forEach(ch => {
    const newState = ch.buff.isEmpty() ? ENDED : CLOSED;
    ch.state(newState);
    ch.buff.puts.forEach(p => p.callback(newState));
    ch.buff.takes.forEach(t => t.callback(newState));
    grid.remove(ch);
    ch.subscribers = [];
    CHANNELS.del(ch.id);
    logger.log(ch, 'CHANNEL_CLOSED');
  });
  return { op: NOOP };
};
ops.sclose = function sclose(id) {
  return ops.close(id);
};
ops.channelReset = function channelReset(channels) {
  channels = normalizeChannels(channels);
  channels.forEach(ch => {
    ch.state(OPEN);
    ch.buff.reset();
    logger.log(ch, 'CHANNEL_RESET');
  });
  return { op: NOOP };
};
ops.schannelReset = function schannelReset(id) {
  channelReset(id);
};
ops.call = function call(routine, ...args) {
  return { op: CALL_ROUTINE, routine, args };
};
ops.fork = function fork(routine, ...args) {
  return { op: FORK_ROUTINE, routine, args };
};
ops.merge = function merge(...channels) {
  const newCh = chan();

  channels.forEach(ch => {
    (function taker() {
      ops.stake(ch, v => {
        if (v !== CLOSED && v !== ENDED && newCh.state() === OPEN) {
          ops.sput(newCh, v, taker);
        }
      });
    })();
  });
  return newCh;
};
ops.timeout = function timeout(interval) {
  const ch = chan();
  setTimeout(() => ops.close(ch), interval);
  return ch;
};
ops.isChannel = ch => ch && ch['@channel'] === true;
ops.isRiew = r => r && r['@riew'] === true;
ops.isState = s => s && s['@state'] === true;
ops.isRoutine = r => r && r['@routine'] === true;
ops.isStateReadChannel = s => s && s['@statereadchannel'] === true;
ops.isStateWriteChannel = s => s && s['@statewritechannel'] === true;

// **************************************************** go/routine

ops.go = function go(func, done = () => {}, ...args) {
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
      logger.log(api, 'ROUTINE_STOPPED');
    },
    rerun() {
      gen = func(...args);
      next();
      logger.log(this, 'ROUTINE_RERUN');
    },
  };
  const addSubRoutine = r => api.children.push(r);

  let gen = func(...args);

  function processGeneratorStep(i) {
    switch (i.value.op) {
      case PUT:
        ops.sput(i.value.channels, i.value.item, next);
        break;
      case TAKE:
        ops.stake(
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
        ops.sread(i.value.channels, next, i.value.options);
        break;
      case CALL_ROUTINE:
        addSubRoutine(ops.go(i.value.routine, next, ...i.value.args));
        break;
      case FORK_ROUTINE:
        addSubRoutine(ops.go(i.value.routine, () => {}, ...i.value.args));
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
      } else logger.log(api, 'ROUTINE_END');
    } else if (isPromise(step.value)) {
      logger.log(api, 'ROUTINE_ASYNC_BEGIN');
      step.value
        .then((...asyncResult) => {
          logger.log(api, 'ROUTINE_ASYNC_END');
          next(...asyncResult);
        })
        .catch(err => {
          logger.log(api, 'ROUTINE_ASYNC_ERROR', err);
          processGeneratorStep(gen.throw(err));
        });
    } else {
      processGeneratorStep(step);
    }
  }

  next();
  grid.add(api);
  logger.log(api, 'ROUTINE_STARTED');

  return api;
};
ops.go['@go'] = true;
ops.go.with = (...maps) => {
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
    return ops.go(func, done, ...args);
  };
};

ops.sleep = function sleep(ms, callback) {
  if (typeof callback === 'function') {
    setTimeout(callback, ms);
  } else {
    return { op: SLEEP, ms };
  }
};

ops.stop = function stop() {
  return { op: STOP };
};

export default ops;
