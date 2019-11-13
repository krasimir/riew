import { CLOSED, ENDED, OPEN } from '../buffers/states';
import { chan } from '../channel';
import { chainOperations } from './index';

export default function filter(api) {
  api.filter = func => {
    const newChan = chan();
    (async function listen() {
      let v;
      while (v !== CLOSED && v !== ENDED && newChan.state() === OPEN) {
        v = await api.take();
        if (func(v)) {
          newChan.put(v);
        }
      }
    })();
    return chainOperations(api);
  };
}
