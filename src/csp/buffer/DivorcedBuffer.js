import BufferInterface from "./Interface";

const noop = (v, c) => c(v);

export default function DivorcedBuffer() {
  const api = BufferInterface();

  api.setValue = v => (api.value = v);
  api.put = (item, callback) => {
    api.value = [item];
    callback(true);
  };
  api.take = callback => {
    callback(api.value[0]);
  };

  return api;
}
