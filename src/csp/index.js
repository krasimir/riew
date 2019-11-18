import b from './buffer';
import { default as Channel } from './channel';

export const buffer = b;
export const chan = Channel;

export function state(value) {
  return Channel(b.fixed()).from([ value ]);
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

export function isChannel(ch) {
  return ch && ch[ '@channel' ] === true;
}

export function isChannelPut(func) {
  return func && func[ '@channel_put' ] === true;
}

export function isChannelTake(func) {
  return func && func[ '@channel_take' ] === true;
}
