import { OPEN, CLOSED, ENDED } from './buffer/states';
import ops from './ops';
import { normalizeChannelArguments } from './utils';
import { grid } from '../index';

export const PUT = 'PUT';
export const TAKE = 'TAKE';

export default function chan(...args) {
  let state = OPEN;
  let [ id, buff ] = normalizeChannelArguments(args);
  let api = { id, '@channel': true };

  ops(api);
  implementIterableProtocol(api);

  api.buff = buff;
  api.state = () => state;
  api.put = item => ({ ch: api, op: 'PUT', item });
  api.putNow = item => {
    if (state === CLOSED || state === ENDED) {
      return state;
    }
    return buff.put(item);
  };
  api.take = () => ({ ch: api, op: 'TAKE' });
  api.takeNow = () => {
    if (state === ENDED) return ENDED;
    // When we close a channel we do check if the buffer is empty.
    // If it is not then it is safe to take from it.
    // If it is empty the state here will be ENDED, not CLOSED.
    // So there is no way to reach this point with CLOSED state and an empty buffer.
    let takeValue = buff.take();
    if (state === CLOSED && buff.isEmpty()) {
      state = ENDED;
      grid.remove(api);
    }
    return takeValue;
  };
  api.close = () => {
    state = buff.isEmpty() ? ENDED : CLOSED;
    buff.puts.forEach(put => put(state));
    // We have a pending take only if the buffer is empty.
    // So, closed buffer with no value => ENDED
    buff.takes.forEach(put => put(ENDED));
    if (state === ENDED) {
      grid.remove(api);
    }
  };
  api.reset = () => {
    state = OPEN;
    buff.reset();
  };
  api.setBuffer = b => (buff = api.buff = b);
  api.__value = () => {
    console.warn("Riew: you should not get the channel's value directly! This method is here purely for testing purposes.");
    return buff.getValue();
  };

  grid.add(api);
  return api;
}
chan.OPEN = OPEN;
chan.CLOSED = CLOSED;
chan.ENDED = ENDED;

// ------------------------------------------------

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
