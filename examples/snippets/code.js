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

const ch = chan('MYCHANNEL', buffer.dropping(2));

go(function* A() {
  yield put(ch, 'foo');
  yield put(ch, 'bar');
  yield put(ch, 'moo');
  yield put(ch, 'zoo');
});
go(function* B() {
  yield sleep(2000);
  console.log(yield take(ch));
  console.log(yield take(ch));
});
