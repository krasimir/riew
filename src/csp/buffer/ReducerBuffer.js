import BufferInterface from './Interface';

export default function ReducerBuffer(reducer) {
  const api = BufferInterface();
  let v;

  api.put = item => {
    if (api.takes.length === 0) {
      return new Promise(resolve => {
        api.puts.push(() => {
          api.value.push((v = reducer(v, item)));
          resolve(true);
        });
      });
    }
    api.value.push((v = reducer(v, item)));
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
    return Promise.resolve(api.value.shift());
  };

  return api;
}
