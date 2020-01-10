/* eslint-disable no-param-reassign */
import BufferInterface from './Interface';
import { normalizeOptions } from '../utils';

const DEFAULT_OPTIONS = { dropping: false, sliding: false };

export default function FixedBuffer(size = 0, { dropping } = DEFAULT_OPTIONS) {
  const api = BufferInterface();

  api.setValue = v => (api.value = v);
  api.put = (item, callback) => {
    const { readers, takers } = api.decomposeTakers();
    // console.log(
    //   `put=${item}`,
    //   `readers=${readers.length}`,
    //   `takers=${takers.length}`,
    //   `value=${api.value.length} size=${size}`
    // );

    // resolving readers
    readers.forEach(reader => api.consumeTake(reader, item));

    // resolving takers
    if (takers.length > 0) {
      api.consumeTake(takers[0], item);
      callback(true);
    } else {
      if (api.value.length < size) {
        api.value.push(item);
        callback(true);
        return;
      }
      if (dropping) {
        callback(false);
        return;
      }
      api.puts.push({
        callback: v => {
          api.value.push(item);
          callback(v || true);
        },
        item,
      });
    }
  };
  api.take = (callback, options) => {
    // console.log('take', `puts=${api.puts.length}`, `value=${api.value.length}`);
    options = normalizeOptions(options);
    if (api.value.length === 0) {
      if (api.puts.length > 0 && !options.read) {
        api.puts.shift().callback();
        callback(api.value.shift());
      } else {
        api.takes.push({ callback, options });
      }
    } else if (options.read) {
      callback(api.value[0]);
    } else {
      const v = api.value.shift();
      callback(v);
      if (api.value.length < size && api.puts.length > 0) {
        api.puts.shift().callback();
      }
    }
  };

  return api;
}
