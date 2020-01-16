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

const s = state('something');

s.mutate('FOO', v => v);

go(function*() {
  console.log('routine');
  const a = yield read('FOO');
  console.log(a);
  return go;
});

console.log(chan('FOO'));

sput('FOO', 'NNN');
