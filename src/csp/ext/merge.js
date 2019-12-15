import { chan, ENDED, CLOSED, OPEN, sput, stake } from '../../index';

export function merge(...channels) {
  const newCh = chan();

  channels.forEach(ch => {
    (function taker() {
      stake(ch, v => {
        if (v !== CLOSED && v !== ENDED && newCh.state() === OPEN) {
          sput(newCh, v, taker);
        }
      });
    })();
  });
  return newCh;
}
