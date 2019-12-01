import BufferInterface from './Interface';

const defaultReducer = (currentValue, newValue) => newValue;

export default function ReducerBuffer(reducer = defaultReducer) {
  const api = BufferInterface();
  let reducerValue;

  api.value = [ reducer() ];
  api.setValue = v => {
    api.value = [ (reducerValue = v) ];
  };
  api.put = (item, callback) => {
    api.value = [ (reducerValue = reducer(reducerValue, item)) ];
    if (api.takes.length > 0) {
      api.takes.shift()();
    }
    callback(true);
  };
  api.take = callback => {
    if (api.value.length === 0) {
      api.takes.push(() => {
        callback(api.value.shift());
      });
    } else {
      callback(api.value.shift());
    }
  };

  return api;
}
