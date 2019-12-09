import { chan, put, take, state } from '../index';
import { delay, Test, exercise } from '../__helpers__';

describe('Given a CSP state extension', () => {
  describe('when we want to have a state management', () => {
    fit(`should
      * allow us to keep a state
      * allow us to read and write`, () => {
      const spy = jest.fn();
      const s = state(10);
      const increment = s.set((current, incrementWith) => {
        return current + (incrementWith || 1);
      });
      const read = s.map(value => `value: ${value}`);
      const moreThen = s.filter(value => value > 14);

      read.take(spy);
      read.subscribe(spy);
      moreThen.subscribe(spy);

      expect(s.getState()).toBe(10);

      increment.put();
      increment.put(4);
      increment.put();

      expect(s.getState()).toBe(16);
      expect(spy).toBeCalledWithArgs([ 'value: 10' ], [ 'value: 11' ], [ 'value: 15' ], [ 15 ], [ 'value: 16' ], [ 16 ]);
    });
    xit('should NOT do the initial put if there is no initial state', () => {
      const s = state();
      const read = s.map();
      const update = s.set();
      const spy = jest.fn();

      read.subscribe(spy);
      update.put(42);

      expect(spy).toBeCalledWithArgs([ 42 ]);
    });
    xit('should allow us to use async setter', async () => {
      const s = state();
      const read = s.map();
      const update = s.set(async (_, newValue) => {
        await delay(5);
        return newValue + 100;
      });

      return exercise(
        Test(
          function * A(log) {
            log(`take=${yield take(read)}`);
          },
          function * B() {
            yield put(update, 42);
          }
        ),
        [ '>A', '>B', '<B', 'take=142', '<A' ],
        10
      );
    });
    xit('should allow us destroy the state and its channels', () => {
      const s = state(20);
      const read = s.map();
      const update = s.set();
      const spy = jest.fn();

      read.subscribe(spy);
      update.put(30);
      s.destroy();
      update.put(40);

      expect(spy).toBeCalledWithArgs([ 20 ], [ 30 ]);
      expect(read.state()).toBe(chan.ENDED);
      expect(update.state()).toBe(chan.ENDED);
    });
    xit('should allow us destruct the state and receive map and set channels', () => {
      const [ read, write ] = state(20);
      const spy = jest.fn();

      read.subscribe(spy);
      write.put(30);

      expect(spy).toBeCalledWithArgs([ 20 ], [ 30 ]);
    });
  });
});
