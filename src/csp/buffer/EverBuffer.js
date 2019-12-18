import BufferInterface from './Interface';

export default function EverBuffer(...args) {
  const api = BufferInterface();

  if (args.length > 0) {
    api.value = [ args[ 0 ] ];
  }
  api.setValue = v => (api.value = v);
  api.put = (item, callback) => {
    api.value = [ item ];
    callback(true);
  };
  api.take = callback => {
    callback(api.value[ 0 ]);
  };

  return api;
}
