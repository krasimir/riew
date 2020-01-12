import { chan, buffer, sput, sread } from 'riew';

global.__DEV__ = true;

const ch = chan(buffer.memory());

sread(ch, v => console.log(v));
sput(ch, 'foo', () => console.log('Yeah'));
