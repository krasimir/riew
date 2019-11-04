export default function DroppingBuffer(size = 1, sliding = false) {
  const api = {};
  const value = [], takes = [];

  api.put = item => {
    if (value.length < size) {
      value.push(item);
    } else if (sliding) {
      value.shift();
      value.push(item);
    }
    if (takes.length > 0) {
      takes.shift()(value.shift());
    }
    return Promise.resolve(true);
  };
  api.take = () => {
    if (value.length === 0) {
      return new Promise(resolve => takes.push(resolve));
    };
    const v = value.shift();
    return Promise.resolve(v);
  };
  api.value = () => value;
  api.isEmpty = () => value.length === 0;

  return api;
}
