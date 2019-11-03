import { getId } from '../utils';
import FixedBuffer from './buffers/FixedBuffer';
import Dropping from './buffers/DroppingBuffer';

export const buffer = {
  fixed: FixedBuffer,
  dropping: Dropping
};

export function chan(...args) {
  let id = getId('ch'), buff;
  if (args.length === 2) {
    id = args[0];
    buff = args[1];
  } else if (args.length === 1 && typeof args[0] === 'string') {
    id = args[0];
    buff = buffer.fixed();
  } else if (args.length === 1 && typeof args[0] === 'object') {
    buff = args[0];
  } else {
    buff = buffer.fixed();
  }
  const api = { id };
  const b = buff || buffer.fixed();

  api.put = (item) => {
    return b.put(item);
  };
  api.take = () => {
    return b.take();
  };
  api.__value = () => {
    console.warn('Riew: you should not get the channel value directly! This method is here purely for testing purposes.');
    return buff.value();
  };

  return api;
};
