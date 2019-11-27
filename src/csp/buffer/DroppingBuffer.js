import BufferInterface from './Interface';

export default function DroppingBuffer(size = 1, sliding = false) {
  const api = BufferInterface();

  api.setValue = v => (api.value = v);
  api.put = (item, callback) => {
    let r = true;
    if (api.value.length < size) {
      api.value.push(item);
    } else if (sliding) {
      api.value.shift();
      api.value.push(item);
    } else {
      r = false;
    }
    if (api.takes.length > 0) {
      api.takes.shift()(api.value.shift());
    }
    callback(r);
  };
  api.take = callback => {
    if (api.value.length === 0) {
      api.takes.push(callback);
    } else {
      callback(api.value.shift());
    }
  };

  return api;
}
