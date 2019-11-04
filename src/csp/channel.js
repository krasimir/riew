import { getId } from '../utils';
import FixedBuffer from './buffers/FixedBuffer';
import DroppingBuffer from './buffers/DroppingBuffer';

export const buffer = {
  fixed: FixedBuffer,
  dropping: DroppingBuffer,
  sliding: size => DroppingBuffer(size, true)
};

export function chan(...args) {
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
  const api = { id };
  const b = buff || buffer.fixed();

  api.put = item => b.put(item);
  api.take = () => b.take();
  api.__value = () => {
    console.warn('Riew: you should not get the channel\'s value directly! This method is here purely for testing purposes.');
    return buff.value();
  };

  return api;
};
