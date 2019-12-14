import { chan, close } from '../index';

export function timeout(interval) {
  const ch = chan();
  setTimeout(() => close(ch), interval);
  return ch;
}
