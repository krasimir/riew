/* eslint-disable no-param-reassign, no-multi-assign */
import { chan, isChannel, isState } from '../index';

export function normalizeChannels(channels, stateOp = 'READ') {
  if (!Array.isArray(channels)) channels = [channels];
  return channels.map(ch => {
    if (isState(ch)) ch = ch[stateOp];
    return isChannel(ch) ? ch : chan(ch);
  });
}
