/* eslint-disable no-param-reassign */
import { normalizeOptions } from './utils';
import { logger } from '../index';

const DEFAULT_OPTIONS = { dropping: false, sliding: false, memory: false };
const NOOP = (v, cb) => cb(v);

function CSPBuffer(size = 0, { dropping, sliding, memory } = DEFAULT_OPTIONS) {
  const api = {
    value: [],
    puts: [],
    takes: [],
    hooks: {
      beforePut: NOOP,
      afterPut: NOOP,
      beforeTake: cb => cb(),
      afterTake: NOOP,
    },
    parent: null,
  };

  api.beforePut = hook => (api.hooks.beforePut = hook);
  api.afterPut = hook => (api.hooks.afterPut = hook);
  api.beforeTake = hook => (api.hooks.beforeTake = hook);
  api.afterTake = hook => (api.hooks.afterTake = hook);
  api.isEmpty = () => api.value.length === 0;
  api.reset = () => {
    api.value = [];
    api.puts = [];
    api.takes = [];
  };
  api.setValue = v => {
    api.value = v;
  };
  api.getValue = () => api.value;
  api.decomposeTakers = () =>
    api.takes.reduce(
      (res, takeObj) => {
        res[takeObj.options.read ? 'readers' : 'takers'].push(takeObj);
        return res;
      },
      {
        readers: [],
        takers: [],
      }
    );
  api.consumeTake = (takeObj, value) => {
    if (!takeObj.options.listen) {
      const idx = api.takes.findIndex(t => t === takeObj);
      if (idx >= 0) api.takes.splice(idx, 1);
    }
    takeObj.callback(value);
  };
  api.deleteReader = cb => {
    const idx = api.takes.findIndex(({ callback }) => callback === cb);
    if (idx >= 0) {
      api.takes.splice(idx, 1);
    }
  };
  api.deleteReaders = () => {
    api.takes = api.takes.filter(({ options }) => !options.read);
  };

  api.setValue = v => (api.value = v);

  const put = (item, callback) => {
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
    if (memory) {
      api.value = [item];
      callback(true);
      if (takers.length > 0) {
        api.consumeTake(takers[0], item);
      }
      return;
    }
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
      if (sliding) {
        api.value.shift();
        api.value.push(item);
        callback(true);
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

  const take = (callback, options) => {
    // console.log('take', `puts=${api.puts.length}`, `value=${api.value.length}`);
    options = normalizeOptions(options);
    if (api.value.length === 0) {
      if (api.puts.length > 0 && !options.read) {
        api.puts.shift().callback();
        callback(api.value.shift());
      } else {
        api.takes.push({ callback, options });
        return () => api.deleteReader(callback);
      }
    } else if (memory) {
      callback(api.value[0]);
      if (options.listen) {
        api.takes.push({ callback, options });
        return () => api.deleteReader(callback);
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
    return () => {};
  };

  api.put = (item, callback) => {
    logger.log({ id: api.parent }, 'CHANNEL_PUT_INITIATED', item);
    return api.hooks.beforePut(item, beforePutRes =>
      put(beforePutRes, putOpRes =>
        api.hooks.afterPut(putOpRes, res => {
          logger.log({ id: api.parent }, 'CHANNEL_PUT_RESOLVED', res);
          callback(res);
        })
      )
    );
  };
  api.take = (callback, options) => {
    logger.log({ id: api.parent }, 'CHANNEL_TAKE_INITIATED');
    return api.hooks.beforeTake(() =>
      take(
        takeOpRes =>
          api.hooks.afterTake(takeOpRes, (...res) => {
            logger.log({ id: api.parent }, 'CHANNEL_TAKE_RESOLVED', res);
            callback(...res);
          }),
        options
      )
    );
  };

  return api;
}

const buffer = {
  fixed: CSPBuffer,
  dropping: (size = 1) => {
    if (size < 1) {
      throw new Error('The dropping buffer should have at least size of one.');
    }
    return CSPBuffer(size, { dropping: true });
  },
  sliding: (size = 1) => {
    if (size < 1) {
      throw new Error('The sliding buffer should have at least size of one.');
    }
    return CSPBuffer(size, { sliding: true });
  },
  memory: () => CSPBuffer(0, { memory: true }),
};

export default buffer;
