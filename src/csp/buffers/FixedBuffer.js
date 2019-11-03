export default function FixedBuffer(size = 0) {
  const api = {};
  const items = [], puts = [], takes = [];

  api.put = item => {
    if (takes.length === 0) {
      return new Promise(resolve => {
        puts.push(() => {
          items.push(item);
          resolve();
        });
      });
    };
    items.push(item);
    return new Promise(resolve => {
      resolve();
      takes.shift()(items.shift());
    });
  };
  api.take = () => {
    if (items.length === 0) {
      if (puts.length === 0) {
        return new Promise(resolve => takes.push(resolve));
      }
      puts.shift()();
      return api.take();
    };
    return Promise.resolve(items.shift());
  };
  api.size = () => items.length;

  return api;
}
