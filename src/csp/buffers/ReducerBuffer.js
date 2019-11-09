import BufferInterface from './Interface';

export default function FixedBuffer(reducer) {
  const api = BufferInterface();
  const { value, takes } = api;

  api.put = item => {
    value[0] = reducer(value[0], item);
    return new Promise(resolve => {
      resolve(true);
      if (takes.length > 0) {
        takes.shift()(value[0]);
      }
    });
  };
  api.take = () => {
    if (value.length > 0) {
      return Promise.resolve(value[0]);
    }
    return new Promise(resolve => {
      takes.push(v => resolve(v));
    });
  };

  return api;
}
