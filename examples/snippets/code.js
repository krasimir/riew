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

sread(ch, value => {
  console.log(value);
});

go(function* A() {
  yield put(ch, 'foo');
  yield put(ch, 'bar'); // <-- never happens
});
