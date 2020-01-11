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
  channelReset,
  CHANNELS,
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
    it('should allow us to wait a take from multiple channels (ALL_REQUIRED strategy)', () => {
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

  // hooks

  describe('when adding a before put hook', () => {
    it('should fire the hook before performing the actual put', () => {
      const ch = chan();
      const spy = jest.fn();

      stake(ch, spy);
      ch.beforePut((item, cb) => {
        spy('beforePut');
        cb(item);
      });
      sput(ch, 'foo', v => spy('put', v));

      expect(spy).toBeCalledWithArgs(['beforePut'], ['foo'], ['put', true]);
    });
    describe('and when the before put hook is async', () => {
      it('should delay the put till the hook is completed', async () => {
        const ch = chan();
        const spy = jest.fn();

        stake(ch, spy);
        ch.beforePut((item, cb) => {
          setTimeout(() => {
            spy('beforePut');
            cb(item.toUpperCase());
          }, 10);
        });
        sput(ch, 'foo', v => spy('put', v));

        await delay(20);
        expect(spy).toBeCalledWithArgs(['beforePut'], ['FOO'], ['put', true]);
      });
    });
  });
  describe('when adding an after put hook', () => {
    it('should fire the hook after performing the actual put', () => {
      const ch = chan();
      const spy = jest.fn();

      stake(ch, spy);
      ch.afterPut((item, cb) => {
        spy('afterPut');
        cb(item);
      });
      sput(ch, 'foo', v => spy('put', v));

      expect(spy).toBeCalledWithArgs(['foo'], ['afterPut'], ['put', true]);
    });
    describe('and when the after put hook is async', () => {
      it('should delay the put till the hook is completed', async () => {
        const ch = chan();
        const spy = jest.fn();

        stake(ch, spy);
        ch.afterPut((item, cb) => {
          setTimeout(() => {
            spy('afterPut');
            cb('yo');
          }, 10);
        });
        sput(ch, 'foo', v => spy('put', v));

        await delay(20);
        expect(spy).toBeCalledWithArgs(['foo'], ['afterPut'], ['put', 'yo']);
      });
    });
  });
  describe('when adding a before take hook', () => {
    it('should fire the hook before performing the actual take', () => {
      const ch = chan();
      const spy = jest.fn();

      ch.beforeTake(cb => {
        spy('beforeTake');
        cb();
      });
      stake(ch, spy);
      sput(ch, 'foo', v => spy('put', v));

      expect(spy).toBeCalledWithArgs(['beforeTake'], ['foo'], ['put', true]);
    });
    describe('and when the before take hook is async', () => {
      it('should delay the take till the hook is completed', async () => {
        const ch = chan();
        const spy = jest.fn();

        ch.beforeTake(cb => {
          setTimeout(() => {
            spy('beforeTake');
            cb('yo');
          }, 10);
        });
        stake(ch, spy);
        sput(ch, 'foo', v => spy('put', v));

        await delay(20);
        expect(spy).toBeCalledWithArgs(['beforeTake'], ['put', true], ['foo']);
      });
    });
  });
  describe('when adding an after take hook', () => {
    it('should fire the hook after performing the actual take but before calling the user callback', () => {
      const ch = chan();
      const spy = jest.fn();

      ch.afterTake((item, cb) => {
        spy('afterTake');
        cb(item);
      });
      stake(ch, spy);
      sput(ch, 'foo', v => spy('put', v));

      expect(spy).toBeCalledWithArgs(['afterTake'], ['foo'], ['put', true]);
    });
    describe('and when the after take hook is async', () => {
      it('should delay the take till the hook is completed', async () => {
        const ch = chan();
        const spy = jest.fn();

        ch.afterTake((item, cb) => {
          setTimeout(() => {
            spy('afterTake');
            cb(item.toUpperCase());
          }, 10);
        });
        stake(ch, spy);
        sput(ch, 'foo', v => spy('put', v));

        await delay(20);
        expect(spy).toBeCalledWithArgs(['put', true], ['afterTake'], ['FOO']);
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
