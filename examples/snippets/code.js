import { chan, buffer, sput, sread, go, put } from 'riew';

const ch = chan(buffer.memory());

sread(ch, v => console.log(v), { listen: true });
sput(ch, 'foo', () => console.log('Yeah'));

go(function*() {
  yield put(ch, 'bar');
});
