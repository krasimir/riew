/* eslint-disable no-param-reassign */
import BufferInterface from './Interface';
import { normalizeOptions } from '../utils';

export default function DroppingBuffer(size = 1, sliding = false) {
  const api = BufferInterface();

  api.setValue = v => (api.value = v);
  api.put = (item, callback) => {
    let r = true;
    console.log(item, api.value.length, size);
    if (api.value.length < size) {
      api.value.push(item);
    } else if (sliding) {
      api.value.shift();
      api.value.push(item);
    } else {
      r = false;
    }
    const { readers, takers } = api.decomposeTakers();
    readers.forEach(reader => api.consumeTake(reader, item));
    if (takers.length > 0) {
      api.consumeTake(takers[0], api.value.shift());
    }
    console.log(item, r);
    callback(r);
  };
  api.take = (callback, options) => {
    options = normalizeOptions(options);
    if (api.value.length === 0) {
      api.takes.push({ callback, options });
    } else {
      callback(api.value.shift());
    }
  };

  return api;
}
