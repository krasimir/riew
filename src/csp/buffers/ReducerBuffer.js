import BufferInterface from './Interface';

export default function FixedBuffer(reducer) {
  const api = BufferInterface();
  const { value, takes, puts } = api;

  api.put = item => {
    value[0] = reducer(value[0], item);
    if (takes.length === 0) {
      return new Promise(resolve => {
        puts.push(() => {
          resolve(true);
        });
      });
    }
    return new Promise(resolve => {
      resolve(true);
      takes.shift()(value[0]);
    });
  };
  api.take = () => {
    if (puts.length === 0) {
      return new Promise(resolve => takes.push(resolve));
    }
    puts.shift()();
    return api.take();
  };

  return api;
}
