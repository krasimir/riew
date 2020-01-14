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

register('config', { theme: 'dark' });

const view = function(props) {
  console.log(`Selected theme: ${props.theme}`); // Selected theme: dark
};
const routine = function*({ render }) {
  const config = use('config');
  render({ theme: config.theme });
};
const r = riew(view, routine).with('config');

r.mount();
