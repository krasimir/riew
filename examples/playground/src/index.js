/* eslint-disable no-unused-vars */
import {
  go,
  fixed,
  sleep,
  put,
  take,
  sput,
  sliding,
  inspector,
  stake,
  state,
} from 'riew';

inspector(() => {}, true);

const s = state('foo');
