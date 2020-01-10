/* eslint-disable no-param-reassign */
import BufferInterface from './Interface';
import { normalizeOptions } from '../utils';

export default function FixedBuffer(size = 0) {
  const api = BufferInterface();

  api.setValue = v => (api.value = v);
  api.put = (item, callback) => {
    if (api.takes.length === 0) {
      if (api.value.length < size) {
        api.value.push(item);
        callback(true);
      } else {
        api.puts.push({
          callback: v => {
            api.value.push(item);
            if (api.takes.length > 0) {
              api.takes.shift().callback(api.value.shift());
            }
            callback(v || true);
          },
          item,
        });
      }
    } else {
      api.value.push(item);
      api.takes.reduce(
        (status, take, idx) => {
          if (take.options.read) {
            api.takes.splice(idx, 1);
            take.callback(item);
          } else if (!status.takeConsumed) {
            api.takes.splice(idx, 1);
            take.callback(api.value.shift());
            status.takeConsumed = true;
            callback(true);
          }
        },
        { takeConsumed: false }
      );
    }
  };
  api.take = (callback, options) => {
    options = normalizeOptions(options);
    if (api.value.length === 0) {
      if (api.puts.length > 0) {
        api.puts.shift().callback();
        api.take(callback);
      } else {
        api.takes.push({ callback, options });
      }
    } else {
      const v = api.value.shift();
      if (api.value.length < size && api.puts.length > 0) {
        api.puts.shift().callback();
      }
      callback(v);
    }
  };

  return api;
}
