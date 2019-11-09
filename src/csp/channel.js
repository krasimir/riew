import { getId } from '../utils';
import FixedBuffer from './buffers/FixedBuffer';
import DroppingBuffer from './buffers/DroppingBuffer';
import ReducerBuffer from './buffers/ReducerBuffer';
import { OPEN, CLOSED, ENDED } from './buffers/states';

export const buffer = {
  fixed: FixedBuffer,
  dropping: DroppingBuffer,
  sliding: size => DroppingBuffer(size, true),
  reducer: ReducerBuffer
};

export function chan(...args) {
  let state = OPEN;
  let [id, buff] = normalizeChannelArguments(args);
  let api = { id };

  function calculateState() {
    if (state === CLOSED && buff.isEmpty()) {
      state = ENDED;
    }
    return state;
  }
  function isAccepting() {
    const s = calculateState();

    return s !== CLOSED && s !== ENDED;
  }

  api.put = item => {
    if (!isAccepting()) {
      return Promise.resolve(state);
    }
    return buff.put(item);
  };
  api.take = () => {
    if (state === ENDED) return Promise.resolve(ENDED);
    if (state === CLOSED && buff.isEmpty()) return Promise.resolve(ENDED);
    return buff.take();
  };
  api.state = calculateState;
  api.close = () => {
    state = CLOSED;
    buff.puts.forEach(put => put(CLOSED));
    // We have a pending take only if the buffer is empty.
    // So, closed buffer with no value => ENDED
    buff.takes.forEach(put => put(ENDED));
  };
  api.open = () => (state = OPEN);
  api.setBuffer = b => (buff = b);

  api.pipe = (...channels) => {
    (function pipe() {
      api.take().then(v => {
        channels.map(ch => ch.put(v));
        if (state === OPEN) {
          pipe();
        }
      });
    })();
    return channels[channels.length - 1];
  };

  api.__value = () => {
    console.warn(
      "Riew: you should not get the channel's value directly! This method is here purely for testing purposes."
    );
    return buff.value;
  };

  return api;
}
chan.merge = function (...channels) {
  const newCh = chan();

  channels.map(ch => {
    (function merge() {
      ch.take().then(v => {
        if (newCh.state() === OPEN) {
          newCh.put(v);
          merge();
        }
      });
    })();
  });

  return newCh;
};
chan.timeout = function (interval) {
  const ch = chan();
  setTimeout(() => ch.close(), interval);
  return ch;
};
chan.OPEN = OPEN;
chan.CLOSED = CLOSED;
chan.ENDED = ENDED;

function normalizeChannelArguments(args) {
  let id, buff;
  if (args.length === 2) {
    id = args[0];
    buff = args[1];
  } else if (args.length === 1 && typeof args[0] === 'string') {
    id = args[0];
    buff = buffer.fixed();
  } else if (args.length === 1 && typeof args[0] === 'object') {
    id = getId('ch');
    buff = args[0];
  } else {
    id = getId('ch');
    buff = buffer.fixed();
  }
  return [id, buff];
}
