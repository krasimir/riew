export default function FixedBuffer(size = 0) {
  const api = {};
  const value = [];
  const puts = [];
  const takes = [];

  api.put = item => {
    if (takes.length === 0) {
      if (value.length < size) {
        value.push(item);
        return Promise.resolve(true);
      }
      return new Promise(resolve => {
        puts.push(() => {
          value.push(item);
          resolve(true);
        });
      });
    }
    value.push(item);
    return new Promise(resolve => {
      resolve(true);
      takes.shift()(value.shift());
    });
  };
  api.take = () => {
    if (value.length === 0) {
      if (puts.length === 0) {
        return new Promise(resolve => takes.push(resolve));
      }
      puts.shift()();
      return api.take();
    }
    const v = value.shift();
    if (value.length < size && puts.length > 0) {
      puts.shift()();
    }
    return Promise.resolve(v);
  };
  api.value = () => value;
  api.puts = () => puts;
  api.takes = () => takes;
  api.isEmpty = () =>
    value.length === 0 && puts.length === 0 && takes.length === 0;

  return api;
}
