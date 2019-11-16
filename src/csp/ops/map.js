import { CLOSED, ENDED, OPEN } from '../buffer/states';
import { chan } from '../channel';

export default function map(ch) {
  let pipes = [];

  ch.map = func => {
    let newChan = chan();
    let firstTime = pipes.length === 0;
    pipes.push({ ch: newChan, func });
    if (firstTime) {
      (async function listen() {
        let v;
        while (v !== CLOSED && v !== ENDED) {
          v = await ch.take();
          pipes.forEach(({ ch, func }) => {
            if (ch.state() === OPEN) {
              ch.put(func(v));
            }
          });
        }
      })();
    }
    return newChan;
  };
}
