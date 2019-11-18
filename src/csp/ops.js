import { CLOSED, ENDED, OPEN } from './buffer/states';
import { chan, isChannel } from './index';

export default function ops(ch) {
  let opsTaker = false;
  let pipes = [];

  function taker() {
    if (!opsTaker) {
      opsTaker = true;
      (async function listen() {
        while (true) {
          let v = await ch.take();
          if (v === CLOSED || v === ENDED) {
            break;
          }
          pipes.forEach(p => {
            switch (p.type) {
              case 'pipe':
                if (p.ch.state() === OPEN) {
                  p.ch.put(v);
                }
                break;
              case 'map':
                if (p.ch.state() === OPEN) {
                  p.ch.put(p.func(v));
                }
                break;
              case 'filter':
                if (p.ch.state() === OPEN && p.func(v)) {
                  p.ch.put(v);
                }
                break;
              case 'takeEvery':
                p.func(v);
                break;
              case 'takeLatest':
                if (ch.buff.puts.length === 0) {
                  p.func(v);
                }
                break;
            }
          });
        }
      })();
    }
  }

  ch.pipe = (...channels) => {
    channels.forEach(channel => {
      if (!pipes.find(({ ch }) => ch === channel)) {
        pipes.push({ type: 'pipe', ch: channel });
      }
    });
    taker();
    return ch;
  };

  ch.map = func => {
    const newCh = chan();
    pipes.push({ ch: newCh, func, type: 'map' });
    taker();
    return newCh;
  };

  ch.filter = func => {
    const newCh = chan();
    pipes.push({ ch: newCh, func, type: 'filter' });
    taker();
    return newCh;
  };

  ch.from = value => {
    if (isChannel(value)) {
      value.pipe(ch);
    } else if (typeof value !== 'undefined') {
      ch.buff.setValue(value);
    }
    return ch;
  };

  ch.takeEvery = func => {
    pipes.push({ func, type: 'takeEvery' });
    taker();
    return ch;
  };

  ch.takeLatest = func => {
    pipes.push({ func, type: 'takeLatest' });
    taker();
    return ch;
  };
}
