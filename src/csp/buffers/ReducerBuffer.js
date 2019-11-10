import BufferInterface from './Interface';

export default function FixedBuffer(reducer) {
  const api = BufferInterface();

  api.put = item => {
    api.value[0] = reducer(api.value[0], item);
    return new Promise(resolve => {
      resolve(true);
      if (api.takes.length > 0) {
        api.takes.shift()(api.value[0]);
      }
    });
  };
  api.take = () => {
    if (api.value.length > 0) {
      return Promise.resolve(api.value[0]);
    }
    return new Promise(resolve => {
      api.takes.push(v => resolve(v));
    });
  };

  return api;
}
