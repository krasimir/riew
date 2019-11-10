import BufferInterface from './Interface';

export default function FixedBuffer(size = 0) {
  const api = BufferInterface();

  api.put = item => {
    if (api.takes.length === 0) {
      if (api.value.length < size) {
        api.value.push(item);
        return Promise.resolve(true);
      }
      return new Promise(resolve => {
        api.puts.push(v => {
          api.value.push(item);
          resolve(v || true);
        });
      });
    }
    api.value.push(item);
    return new Promise(resolve => {
      resolve(true);
      api.takes.shift()(api.value.shift());
    });
  };
  api.take = () => {
    if (api.value.length === 0) {
      if (api.puts.length === 0) {
        return new Promise(resolve => api.takes.push(resolve));
      }
      api.puts.shift()();
      return api.take();
    }
    const v = api.value.shift();
    if (api.value.length < size && api.puts.length > 0) {
      api.puts.shift()();
    }
    return Promise.resolve(v);
  };

  return api;
}
