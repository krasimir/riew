import { sub, chan, isChannel, CHANNELS, isStateReadChannel, buffer, isState } from '../../index';
import { sput, stake } from '../ops';

const NOTHING = Symbol('Nothing');

export function compose(channels, to, transform = (...args) => args) {
  to = isChannel(to) ? to : chan(to, buffer.ever());

  const data = channels.map(() => NOTHING);
  let composedAtLeastOnce = false;
  channels.forEach((id, idx) => {
    if (isState(id)) {
      throw new Error(`The second parameter of 'compose' accepts an array of channels. You passed a state (at index ${idx}).`);
    }
    if (!isChannel(id) && !CHANNELS.exists(id)) {
      throw new Error(`Channel doesn't exists. ${ch} passed to compose.`);
    }
    let ch = isChannel(id) ? id : chan(id);
    const doComposition = value => {
      data[ idx ] = value;
      if (composedAtLeastOnce || data.length === 1 || !data.includes(NOTHING)) {
        composedAtLeastOnce = true;
        sput(to, transform(...data));
      }
    };
    sub(ch, doComposition);
    if (isStateReadChannel(ch)) {
      stake(ch, doComposition);
    }
  });
  return to;
}
