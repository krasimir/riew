import { go, sleep, put, take, sread, stake, sput, chan, ONE_OF } from 'riew';

function simulateAsync() {
  return new Promise(done => setTimeout(() => done('foo'), 2000));
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

const machine = channel => {
  stake(
    Object.keys(transitions[channel]),
    value => {
      console.log(value);
    },
    { strategy: ONE_OF }
  );
  sput(channel);
};

machine('idle');
