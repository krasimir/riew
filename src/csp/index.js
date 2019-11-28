import b from './buffer';
import { chan as Channel, go as Go } from './channel';
export { isChannel, isChannelPut, isChannelTake, put, take, sleep, takeLatest } from './channel';

export const buffer = b;
export const chan = Channel;
export const go = Go;

export function state(value) {
  if (typeof value !== 'undefined') {
    return Channel().from([ value ]);
  }
  return Channel();
}

export function timeout(interval) {
  const ch = Channel();
  setTimeout(() => ch.close(), interval);
  return ch;
}

export function merge(...channels) {
  const newCh = Channel();

  channels.map(ch => {
    (async function listen() {
      let v;
      while (v !== Channel.CLOSED && v !== Channel.ENDED && newCh.state() === Channel.OPEN) {
        v = await ch.take();
        newCh.put(v);
      }
    })();
  });

  return newCh;
}
