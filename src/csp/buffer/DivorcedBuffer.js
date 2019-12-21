import BufferInterface from "./Interface";

const noop = (v, c) => c(v);

export default function DivorcedBuffer(putTransform, takeTransform) {
  const api = BufferInterface();

  api.setValue = v => (api.value = v);
  api.put = (item, callback) => {
    (putTransform || noop)(item, transformedItem => {
      api.value = [transformedItem];
      callback(true);
    });
  };
  api.take = callback => {
    (takeTransform || noop)(api.value[0], transformedTake => {
      callback(transformedTake);
    });
  };

  return api;
}
