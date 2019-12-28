import { go, put, take, sread, sput, chan } from 'riew';

function simulateAsync() {
  return new Promise(done => setTimeout(done, 2000));
}

const machine = chan();
const transitions = {
  idle: {
    fetch: 'loading',
  },
  loading: {
    resolve: 'success',
    reject: 'failure',
  },
  success: {
    print: 'idle',
  },
  failure: {
    retry: 'loading',
  },
};

go(function*() {
  const currentState = yield take(machine);
  const newState = yield take(Object.keys(transitions[currentState]));
  console.log(newState);
});

// go(function*() {
//   yield take('idle');
//   try {
//     yield put(state, 'FETCH');
//     yield simulateAsync();
//   } catch (err) {}
// });

sput(machine, 'idle');
