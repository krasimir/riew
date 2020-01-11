/* eslint-disable no-param-reassign */
import { normalizeOptions } from './utils';

const DEFAULT_OPTIONS = { dropping: false, sliding: false, divorced: false };

function BufferInterface() {
  return {
    value: [],
    puts: [],
    takes: [],
    isEmpty() {
      return this.value.length === 0;
    },
    reset() {
      this.value = [];
      this.puts = [];
      this.takes = [];
    },
    setValue(v) {
      this.value = v;
    },
    getValue() {
      return this.value;
    },
    decomposeTakers() {
      return this.takes.reduce(
        (res, take) => {
          res[take.options.read ? 'readers' : 'takers'].push(take);
          return res;
        },
        {
          readers: [],
          takers: [],
        }
      );
    },
    consumeTake(take, value) {
      if (!take.options.listen) {
        const idx = this.takes.findIndex(t => t === take);
        if (idx >= 0) this.takes.splice(idx, 1);
      }
      take.callback(value);
    },
    deleteReader(cb) {
      const idx = this.takes.findIndex(({ callback }) => callback === cb);
      if (idx >= 0) {
        this.takes.splice(idx, 1);
      }
    },
  };
}

function CSPBuffer(size = 0, { dropping, sliding } = DEFAULT_OPTIONS) {
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
  api.take = (callback, options) => {
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
  divorced: size => CSPBuffer(size, { divorced: true }),
};

export default buffer;
