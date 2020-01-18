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
} from 'riew';

const ch = chan();

go(function* A() {
  const name = yield take(ch);
  yield put(ch, `Hey ${name}, how are you?`);
});
go(function* B() {
  yield put(ch, 'Steve');
  console.log(yield take(ch));
});
