import { PUT, TAKE } from './channel';
import chan from './channel';

export default function go(genFunc, ...args) {
  const gen = genFunc(...args);
  const routine = {
    type: 'routine',
    next: value => {
      const iteration = gen.next(value);
      if (iteration.done === true) {
        done();
      } else {
        const { ch, item, op } = iteration.value;
        const state = ch.state();

        switch (op) {
          case PUT:
            if (state === chan.CLOSED || state === chan.ENDED) {
              routine.next(state);
            } else {
              ch.buff.put(item, result => routine.next(result));
            }
            break;
          case TAKE:
            if (state === chan.ENDED) {
              routine.next(chan.ENDED);
            } else {
              // When we close a channel we do check if the buffer is empty.
              // If it is not then it is safe to take from it.
              // If it is empty the state here will be ENDED, not CLOSED.
              // So there is no way to reach this point with CLOSED state and an empty buffer.
              if (state === chan.CLOSED && ch.buff.isEmpty()) {
                chan.state(chan.ENDED);
              }
              ch.buff.take(result => routine.next(result));
            }
            break;
          default:
            throw new Error('Unrecognized operation for a routine.');
        }
      }
    }
  };
  let isDone = false;
  let done = () => (isDone = true);

  routine.next();
  return new Promise(resolve => {
    if (isDone) {
      resolve();
    } else {
      done = resolve;
    }
  });
}
