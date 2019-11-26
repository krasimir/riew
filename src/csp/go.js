import { PUT, TAKE, SLEEP } from './channel';
import chan from './channel';

export default function go(genFunc, args, done) {
  const gen = genFunc(...args);
  const next = value => {
    const iteration = gen.next(value);
    if (iteration.done === true) {
      done();
    } else {
      const { ch, op } = iteration.value;
      const state = ch.state();

      switch (op) {
        case PUT:
          if (state === chan.CLOSED || state === chan.ENDED) {
            next(state);
          } else {
            ch.buff.put(iteration.value.item, result => next(result));
          }
          break;
        case TAKE:
          if (state === chan.ENDED) {
            next(chan.ENDED);
          } else {
            // When we close a channel we do check if the buffer is empty.
            // If it is not then it is safe to take from it.
            // If it is empty the state here will be ENDED, not CLOSED.
            // So there is no way to reach this point with CLOSED state and an empty buffer.
            if (state === chan.CLOSED && ch.buff.isEmpty()) {
              ch.state(chan.ENDED);
              next(chan.ENDED);
            } else {
              ch.buff.take(result => next(result));
            }
          }
          break;
        case SLEEP:
          setTimeout(() => {
            next();
          }, iteration.value.ms);
          break;
        default:
          throw new Error('Unrecognized operation for a routine.');
      }
    }
  };
  next();
}
