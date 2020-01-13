import { chan, buffer, sput, sread, take, go, put, riew } from 'riew';

const view = function(props) {
  console.log(props);
};
function* A() {
  const name = yield take('MY_CHANNEL');
  yield put('MY_CHANNEL', `Hey ${name}, how are you?`);
}
function* B({ render }) {
  yield put('MY_CHANNEL', 'Steve');
  render({ message: yield take('MY_CHANNEL') });
}

const r = riew(view, A, B);

r.mount();
