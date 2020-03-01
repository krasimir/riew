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
  listen,
} from '../../../src';

inspector(() => {}, true);

const s = state('foo');
const toLowerCase = s.select(v => v.toLowerCase())`toLowerCase`;

listen(toLowerCase, v => console.log(v));
sput(s, 'BAR');

// const update = s.mutate((current, payload) => current + payload);
