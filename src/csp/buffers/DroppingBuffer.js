export default function DroppingBuffer(size = 0) {
  const api = {};
  const value = [], puts = [], takes = [];

  api.put = item => {
    if (takes.length === 0) {
      if (value.length < size) {
        value.push(item);
        return Promise.resolve();
      }
      return new Promise(resolve => {
        puts.push(() => {
          value.push(item);
          resolve();
        });
      });
    };
    value.push(item);
    return new Promise(resolve => {
      resolve();
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
    };
    const v = value.shift();
    if (value.length < size && puts.length > 0) {
      puts.shift()();
    }
    return Promise.resolve(v);
  };
  api.size = () => value.length;
  api.value = () => value;

  return api;
}
