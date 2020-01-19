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

function* delegation() {
  yield sleep(1000);
  console.log('Wait for me');
}
function* parallel() {
  yield sleep(1000);
  console.log('I run in parallel');
}
function* main() {
  console.log('A');
  yield call(delegation);
  console.log('B');
  yield fork(parallel);
  console.log('C');
}
go(main);
