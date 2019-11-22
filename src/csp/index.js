import b from './buffer';
import { default as Channel } from './channel';
import { default as Go } from './go';

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

export function isChannel(ch) {
  return ch && ch[ '@channel' ] === true;
}

export function isChannelPut(func) {
  return func && func[ '@channel_put' ] === true;
}

export function isChannelTake(func) {
  return func && func[ '@channel_take' ] === true;
}
