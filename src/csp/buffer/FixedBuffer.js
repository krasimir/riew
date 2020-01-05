import BufferInterface from './Interface';

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
              api.takes.shift()(api.value.shift());
            }
            callback(v || true);
          },
          item,
        });
      }
    } else {
      api.value.push(item);
      api.takes.shift()(api.value.shift());
      callback(true);
    }
  };
  api.take = callback => {
    if (api.value.length === 0) {
      if (api.puts.length > 0) {
        api.puts.shift().callback();
        api.take(callback);
      } else {
        api.takes.push(callback);
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
