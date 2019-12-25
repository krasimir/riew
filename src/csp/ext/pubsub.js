/* eslint-disable no-param-reassign */
import { chan, isChannel, go, buffer, isState } from '../../index';
import { SUB } from '../constants';
import { sput } from '../ops';
import { isGeneratorFunction } from '../../utils';

const NOTHING = Symbol('Nothing');

function normalizeChannels(channels) {
  if (!Array.isArray(channels)) channels = [channels];
  return channels.map(ch => {
    if (isState(ch)) ch = ch.READ;
    return isChannel(ch) ? ch : chan(ch);
  });
}
function normalizeTo(to) {
  if (typeof to === 'function') {
    return to;
  }
  if (isChannel(to)) {
    return to.__subFunc || (to.__subFunc = v => sput(to, v));
  }
  if (typeof to === 'string') {
    const ch = chan(to, buffer.divorced());
    return (ch.__subFunc = v => sput(to, v));
  }
  throw new Error(
    `'sub' accepts string, channel or a function as a second argument. ${to} given.`
  );
}
function defaultTransform(...args) {
  if (args.length === 1) return args[0];
  return args;
}

const DEFAULT_OPTIONS = {
  transform: defaultTransform,
  onError: null,
  initialCall: true,
};

export function sub(channels, to, options) {
  options = options || DEFAULT_OPTIONS;
  const transform = options.transform || DEFAULT_OPTIONS.transform;
  const onError = options.onError || DEFAULT_OPTIONS.onError;
  const initialCall =
    'initialCall' in options
      ? options.initialCall
      : DEFAULT_OPTIONS.initialCall;

  // in a routine
  if (typeof to === 'undefined') {
    return { ch: channels, op: SUB };
  }

  // outside routine
  channels = normalizeChannels(channels); // array of channels
  to = normalizeTo(to); // function

  const data = channels.map(() => NOTHING);
  let composedAtLeastOnce = false;
  channels.forEach((ch, idx) => {
    const notify = (value, done = () => {}) => {
      data[idx] = value;
      // Notify the subscriber only if all the sources are fulfilled.
      // In case of one source we don't have to wait.
      if (composedAtLeastOnce || data.length === 1 || !data.includes(NOTHING)) {
        composedAtLeastOnce = true;
        try {
          if (isGeneratorFunction(transform)) {
            go(
              transform,
              v => {
                to(v);
                done();
              },
              value
            );
          } else {
            to(transform(...data));
            done();
          }
        } catch (e) {
          if (onError === null) {
            throw e;
          }
          onError(e);
        }
      }
    };
    if (!ch.subscribers.find(({ to: t }) => t === to)) {
      ch.subscribers.push({ to, notify });
    }
    // If there is already a value in the channel
    // notify the subscribers.
    const currentChannelBufValue = ch.value();
    if (initialCall && currentChannelBufValue.length > 0) {
      notify(currentChannelBufValue[0]);
    }
  });
  return to;
}
export function unsub(id, callback) {
  const ch = isChannel(id) ? id : chan(id);
  if (isChannel(callback)) {
    callback = callback.__subFunc;
  }
  ch.subscribers = ch.subscribers.filter(({ to }) => {
    if (to !== callback) {
      return true;
    }
    return false;
  });
}
export function subOnce(channel, callback, options = DEFAULT_OPTIONS) {
  const c = v => {
    unsub(channel, c);
    if (!isChannel(callback)) {
      callback(v);
    } else {
      sput(callback, v);
    }
  };
  sub(channel, c, options);
}
export function unsubAll(id) {
  const ch = isChannel(id) ? id : chan(id);
  ch.subscribers = [];
}
export function read(...args) {
  return sub(...args);
}
