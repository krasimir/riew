import { getId } from '../utils';
import FixedBuffer from './buffers/FixedBuffer';

export function chan(id) {
  if (typeof id === 'undefined') id = getId('ch');
  const api = { id };
  const buffer = FixedBuffer();

  api.put = (item) => {
    return buffer.put(item);
  };
  api.take = () => {
    return buffer.take();
  };

  return api;
};
