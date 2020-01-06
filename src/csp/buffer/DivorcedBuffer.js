import BufferInterface from './Interface';

const putResolver = (getItem, callback) => callback(getItem());
const takeResolver = (getValue, callback) => callback(getValue());

export default function DivorcedBuffer(
  onPut = putResolver,
  onTake = takeResolver
) {
  const api = BufferInterface();

  api.setValue = v => (api.value = v);
  api.put = (item, callback) => {
    onPut(
      () => item,
      value => {
        api.value = [value];
        callback(true);
      }
    );
  };
  api.take = callback => {
    onTake(
      () => api.value[0],
      value => {
        callback(value);
      }
    );
  };

  return api;
}
