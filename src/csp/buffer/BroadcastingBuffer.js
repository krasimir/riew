import BufferInterface from './Interface';

export default function FixedBuffer() {
  const api = BufferInterface();
  const consumeTakes = value => {
    // We have to make sure that takes added as part of another take
    // still happen.
    const takes = [ ...api.takes ];
    api.takes = [];
    takes.forEach(t => t(value));
  };

  api.setValue = v => (api.value = v);
  api.put = (item, callback) => {
    if (api.takes.length === 0) {
      api.puts.push(v => {
        api.value.push(item);
        if (api.takes.length > 0) {
          consumeTakes(api.value.shift());
        }
        callback(v || true);
      });
    } else {
      consumeTakes(item);
      callback(true);
    }
  };
  api.take = callback => {
    if (api.value.length === 0) {
      if (api.puts.length > 0) {
        api.puts.shift()();
        api.take(callback);
      } else {
        api.takes.push(callback);
      }
    } else {
      const v = api.value.shift();
      callback(v);
    }
  };

  return api;
}
