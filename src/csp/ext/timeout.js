import { chan } from '../index';

export function timeout(interval) {
  const ch = chan();
  setTimeout(() => ch.close(), interval);
  return ch;
}
