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

// A state which value is an empty array.
const users = state([]);

// Channel for updating the state value.
const add = users.mutate(function reducer(currentUsers, newUser) {
  return [...currentUsers, newUser];
});
// Channel for reading the state value.
const getUsers = users.select(function mapping(users) {
  return users.map(({ name }) => name).join(', ');
});

go(function* A() {
  yield put(add, { name: 'Steve', age: 24 });
  yield put(add, { name: 'Ana', age: 25 });
  yield put(add, { name: 'Peter', age: 22 });
  console.log(yield take(getUsers)); // Steve, Ana, Peter
});
