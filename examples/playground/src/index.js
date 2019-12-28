import { go, sleep, put, take, stake, sput, ONE_OF } from 'riew';

function simulateAsync() {
  return new Promise((done, reject) =>
    setTimeout(() => {
      // if (Math.random() >= 0.5) {
      //   done('foo');
      // } else {
      reject(new Error("Sorry, it didn't work"));
      // }
    }, 2000)
  );
}

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
  yield take('idle');
  yield put('fetch');
});
go(function*() {
  yield take('loading');
  try {
    const value = yield simulateAsync();
    yield put('resolve', value);
  } catch (error) {
    yield put('reject', error);
  }
});
go(function*() {
  const value = yield take('success');
  yield put('print', value);
});
go(function*() {
  const value = yield take('print');
  console.log(`value is ${value}`);
});
go(function*() {
  const error = yield take('failure');
  console.log(error);
  yield sleep(1000);
  yield put('retry');
});

const machine = (channel, value) => {
  console.log(`Machine in "${channel}" state`);
  const channels = Object.keys(transitions[channel]);
  stake(
    channels,
    (v, idx) => {
      console.log(`> ${channels[idx]}`);
      machine(transitions[channel][channels[idx]], v);
    },
    { strategy: ONE_OF }
  );
  sput(channel, value);
};

machine('idle');
