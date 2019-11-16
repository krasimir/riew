import { OPEN, CLOSED, ENDED } from './buffer/states';
import { defineOps } from './ops';
import { normalizeChannelArguments } from './utils';
import { grid } from '../index';

export function chan(...args) {
  let state = OPEN;
  let [ id, buff ] = normalizeChannelArguments(args);
  let api = { id, '@channel': true };

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

  defineOps(api);
  implementIterableProtocol(api);

  api.buff = buff;
  api.state = calculateState;
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
  api.close = () => {
    state = CLOSED;
    buff.puts.forEach(put => put(CLOSED));
    // We have a pending take only if the buffer is empty.
    // So, closed buffer with no value => ENDED
    buff.takes.forEach(put => put(ENDED));
  };
  api.open = () => (state = OPEN);
  api.reset = () => {
    state = OPEN;
    buff.reset();
  };
  api.setBuffer = b => (buff = api.buff = b);
  api.__value = () => {
    console.warn("Riew: you should not get the channel's value directly! This method is here purely for testing purposes.");
    return buff.value;
  };

  grid.add(api);
  return api;
}
chan.timeout = function (interval) {
  const ch = chan();
  setTimeout(() => ch.close(), interval);
  return ch;
};
chan.OPEN = OPEN;
chan.CLOSED = CLOSED;
chan.ENDED = ENDED;

// ------------------------------------------------

export function merge(...channels) {
  const newCh = chan();

  channels.map(ch => {
    (async function listen() {
      let v;
      while (v !== CLOSED && v !== ENDED && newCh.state() === OPEN) {
        v = await ch.take();
        newCh.put(v);
      }
    })();
  });

  return newCh;
}

export function isChannel(ch) {
  return ch && ch[ '@channel' ] === true;
}

export function isChannelPut(func) {
  return func && func[ '@channel_put' ] === true;
}

export function isChannelTake(func) {
  return func && func[ '@channel_take' ] === true;
}

function implementIterableProtocol(ch) {
  if (typeof Symbol !== 'undefined' && typeof Symbol.iterator !== 'undefined') {
    ch[ Symbol.iterator ] = function () {
      const take = (...args) => ch.take(...args);
      const put = (...args) => ch.put(...args);
      const values = [ take, put ];
      let i = 0;

      take[ '@channel_take' ] = true;
      put[ '@channel_put' ] = true;
      take.ch = put.ch = ch;

      return {
        next: () => ({
          value: values[ i++ ],
          done: i > values.length
        })
      };
    };
  }
}
