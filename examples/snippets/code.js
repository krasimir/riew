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
} from 'riew';

const ch = chan();

listen(ch, value => {
  console.log(`Value: ${value}`);
});

sput(ch, 'foo'); // Value: foo
sput(ch, 'bar'); // Value: bar
sput(ch, 'moo'); // Value: moo
