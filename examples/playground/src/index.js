import { go, sleep, put, take, sput, sliding } from 'riew';

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

const machine = sliding();

sput(machine, 'idle');

go(function*() {
  const state = yield take(machine);
  const currentState = transitions[state];
  const possibleActions = Object.keys(currentState);
  console.log(`Current state: ${state}`);
  console.log(`  actions: ${possibleActions.join(', ')}`);
  const action = yield take(machine);
  if (possibleActions.includes(action)) {
    const newState = transitions[state][action];
    console.log(`Transition to ${newState}`);
    yield put(machine, newState);
    return go;
  }
  console.log(`Ops! The machine can not react on "${action}" action.`);
});

go(function*() {
  yield sleep(20);
  yield put(machine, 'fetch');
  yield put(machine, 'resolve');
  yield put(machine, 'print');
});
