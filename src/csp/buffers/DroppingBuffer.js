import BufferInterface from './Interface';

export default function DroppingBuffer(size = 1, sliding = false) {
  const api = BufferInterface();
  const { value, takes } = api;

  api.put = item => {
    let r = Promise.resolve(true);
    if (value.length < size) {
      value.push(item);
    } else if (sliding) {
      value.shift();
      value.push(item);
    } else {
      r = Promise.resolve(false);
    }
    if (takes.length > 0) {
      takes.shift()(value.shift());
    }
    return r;
  };
  api.take = () => {
    if (value.length === 0) {
      return new Promise(resolve => takes.push(resolve));
    }
    const v = value.shift();
    return Promise.resolve(v);
  };

  return api;
}
