import BufferInterface from './Interface';

export default function PersistingBuffer() {
  const api = BufferInterface();

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
