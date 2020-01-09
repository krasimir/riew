import {
  chan,
  buffer,
  timeout,
  go,
  merge,
  reset,
  put,
  sput,
  take,
  stake,
  sleep,
  stop,
  channelReset,
  CHANNELS,
  read,
  sread,
  call,
  fork,
  ONE_OF,
  register,
} from '../index';
import { delay, Test, exercise } from '../__helpers__';

describe('Given a CSP', () => {
  beforeEach(() => {
    reset();
  });
  describe('when we have a channel', () => {
    it('should allow us to put and take from it', () => {
      const spy = jest.fn();

      stake('X', spy);
      sput('X', 'foo', spy);

      sput('X', 'bar', spy);
      stake('X', spy);

      expect(spy).toBeCalledWithArgs(['foo'], [true], [true], ['bar']);
    });
    it('should allow us to wait a take from multiple channels (SERIAL strategy)', () => {
      const spy = jest.fn();
      const ch1 = chan();
      const ch2 = chan();

      sput(ch1, 'foo');
      stake([ch1, ch2], spy);
      sput(ch2, 'bar');

      expect(spy).toBeCalledWithArgs([['foo', 'bar']]);
    });
    it('should allow us to wait a take from multiple channels (ONE_OF strategy)', () => {
      const spy = jest.fn();
      const ch1 = chan();
      const ch2 = chan();

      stake([ch1, ch2], spy, { strategy: ONE_OF });
      sput(ch2, 'foo');

      expect(spy).toBeCalledWithArgs(['foo', 1]);
    });
  });

  // Routines basics

  describe('and we run a routine', () => {
    it('should put and take from channels', () => {
      const ch = chan();
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
        'pong'
      );
      go(
        function*(what) {
          yield put(ch, what);
          spy(yield take(ch));
          return 'b';
        },
        cleanup2,
        'ping'
      );
      expect(spy).toBeCalledWithArgs(['ping'], ['pong']);
      expect(cleanup1).toBeCalledWithArgs(['a']);
      expect(cleanup2).toBeCalledWithArgs(['b']);
    });
    it('should allow us to take from multiple channels (ALL_REQUIRED)', () => {
      const ch1 = chan();
      const ch2 = chan();
      const spy = jest.fn();

      go(function*() {
        spy(yield take([ch2, ch1]));
      });

      sput(ch1, 'foo');
      sput(ch2, 'bar');

      expect(spy).toBeCalledWithArgs([['bar', 'foo']]);
    });
    it('should allow us to take using the ONE_OF strategy', () => {
      const ch1 = chan();
      const ch2 = chan();
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
        go(function*() {
          const value = yield take('xxx');
          spy(`foo${value}`);
        });
        go(function*() {
          yield sleep(10);
          yield put('xxx', 10);
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
        sread(
          'XXX',
          value => {
            spy(value);
          },
          { listen: true }
        );
        go(function*() {
          yield put('XXX', 'foo');
          yield stop();
          yield put('XXX', 'bar');
        });
        go(function*() {
          yield take('XXX');
          yield take('XXX');
        });
        expect(spy).toBeCalledWithArgs(['foo']);
      });
    });
    describe('and when we return the `go` function', () => {
      it('should re-run the routine', async () => {
        const spy = jest.fn();
        let counter = 0;

        go(function*() {
          const value = yield take('XXX');
          if (value > 10) {
            counter += 1;
          }
          spy(counter);
          return go;
        });
        go(function*() {
          yield put('XXX', 2);
          yield put('XXX', 12);
          yield put('XXX', 22);
          yield put('XXX', 4);
          yield put('XXX', 9);
          yield put('XXX', 39);
        });
        expect(spy).toBeCalledWithArgs([0], [1], [2], [2], [2], [3]);
        expect(counter).toBe(3);
      });
      it('should stop the current routine before running it again', async () => {
        const ch = chan();
        const spy = jest.fn();

        go(function*() {
          spy(yield read(ch));
          return go;
        });

        sput(ch, 'foo');
        sput(ch, 'bar');

        await delay(30);

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

        go(r2, () => spy('done'), 1, 2);

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

        go(r2, () => spy('done'), 1, 2);

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

  // merge

  describe('when we merge channels', () => {
    it('should merge two and more into a single channel', () => {
      const ch1 = chan();
      const ch2 = chan();
      const ch3 = chan();
      const ch4 = merge(ch1, ch2, ch3);

      exercise(
        Test(
          function* A(log) {
            log(`put1=${(yield put(ch1, 'foo')).toString()}`);
            log(`put2=${(yield put(ch2, 'bar')).toString()}`);
            log(`put3=${(yield put(ch3, 'zar')).toString()}`);
            log(`put4=${(yield put(ch4, 'moo')).toString()}`);
          },
          function* B(log) {
            log(`take1=${(yield take(ch4)).toString()}`);
            log(`take2=${(yield take(ch4)).toString()}`);
            log(`take3=${(yield take(ch4)).toString()}`);
            log(`take4=${(yield take(ch4)).toString()}`);
          }
        ),
        [
          '>A',
          'put1=true',
          'put2=true',
          'put3=true',
          '>B',
          'take1=foo',
          'take2=bar',
          'take3=zar',
          'put4=true',
          '<A',
          'take4=moo',
          '<B',
        ]
      );
    });
  });

  // timeout

  describe('when we use the timeout method', () => {
    it('should create a channel that is self closing after X amount of time', () => {
      const ch = timeout(10);

      return exercise(
        Test(
          function* A(log) {
            log(`put1=${(yield put(ch, 'foo')).toString()}`);
            yield sleep(20);
            log(`put2=${(yield put(ch, 'bar')).toString()}`);
          },
          function* B(log) {
            log(`take1=${(yield take(ch)).toString()}`);
            yield sleep(20);
            log(`take2=${(yield take(ch)).toString()}`);
          }
        ),
        [
          '>A',
          '>B',
          'put1=true',
          'take1=foo',
          'put2=Symbol(ENDED)',
          '<A',
          'take2=Symbol(ENDED)',
          '<B',
        ],
        30
      );
    });
  });

  // utils

  describe('when we use the `reset` method', () => {
    it('should put the channel in its initial state', () => {
      const ch = chan(buffer.sliding(2));
      const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      return exercise(
        Test(
          function* A(log) {
            log(`put1=${(yield put(ch, 'foo')).toString()}`);
            log(`value=${ch.value().toString()}`);
            log(`put2=${(yield put(ch, 'bar')).toString()}`);
            log(`value=${ch.value().toString()}`);
            log(`put3=${(yield put(ch, 'zar')).toString()}`);
            log(`value=${ch.value().toString()}`);
            yield sleep(10);
            log(`put4=${(yield put(ch, 'mar')).toString()}`);
            log(`value=${ch.value().toString()}`);
          },
          function* B(log) {
            yield sleep(5);
            channelReset(ch);
            log('reset');
          }
        ),
        [
          '>A',
          'put1=true',
          'value=foo',
          'put2=true',
          'value=foo,bar',
          'put3=true',
          'value=bar,zar',
          '>B',
          'reset',
          '<B',
          'put4=true',
          'value=mar',
          '<A',
        ],
        20,
        () => {
          spy.mockReset();
        }
      );
    });
  });
  describe('when we check if a channel exists', () => {
    it('should return true or false', () => {
      chan('AAA');
      expect(CHANNELS.exists('AAA')).toBe(true);
      expect(CHANNELS.exists('BBB')).toBe(false);
    });
  });
  describe('when we put to multiple channels', () => {
    it('should resolve the put only if all the channels values are consumed', async () => {
      const spy = jest.fn();

      go(function*() {
        yield put(['save', 'saving-done'], ['foo', 'bar']);
        spy('Save successful!');
      });
      go(function*() {
        spy(`xxx=${yield take('save')}`);
        spy('OOO');
        yield sleep(10);
        spy(`yyy=${yield take('saving-done')}`);
      });

      await delay(20);
      expect(spy).toBeCalledWithArgs(
        ['xxx=foo,bar'],
        ['OOO'],
        ['Save successful!'],
        ['yyy=foo,bar']
      );
    });
  });
  describe('when we inject deps into a routine that we run with the `go` function', () => {
    it('should pass the dependency when the routine starts', () => {
      const spy = jest.fn();
      const A = function*(a, b, { config, foo }) {
        spy(a, b, config.theme, foo);
      };
      const B = function*({ answer }) {
        spy(answer);
      };

      register('config', { theme: 'dark' });

      go.with('config', { foo: 'bar' })(A, null, 'a', 'b');
      go.with({ answer: 42 })(B);

      expect(spy).toBeCalledWithArgs(['a', 'b', 'dark', 'bar'], [42]);
    });
  });
});
