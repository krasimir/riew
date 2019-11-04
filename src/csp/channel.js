import { getId } from '../utils';
import FixedBuffer from './buffers/FixedBuffer';
import DroppingBuffer from './buffers/DroppingBuffer';

const OPEN = 'OPEN';
const CLOSED = 'CLOSED';
const ENDED = 'ENDED';

export const buffer = {
  fixed: FixedBuffer,
  dropping: DroppingBuffer,
  sliding: size => DroppingBuffer(size, true)
};

export function chan(...args) {
  let state = OPEN;
  const [ id, buff ] = normalizeChannelArguments(args);
  const api = { id };

  function isEnded() {
    if (state === ENDED) return true;
    if (state === CLOSED && buff.isEmpty()) {
      state = ENDED;
      return true;
    }
    return false;
  }

  api.put = item => {
    if (isEnded()) return Promise.resolve(state);
    return state === CLOSED ? Promise.resolve(state) : buff.put(item);
  };
  api.take = () => {
    if (isEnded()) return Promise.resolve(state);
    return buff.take();
  };
  api.state = () => state;
  api.close = () => (state = CLOSED);
  api.open = () => (state = OPEN);
  api.__value = () => {
    console.warn('Riew: you should not get the channel\'s value directly! This method is here purely for testing purposes.');
    return buff.value();
  };

  return api;
};
chan.OPEN = 'OPEN';
chan.CLOSED = 'CLOSED';
chan.ENDED = 'ENDED';

function normalizeChannelArguments(args) {
  let id, buff;
  if (args.length === 2) {
    id = args[0];
    buff = args[1];
  } else if (args.length === 1 && typeof args[0] === 'string') {
    id = args[0];
    buff = buffer.fixed();
  } else if (args.length === 1 && typeof args[0] === 'object') {
    id = getId('ch');
    buff = args[0];
  } else {
    id = getId('ch');
    buff = buffer.fixed();
  }
  return [ id, buff ];
};