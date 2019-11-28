import BufferInterface from './Interface';

const defaultReducer = (currentValue, newValue) => newValue;

export default function ReducerBuffer(reducer = defaultReducer) {
  const api = BufferInterface();
  let reducerValue;

  api.setValue = v => {
    api.value = [ v ];
    reducerValue = v;
  };
  api.put = (item, callback) => {
    if (api.takes.length === 0) {
      api.puts.push(v => {
        api.value.push((reducerValue = reducer(reducerValue, item)));
        if (api.takes.length > 0) {
          api.takes.shift()(api.value.shift());
        }
        callback(v || true);
      });
    } else {
      api.value.push((reducerValue = reducer(reducerValue, item)));
      api.takes.shift()(api.value.shift());
      callback(true);
    }
  };
  api.take = callback => {
    if (api.value.length === 0) {
      api.takes.push(callback);
      if (api.puts.length > 0) {
        api.puts.shift()();
        api.take(callback);
      }
    } else {
      callback(api.value.shift());
    }
  };

  return api;
}
