import BufferInterface from './Interface';

export default function DroppingBuffer(size = 1, sliding = false) {
  const api = BufferInterface();

  api.setValue = v => (api.value = v);
  api.put = item => {
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
    return r;
  };
  api.take = () => {
    if (api.value.length === 0) {
      return new Promise(resolve => api.takes.push(resolve));
    }
    const v = api.value.shift();
    return v;
  };

  return api;
}
