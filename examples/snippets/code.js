/* eslint-disable no-unused-vars */
import {
  chan,
  buffer,
  sput,
  sread,
  take,
  go,
  put,
  riew,
  state,
  sleep,
  stop,
  register,
  ONE_OF,
  stake,
  close,
  sclose,
  read,
  unreadAll,
  call,
  fork,
  timeout,
  merge,
  use,
  listen,
  sliding,
} from 'riew';

const chA = chan();
const chB = chan();

listen(
  [chA, chB],
  (v, idx) => {
    console.log(v, idx);
  },
  { strategy: ONE_OF }
);

sput(chA, 'foo');
sput(chB, 'bar');
sput(chA, 'moo');
