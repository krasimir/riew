export default function FixedBuffer(reducer) {
  const api = {};
  const puts = [];
  const takes = [];
  let value;

  api.put = item => {
    value = reducer(value, item);
    if (takes.length === 0) {
      return new Promise(resolve => {
        puts.push(() => {
          resolve(true);
        });
      });
    }
    return new Promise(resolve => {
      resolve(true);
      takes.shift()(value);
    });
  };
  api.take = () => {
    if (puts.length === 0) {
      return new Promise(resolve => takes.push(resolve));
    }
    puts.shift()();
    return api.take();
  };
  api.value = () => value;
  api.puts = () => puts;
  api.takes = () => takes;
  api.isEmpty = () => puts.length === 0 && takes.length === 0;
  api.close = v => {
    while (takes.length > 0) takes.shift()(v);
  };

  return api;
}
