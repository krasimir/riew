import { CLOSED, ENDED, OPEN } from '../buffer/states';
import { chan } from '../channel';

export default function filter(ch) {
  let pipes = [];

  ch.filter = func => {
    let newChan = chan();
    let firstTime = pipes.length === 0;
    pipes.push({ ch: newChan, func });
    if (firstTime) {
      (async function listen() {
        let v;
        while (v !== CLOSED && v !== ENDED) {
          v = await ch.take();
          pipes.forEach(({ ch, func }) => {
            if (ch.state() === OPEN && func(v)) {
              ch.put(v);
            }
          });
        }
      })();
    }
    return newChan;
  };
}
