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

register('config', { theme: 'dark' });

const r = riew(function(props) {
  console.log(`Selected theme: ${props.config.theme}`); // Selected theme: dark
}).with('config');

r.mount();
