/* eslint-disable no-param-reassign, no-multi-assign */
import { chan, isChannel, isState, sput, buffer } from '../index';
import { ALL_REQUIRED } from './constants';

export function normalizeChannels(channels, stateOp = 'READ') {
  if (!Array.isArray(channels)) channels = [channels];
  return channels.map(ch => {
    if (isState(ch)) ch = ch[stateOp];
    return isChannel(ch) ? ch : chan(ch);
  });
}

const DEFAULT_OPTIONS = {
  transform: null,
  onError: null,
  initialCall: true,
};

export function normalizeTo(to) {
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
    `'read' accepts string, channel or a function as a second argument. ${to} given.`
  );
}
export function normalizeOptions(options) {
  options = options || DEFAULT_OPTIONS;
  const transform = options.transform || DEFAULT_OPTIONS.transform;
  const onError = options.onError || DEFAULT_OPTIONS.onError;
  const strategy = options.strategy || ALL_REQUIRED;
  const listen = 'listen' in options ? options.listen : false;
  const read = 'read' in options ? options.read : false;
  const initialCall =
    'initialCall' in options
      ? options.initialCall
      : DEFAULT_OPTIONS.initialCall;

  return { transform, onError, strategy, initialCall, listen, read };
}
