import { CLOSED, ENDED } from '../buffers/states';
import { chan } from '../channel';

export default function filter(api) {
  api.filter = func => {
    const newChan = chan();
    (async function listen() {
      let v;
      while (v !== CLOSED && v !== ENDED) {
        v = await api.take();
        if (func(v)) {
          newChan.put(v);
        }
      }
    })();
    return newChan;
  };
}
