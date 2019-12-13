import { chan } from '../index';

export function merge(...channels) {
  const newCh = chan();

  channels.forEach(ch => {
    (function taker() {
      ch.take(v => {
        if (v !== chan.CLOSED && v !== chan.ENDED && newCh.state() === chan.OPEN) {
          newCh.put(v, taker);
        }
      });
    })();
  });
  return newCh;
}
