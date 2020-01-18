/* eslint-disable no-param-reassign, no-multi-assign */
import {
  ALL_REQUIRED,
  isChannel,
  isState,
  sput,
  verifyChannel,
} from '../index';

export function normalizeChannels(channels, stateOp = 'READ') {
  if (!Array.isArray(channels)) channels = [channels];
  return channels.map(ch => {
    if (isState(ch)) return ch[stateOp];
    return verifyChannel(ch);
  });
}

const DEFAULT_OPTIONS = {
  onError: null,
  initialCall: false,
};

export function normalizeTo(to) {
  if (typeof to === 'function') {
    return to;
  }
  if (isChannel(to)) {
    return v => sput(to, v);
  }
  throw new Error(
    `${to}${
      typeof to !== 'undefined' ? ` (${typeof to})` : ''
    } is not a channel.${
      typeof ch === 'string'
        ? ` Did you forget to define it?\nExample: chan("${to}")`
        : ''
    }`
  );
}
export function normalizeOptions(options) {
  options = options || DEFAULT_OPTIONS;
  const onError = options.onError || DEFAULT_OPTIONS.onError;
  const strategy = options.strategy || ALL_REQUIRED;
  const listen = 'listen' in options ? options.listen : false;
  const read = 'read' in options ? options.read : false;
  const initialCall =
    'initialCall' in options
      ? options.initialCall
      : DEFAULT_OPTIONS.initialCall;

  return {
    onError,
    strategy,
    initialCall,
    listen,
    read,
    userTakeCallback: options.userTakeCallback,
  };
}
