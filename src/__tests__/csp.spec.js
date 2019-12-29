import {
  chan,
  buffer,
  timeout,
  go,
  merge,
  unreadAll,
  reset,
  put,
  sput,
  take,
  stake,
  sleep,
  close,
  state,
  stop,
  channelReset,
  CHANNELS,
  read,
  sread,
  unread,
  call,
  fork,
  ONE_OF,
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
      it('should stop the current routine before running it again', () => {
        const ch = chan();
        const spy = jest.fn();

        go(function*() {
          spy(yield read(ch));
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

  // CSP States

  describe('and we have an the channel OPEN', () => {
    it(`should
      * allow writing and reading
      * should block the put until take
      * should block the take until put`, () => {
      const ch = chan();

      exercise(
        Test(
          function* A(log) {
            yield put(ch, 'foo');
            log('put successful');
          },
          function* B(log) {
            log(`take=${yield take(ch)}`);
          }
        ),
        ['>A', '>B', 'put successful', '<A', 'take=foo', '<B']
      );
    });
  });
  describe('and we put without waiting', () => {
    it('should end the first routine and allow consuming from the channel in the second', () => {
      const ch = chan();

      exercise(
        Test(
          function* A() {
            sput(ch, 'foo');
            sput(ch, 'bar');
            sput(ch, 'zar');
          },
          function* B(log) {
            log(`take1=${yield take(ch)}`);
            log(`take2=${yield take(ch)}`);
            log(`take3=${yield take(ch)}`);
          }
        ),
        ['>A', '<A', '>B', 'take1=foo', 'take2=bar', 'take3=zar', '<B']
      );
    });
  });
  describe('and we close a non-buffered channel', () => {
    it(`should
      - resolve the pending puts with ENDED
      - resolve the future puts with ENDED
      - allow takes if the buffer is not empty
      - resolve the future takes with ENDED`, () => {
      const ch = chan();

      exercise(
        Test(
          function* A(log) {
            log(`p1=${(yield put(ch, 'foo')).toString()}`);
            log(`p2=${(yield put(ch, 'bar')).toString()}`);
            log(`p3=${(yield put(ch, 'zar')).toString()}`);
          },
          function* B(log) {
            log(`take1=${(yield take(ch)).toString()}`);
            close(ch);
            log(`take2=${(yield take(ch)).toString()}`);
            log(`take3=${(yield take(ch)).toString()}`);
          }
        ),
        [
          '>A',
          '>B',
          'p1=true',
          'take1=foo',
          'p2=Symbol(ENDED)',
          'p3=Symbol(ENDED)',
          '<A',
          'take2=Symbol(ENDED)',
          'take3=Symbol(ENDED)',
          '<B',
        ]
      );
    });
    it('should resolve the pending takes with ENDED', () => {
      const ch = chan();

      exercise(
        Test(
          function* A(log) {
            log(`take1=${(yield take(ch)).toString()}`);
          },
          function* B() {
            close(ch);
          }
        ),
        ['>A', '>B', 'take1=Symbol(ENDED)', '<A', '<B']
      );
    });
  });
  describe('and we close a buffered channel', () => {
    it(`should
      - resolve the pending puts with CLOSED
      - resolve the future puts with CLOSED if the buffer is not empty
      - resolve the future puts with ENDED if the buffer is empty
      - allow takes if the buffer is not empty
      - resolve the future takes with ENDED`, () => {
      const ch = chan(buffer.fixed(1));

      return exercise(
        Test(
          function* A(log) {
            log(`p1=${(yield put(ch, 'foo')).toString()}`);
            log(`p2=${(yield put(ch, 'bar')).toString()}`);
            close(ch);
            log(`p3=${(yield put(ch, 'zar')).toString()}`);
            yield sleep(2);
            log(`p4=${(yield put(ch, 'moo')).toString()}`);
          },
          function* B(log) {
            log(`take1=${(yield take(ch)).toString()}`);
            yield sleep(4);
            log(`take2=${(yield take(ch)).toString()}`);
            log(`take3=${(yield take(ch)).toString()}`);
          }
        ),
        [
          '>A',
          'p1=true',
          '>B',
          'p2=true',
          'p3=Symbol(CLOSED)',
          'take1=foo',
          'p4=Symbol(CLOSED)',
          '<A',
          'take2=bar',
          'take3=Symbol(ENDED)',
          '<B',
        ],
        10
      );
    });
    it('should resolve the pending takes with ENDED', () => {
      const ch = chan();

      exercise(
        Test(
          function* A(log) {
            log(`take1=${(yield take(ch)).toString()}`);
          },
          function* B() {
            close(ch);
          }
        ),
        ['>A', '>B', 'take1=Symbol(ENDED)', '<A', '<B']
      );
    });
  });

  // Types of buffers

  describe('when we create a channel with the default buffer (fixed buffer with size 0)', () => {
    it('allow writing and reading', () => {
      const ch = chan();

      put(ch, 'foo');
      take(ch, v => expect(v).toEqual('foo'));
    });
    it('should block the channel if there is no puts but we want to take', () => {
      const ch = chan();

      exercise(
        Test(
          function* A(log) {
            log(`take1=${(yield take(ch)).toString()}`);
            log(`take2=${(yield take(ch)).toString()}`);
          },
          function* B(log) {
            log(`put1=${(yield put(ch, 'foo')).toString()}`);
            log(`put2=${(yield put(ch, 'bar')).toString()}`);
          }
        ),
        [
          '>A',
          '>B',
          'take1=foo',
          'put1=true',
          'take2=bar',
          '<A',
          'put2=true',
          '<B',
        ]
      );
    });
    it('should block the channel if there is no takers but we want to put', () => {
      const ch = chan();

      exercise(
        Test(
          function* A(log) {
            log(`put1=${(yield put(ch, 'foo')).toString()}`);
            log(`put2=${(yield put(ch, 'bar')).toString()}`);
          },
          function* B(log) {
            log(`take1=${(yield take(ch)).toString()}`);
            log(`take2=${(yield take(ch)).toString()}`);
          }
        ),
        [
          '>A',
          '>B',
          'put1=true',
          'take1=foo',
          'put2=true',
          '<A',
          'take2=bar',
          '<B',
        ]
      );
    });
  });
  describe('when we create a channel with a fixed buffer with size > 0', () => {
    it('should allow as many puts as we have space', () => {
      const ch = chan(buffer.fixed(2));
      const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      return exercise(
        Test(
          function* A(log) {
            log(`value1=${ch.value().toString()}`);
            log(`put1=${(yield put(ch, 'foo')).toString()}`);
            log(`value2=${ch.value().toString()}`);
            log(`put2=${(yield put(ch, 'bar')).toString()}`);
            log(`value3=${ch.value().toString()}`);
            log(`put3=${(yield put(ch, 'zar')).toString()}`);
            log(`value4=${ch.value().toString()}`);
            log(`put4=${(yield put(ch, 'mar')).toString()}`);
            log(`value5=${ch.value().toString()}`);
          },
          function* B(log) {
            yield sleep(5);
            log('end of waiting');
            log(`take1=${(yield take(ch)).toString()}`);
            log(`take2=${(yield take(ch)).toString()}`);
            log(`take3=${(yield take(ch)).toString()}`);
            log(`take4=${(yield take(ch)).toString()}`);
          }
        ),
        [
          '>A',
          'value1=',
          'put1=true',
          'value2=foo',
          'put2=true',
          'value3=foo,bar',
          '>B',
          'end of waiting',
          'put3=true',
          'value4=bar,zar',
          'take1=foo',
          'put4=true',
          'value5=zar,mar',
          '<A',
          'take2=bar',
          'take3=zar',
          'take4=mar',
          '<B',
        ],
        10,
        () => {
          spy.mockRestore();
        }
      );
    });
  });
  describe('when we create a channel with a dropping buffer', () => {
    describe("and the buffer's size is 0", () => {
      it("shouldn't block the puts but only the takes", () => {
        const ch = chan(buffer.dropping());
        const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        return exercise(
          Test(
            function* A(log) {
              log(`value=${ch.value().toString()}`);
              log(`put1=${(yield put(ch, 'foo')).toString()}`);
              log(`value=${ch.value().toString()}`);
              log(`put2=${(yield put(ch, 'bar')).toString()}`);
              log(`value=${ch.value().toString()}`);
              log(`put3=${(yield put(ch, 'zar')).toString()}`);
              log(`value=${ch.value().toString()}`);
              yield sleep(10);
              log(`put4=${(yield put(ch, 'final')).toString()}`);
              log(`value=${ch.value().toString()}`);
            },
            function* B(log) {
              yield sleep(5);
              log('---');
              log(`take1=${(yield take(ch)).toString()}`);
              log(`take2=${(yield take(ch)).toString()}`);
            }
          ),
          [
            '>A',
            'value=',
            'put1=true',
            'value=foo',
            'put2=false',
            'value=foo',
            'put3=false',
            'value=foo',
            '>B',
            '---',
            'take1=foo',
            'take2=final',
            '<B',
            'put4=true',
            'value=',
            '<A',
          ],
          15,
          () => {
            spy.mockRestore();
          }
        );
      });
    });
    describe("and the buffer's size is > 0", () => {
      it("shouldn't block and it should buffer more values", () => {
        const ch = chan(buffer.dropping(2));
        const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        return exercise(
          Test(
            function* A(log) {
              log(`value=${ch.value().toString()}`);
              log(`put1=${(yield put(ch, 'foo')).toString()}`);
              log(`value=${ch.value().toString()}`);
              log(`put2=${(yield put(ch, 'bar')).toString()}`);
              log(`value=${ch.value().toString()}`);
              log(`put3=${(yield put(ch, 'zar')).toString()}`);
              log(`value=${ch.value().toString()}`);
              yield sleep(10);
              log(`put4=${(yield put(ch, 'final')).toString()}`);
              log(`value=${ch.value().toString()}`);
            },
            function* B(log) {
              yield sleep(5);
              log('---');
              log(`take1=${(yield take(ch)).toString()}`);
              log(`take2=${(yield take(ch)).toString()}`);
              log(`take3=${(yield take(ch)).toString()}`);
            }
          ),
          [
            '>A',
            'value=',
            'put1=true',
            'value=foo',
            'put2=true',
            'value=foo,bar',
            'put3=false',
            'value=foo,bar',
            '>B',
            '---',
            'take1=foo',
            'take2=bar',
            'take3=final',
            '<B',
            'put4=true',
            'value=',
            '<A',
          ],
          15,
          () => {
            spy.mockRestore();
          }
        );
      });
    });
    describe('and we have a pre-set value', () => {
      it('should allow a non-blocking take', () => {
        const ch = chan(buffer.dropping(2));
        sput(ch, 'a');
        sput(ch, 'b');
        const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        exercise(
          Test(function* A(log) {
            log(`take1=${(yield take(ch)).toString()}`);
            log(`take2=${(yield take(ch)).toString()}`);
          }),
          ['>A', 'take1=a', 'take2=b', '<A']
        );
        spy.mockRestore();
      });
    });
  });
  describe('when we create a channel with a sliding buffer', () => {
    describe("and the buffer's size is 0", () => {
      it("shouldn't block but keep the latest pushed value", () => {
        const ch = chan(buffer.sliding());
        const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        return exercise(
          Test(
            function* A(log) {
              log(`value=${ch.value().toString()}`);
              log(`put1=${(yield put(ch, 'foo')).toString()}`);
              log(`value=${ch.value().toString()}`);
              log(`put2=${(yield put(ch, 'bar')).toString()}`);
              log(`value=${ch.value().toString()}`);
              log(`put3=${(yield put(ch, 'zar')).toString()}`);
              log(`value=${ch.value().toString()}`);
              yield sleep(10);
              log(`put4=${(yield put(ch, 'final')).toString()}`);
              log(`value=${ch.value().toString()}`);
            },
            function* B(log) {
              yield sleep(5);
              log('---');
              log(`take1=${(yield take(ch)).toString()}`);
              log(`take2=${(yield take(ch)).toString()}`);
            }
          ),
          [
            '>A',
            'value=',
            'put1=true',
            'value=foo',
            'put2=true',
            'value=bar',
            'put3=true',
            'value=zar',
            '>B',
            '---',
            'take1=zar',
            'take2=final',
            '<B',
            'put4=true',
            'value=',
            '<A',
          ],
          15,
          () => {
            spy.mockRestore();
          }
        );
      });
    });
    describe("and the buffer's size is > 0", () => {
      it("shouldn't block but drop values from the other side", () => {
        const ch = chan(buffer.sliding(2));
        const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        return exercise(
          Test(
            function* A(log) {
              log(`value=${ch.value().toString()}`);
              log(`put1=${(yield put(ch, 'foo')).toString()}`);
              log(`value=${ch.value().toString()}`);
              log(`put2=${(yield put(ch, 'bar')).toString()}`);
              log(`value=${ch.value().toString()}`);
              log(`put3=${(yield put(ch, 'zar')).toString()}`);
              log(`value=${ch.value().toString()}`);
              yield sleep(10);
              log(`put4=${(yield put(ch, 'final')).toString()}`);
              log(`value=${ch.value().toString()}`);
            },
            function* B(log) {
              yield sleep(5);
              log('---');
              log(`take1=${(yield take(ch)).toString()}`);
              log(`take2=${(yield take(ch)).toString()}`);
            }
          ),
          [
            '>A',
            'value=',
            'put1=true',
            'value=foo',
            'put2=true',
            'value=foo,bar',
            'put3=true',
            'value=bar,zar',
            '>B',
            '---',
            'take1=bar',
            'take2=zar',
            '<B',
            'put4=true',
            'value=final',
            '<A',
          ],
          15,
          () => {
            spy.mockRestore();
          }
        );
      });
    });
  });
  describe('when we create a channel with divorced buffer', () => {
    it(`should
      * have non-blocking puts
      * have non-blocking takes
      * resolve the puts with the latest put value`, () => {
      const ch = chan(buffer.divorced());
      const takeSpy = jest.fn();
      const putSpy = jest.fn();

      go(function*() {
        takeSpy(yield take(ch));
        putSpy(yield put(ch, 'foo'));
        takeSpy(yield take(ch));
        putSpy(yield put(ch, 'bar'));
        takeSpy(yield take(ch));
      });

      expect(takeSpy).toBeCalledWithArgs([undefined], ['foo'], ['bar']);
      expect(putSpy).toBeCalledWithArgs([true], [true]);
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

  // pubsub

  describe('when piping', () => {
    it('sub from one channel and pass it to another', () => {
      const c1 = chan();
      const c2 = chan();
      const spy = jest.fn();

      sread(c1, c2, { listen: true });

      go(function*() {
        spy(`put1=${yield put(c1, 'foo')}`);
        spy(`put2=${yield put(c1, 'bar')}`);
      });
      go(function*() {
        spy(`take1=${yield take(c2)}`);
        spy(`take2=${yield take(c2)}`);
      });
      sput(c1, 'baz');

      expect(spy).toBeCalledWithArgs(['take1=foo'], ['take2=baz']);
    });
  });
  describe('when composing two channels', () => {
    it(`should
      * aggregate value
      * put to the 'to' channel only if all the source channels receive data`, () => {
      const c1 = chan();
      const c2 = chan();
      const c3 = chan();
      const spy = jest.fn();

      sread([c1, c2], c3, { listen: true });
      sread(c3, spy, { listen: true });
      sput(c1, 'foo');
      sput(c2, 'bar');
      sput(c1, 'baz');

      expect(spy).toBeCalledWithArgs([['foo', 'bar']], [['baz', 'bar']]);
    });
    it('should use the transform function', () => {
      const c1 = chan();
      const c2 = chan();
      const c3 = chan();
      const spy = jest.fn();

      sread([c1, c2], c3, {
        transform: (a, b) => a.toUpperCase() + b.toUpperCase(),
        listen: true,
      });
      sread(c3, spy, { listen: true });
      sput(c1, 'foo');
      sput(c2, 'bar');
      sput(c1, 'baz');

      expect(spy).toBeCalledWithArgs(['FOOBAR'], ['BAZBAR']);
    });
    describe('and when we use state', () => {
      it('should aggregate state values', () => {
        const users = state([
          { name: 'Joe' },
          { name: 'Steve' },
          { name: 'Rebeka' },
        ]);
        const currentUser = state(1);
        const spy = jest.fn();

        sread('app', spy, { listen: true });
        sread([users, currentUser], chan('app'), {
          transform: (us, currentUserIndex) => us[currentUserIndex].name,
        });

        sput(currentUser, 2);

        expect(spy).toBeCalledWithArgs(['Steve'], ['Rebeka']);
      });
    });
    describe('when we use state together with a routine', () => {
      it('should work just fine', () => {
        const users = state([
          { name: 'Joe' },
          { name: 'Steve' },
          { name: 'Rebeka' },
        ]);
        const currentUser = state(1);
        const spy = jest.fn();

        sread([users, currentUser], chan('app'), {
          transform: (us, currentUserIndex) => us[currentUserIndex].name,
        });

        go(function*() {
          spy(yield take('app'));
          spy(yield take('app'));
        });
        go(function*() {
          spy(yield put(currentUser, 2));
        });

        expect(spy).toBeCalledWithArgs(['Steve'], ['Rebeka'], [true]);
      });
    });
    describe('when we use sub by passing a string for a channel', () => {
      it('should create a channel with a DivorceBuffer', () => {
        const users = state([
          { name: 'Joe' },
          { name: 'Steve' },
          { name: 'Rebeka' },
        ]);
        const currentUser = state(1);
        const spy = jest.fn();

        users.mutate('WWW', arr =>
          arr.map((user, i) => {
            if (i === 2) return { name: 'Batman' };
            return user;
          })
        );

        sread([users, currentUser], 'app', {
          transform: (us, currentUserIndex) => us[currentUserIndex].name,
          listen: true,
        });

        go(function*() {
          spy(yield take('app'));
          spy(yield take('app'));
          spy(yield put(currentUser, 2));
          spy(yield take('app'));
          spy(yield put('WWW'));
          spy(yield take('app'));
        });

        expect(spy).toBeCalledWithArgs(
          ['Steve'],
          ['Steve'],
          [true],
          ['Rebeka'],
          [true],
          ['Batman']
        );
      });
    });
  });
  describe('when we pipe to other channels', () => {
    it('should distribute a single value to multiple channels', () => {
      const ch1 = chan();
      const ch2 = chan();
      const ch3 = chan();

      sread(ch1, ch2, { listen: true });
      sread(ch2, ch3, { listen: true });

      exercise(
        Test(
          function* A(log) {
            stake(ch2, v => log(`take_ch2=${v}`));
            stake(ch3, v => log(`take_ch3=${v}`));
            stake(ch3, v => log(`take_ch3=${v}`));
          },
          function* B() {
            sput(ch1, 'foo');
            sput(ch1, 'bar');
          }
        ),
        ['>A', '<A', '>B', 'take_ch3=foo', 'take_ch2=foo', 'take_ch3=bar', '<B']
      );
    });
    it('should support nested piping', () => {
      const ch1 = chan('ch1');
      const ch2 = chan('ch2');
      const ch3 = chan('ch3');
      const ch4 = chan('ch4');

      sread(ch1, ch2, { listen: true });
      sread(ch1, ch3, { listen: true });
      sread(ch2, ch4, { listen: true });

      exercise(
        Test(
          function* A() {
            yield put(ch1, 'foo');
          },
          function* B(log) {
            stake(ch1, v => log(`take_ch1=${v}`));
            stake(ch2, v => log(`take_ch2=${v}`));
            stake(ch3, v => log(`take_ch3=${v}`));
            stake(ch4, v => log(`take_ch4=${v}`));
          }
        ),
        [
          '>A',
          '>B',
          '<A',
          'take_ch1=foo',
          'take_ch2=foo',
          'take_ch3=foo',
          'take_ch4=foo',
          '<B',
        ]
      );
    });
    describe('and we tap multiple times to the same channel', () => {
      it('should register the channel only once', () => {
        const ch1 = chan('ch1');
        const ch2 = chan('ch2');
        const ch3 = chan('ch3');

        sread(ch1, ch2, { listen: true });
        sread(ch1, ch2, { listen: true });
        sread(ch1, ch2, { listen: true });
        sread(ch1, ch3, { listen: true });

        exercise(
          Test(
            function* A() {
              sput(ch1, 'foo');
              sput(ch1, 'bar');
            },
            function* B(log) {
              stake(ch2, v => log(`ch2_1=${v}`));
              stake(ch2, v => log(`ch2_2=${v}`));
              stake(ch3, v => log(`ch3_2=${v}`));
              stake(ch3, v => log(`ch3_1=${v}`));
            }
          ),
          [
            '>A',
            '<A',
            '>B',
            'ch2_1=foo',
            'ch2_2=bar',
            'ch3_2=foo',
            'ch3_1=bar',
            '<B',
          ]
        );
      });
    });
    it('should properly handle the situation when a tapped channel is not open anymore', () => {
      const ch1 = chan();
      const ch2 = chan();
      const ch3 = chan();

      sread(ch1, ch2, { listen: true });
      sread(ch1, ch3, { listen: true });

      exercise(
        Test(
          function* A(log) {
            stake(ch2, v => log(`take_ch2=${v}`));
            stake(ch2, v => log(`take_ch2=${v}`));
            stake(ch2, v => log(`take_ch2=${v}`));
            stake(ch3, v => {
              log(`take_ch3=${v}`);
              close(ch3);
            });
            stake(ch3, v => log(`take_ch3=${v.toString()}`));
            stake(ch3, v => log(`take_ch3=${v.toString()}`));
          },
          function* B() {
            sput(ch1, 'foo');
            sput(ch1, 'bar');
            sput(ch1, 'zar');
          }
        ),
        [
          '>A',
          '<A',
          '>B',
          'take_ch2=foo',
          'take_ch3=foo',
          'take_ch3=Symbol(ENDED)',
          'take_ch3=Symbol(ENDED)',
          'take_ch2=bar',
          'take_ch2=zar',
          '<B',
        ]
      );
    });
    it('should allow us to unsubscribe', () => {
      const ch1 = chan();
      const ch2 = chan();
      const ch3 = chan();

      sread(ch1, ch2, { listen: true });
      sread(ch1, ch3, { listen: true });

      exercise(
        Test(
          function* A(log) {
            stake(ch2, v => log(`take_ch2=${v}`));
            stake(ch2, v => log(`take_ch2=${v}`));
            stake(ch2, v => log(`take_ch2=${v}`));
            stake(ch3, v => {
              log(`take_ch3=${v}`);
              unread(ch1, ch3);
            });
            stake(ch3, v => log(`take_ch3=${v.toString()}`));
          },
          function* B() {
            sput(ch1, 'foo');
            sput(ch1, 'bar');
            sput(ch1, 'zar');
          }
        ),
        [
          '>A',
          '<A',
          '>B',
          'take_ch2=foo',
          'take_ch3=foo',
          'take_ch2=bar',
          'take_ch2=zar',
          '<B',
        ]
      );
    });
    it('should allow us to unsubscribe all', () => {
      const ch1 = chan();
      const ch2 = chan();
      const ch3 = chan();

      sread(ch1, ch2, { listen: true });
      sread(ch1, ch3, { listen: true });

      exercise(
        Test(
          function* A(log) {
            stake(ch2, v => log(`take_ch2=${v}`));
            stake(ch2, v => log(`take_ch2=${v}`));
            stake(ch2, v => log(`take_ch2=${v}`));
            stake(ch3, v => {
              log(`take_ch3=${v}`);
              unreadAll(ch1);
            });
            stake(ch3, v => log(`take_ch3=${v.toString()}`));
          },
          function* B() {
            sput(ch1, 'foo');
            sput(ch1, 'bar');
            sput(ch1, 'zar');
          }
        ),
        ['>A', '<A', '>B', 'take_ch2=foo', 'take_ch3=foo', '<B']
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
        ['xxx=foo'],
        ['OOO'],
        ['Save successful!'],
        ['yyy=bar']
      );
    });
  });
});
