import {
  go,
  reset,
  put,
  sput,
  take,
  sleep,
  stop,
  sread,
  call,
  fork,
  ONE_OF,
  fixed,
} from '../index';
import { delay } from '../__helpers__';

describe('Given a CSP', () => {
  beforeEach(() => {
    reset();
  });

  describe('when we run a routine', () => {
    it('should put and take from channels', () => {
      const ch = fixed();
      const spy = jest.fn();
      const cleanup1 = jest.fn();
      const cleanup2 = jest.fn();

      go(
        function*(what) {
          spy(yield take(ch));
          yield put(ch, what);
          return 'a';
        },
        cleanup1,
        ['pong']
      );
      go(
        function*(what) {
          yield put(ch, what);
          spy(yield take(ch));
          return 'b';
        },
        cleanup2,
        ['ping']
      );
      expect(spy).toBeCalledWithArgs(['ping'], ['pong']);
      expect(cleanup1).toBeCalledWithArgs(['a']);
      expect(cleanup2).toBeCalledWithArgs(['b']);
    });
    it('should allow us to take from multiple channels (ALL_REQUIRED)', () => {
      const ch1 = fixed();
      const ch2 = fixed();
      const spy = jest.fn();

      go(function*() {
        spy(yield take([ch2, ch1]));
      });

      sput(ch1, 'foo');
      sput(ch2, 'bar');

      expect(spy).toBeCalledWithArgs([['bar', 'foo']]);
    });
    it('should allow us to take using the ONE_OF strategy', () => {
      const ch1 = fixed();
      const ch2 = fixed();
      const spy = jest.fn();

      go(function*() {
        spy(yield take([ch2, ch1], { strategy: ONE_OF }));
      });

      sput(ch1, 'foo');

      expect(spy).toBeCalledWithArgs([['foo', 1]]);
    });
    it('should provide an API to stop the routine', async () => {
      const spy = jest.fn();
      const routine = go(function* A() {
        yield sleep(4);
        spy('foo');
      });

      await delay(2);
      routine.stop();
      await delay(4);
      expect(spy).not.toBeCalled();
    });
    it('should provide an API for re-running the routine', async () => {
      const spy = jest.fn();
      const routine = go(function* A() {
        yield sleep(2);
        spy('foo');
      });

      await delay(4);
      routine.rerun();
      await delay(4);
      expect(spy).toBeCalledWithArgs(['foo'], ['foo']);
    });
    describe('and we use channels to control flow', () => {
      it('should work', async () => {
        const spy = jest.fn();
        const ch = fixed();
        go(function*() {
          const value = yield take(ch);
          spy(`foo${value}`);
        });
        go(function*() {
          yield sleep(10);
          yield put(ch, 10);
          spy('done');
        });
        await delay(15);
        expect(spy).toBeCalledWithArgs(['foo10'], ['done']);
      });
    });
    describe('and when we yield a promise', () => {
      it('should continue with the routing after the promise is resolved', async () => {
        const spy = jest.fn();
        go(function*() {
          spy(
            yield new Promise(resolve => setTimeout(() => resolve('bar'), 10))
          );
          return 'foo';
        }, spy);

        await delay(20);
        expect(spy).toBeCalledWithArgs(['bar'], ['foo']);
      });
    });
    describe('and when we yield `stop`', () => {
      it('should stop the routine', async () => {
        const spy = jest.fn();
        const ch = fixed();
        sread(
          ch,
          value => {
            spy(value);
          },
          { listen: true }
        );
        go(function*() {
          yield put(ch, 'foo');
          yield stop();
          yield put(ch, 'bar');
        });
        go(function*() {
          yield take(ch);
          yield take(ch);
        });
        expect(spy).toBeCalledWithArgs(['foo']);
      });
    });
    describe('and when we return the `go` function', () => {
      it('should re-run the routine', async () => {
        const spy = jest.fn();
        let counter = 0;
        const ch = fixed();
        go(function*() {
          const value = yield take(ch);
          if (value > 10) {
            counter += 1;
          }
          spy(counter);
          return go;
        });
        go(function*() {
          yield put(ch, 2);
          yield put(ch, 12);
          yield put(ch, 22);
          yield put(ch, 4);
          yield put(ch, 9);
          yield put(ch, 39);
        });
        expect(spy).toBeCalledWithArgs([0], [1], [2], [2], [2], [3]);
        expect(counter).toBe(3);
      });
      it('should stop the current routine before running it again', () => {
        const ch = fixed();
        const spy = jest.fn();

        go(function*() {
          spy(yield take(ch));
          return go;
        });

        sput(ch, 'foo');
        sput(ch, 'bar');

        expect(spy).toBeCalledWithArgs(['foo'], ['bar']);
      });
    });
    describe('and we yield another routine via `call` method', () => {
      it('should run that other routine and wait till it finishes', async () => {
        const spy = jest.fn();
        const r1 = function*(a, b) {
          yield sleep(5);
          spy(`r1 ${a} ${b}`);
        };
        const r2 = function*(a, b) {
          spy(`>r2 ${a} ${b}`);
          yield call(r1, 'foo', 'bar');
          spy(`<r2 ${a} ${b}`);
        };

        go(r2, () => spy('done'), [1, 2]);

        await delay(10);
        expect(spy).toBeCalledWithArgs(
          ['>r2 1 2'],
          ['r1 foo bar'],
          ['<r2 1 2'],
          ['done']
        );
      });
    });
    describe('and we yield another routine via `fork` method', () => {
      it('should run that other routine and NOT block the main one', async () => {
        const spy = jest.fn();
        const r1 = function*(a, b) {
          yield sleep(5);
          spy(`r1 ${a} ${b}`);
        };
        const r2 = function*(a, b) {
          spy(`>r2 ${a} ${b}`);
          yield fork(r1, 'foo', 'bar');
          spy(`<r2 ${a} ${b}`);
        };

        go(r2, () => spy('done'), [1, 2]);

        await delay(10);
        expect(spy).toBeCalledWithArgs(
          ['>r2 1 2'],
          ['<r2 1 2'],
          ['done'],
          ['r1 foo bar']
        );
      });
    });
    describe('and we have child routines and we stop the main one', () => {
      it('should stop the child routines as well', async () => {
        const spy = jest.fn();
        const c1 = function*() {
          spy('>C1');
          yield sleep(5);
          spy('<C1');
        };
        const c2 = function*() {
          spy('>C2');
          yield sleep(5);
          spy('<C2');
        };
        const R = function*() {
          yield fork(c1);
          yield call(c2);
          yield sleep(10);
        };

        const r = go(R, () => spy('NEVER'));
        r.stop();
        await delay(20);
        expect(spy).toBeCalledWithArgs(['>C1'], ['>C2']);
      });
    });
  });
  describe('when we put to multiple channels', () => {
    it('should resolve the put only if we take from all the channels', () => {
      const spy = jest.fn();
      const channelA = fixed();
      const channelB = fixed();
      go(function*() {
        spy(yield take(channelA));
        spy(yield take(channelB));
      });
      go(function*() {
        spy(yield put([channelA, channelB], 'foo'));
      });

      expect(spy).toBeCalledWithArgs(['foo'], ['foo'], [[true, true]]);
    });
  });
});
