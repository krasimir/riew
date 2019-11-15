import { CLOSED, ENDED, OPEN } from '../buffers/states';

export default function takeEvery(ch) {
  ch.takeEvery = callback => {
    (async function listen() {
      let v;
      while (true) {
        v = await ch.take();
        callback(v);
        if (v === ENDED) {
          break;
        }
      }
    })();
    return ch;
  };
}
