import { chan, ENDED, CLOSED, OPEN } from '../index';

export function merge(...channels) {
  const newCh = chan();

  channels.forEach(ch => {
    (function taker() {
      ch.take(v => {
        if (v !== CLOSED && v !== ENDED && newCh.state() === OPEN) {
          newCh.put(v, taker);
        }
      });
    })();
  });
  return newCh;
}
