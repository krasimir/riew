import {
  chan,
  buffer,
  timeout,
  go,
  merge,
  mult,
  unmult,
  unmultAll,
  reset,
  put,
  sput,
  take,
  stake,
  sleep,
  close,
  compose,
  state,
  channelReset,
  CHANNELS,
  sub
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

      expect(spy).toBeCalledWithArgs([ 'foo' ], [ true ], [ true ], [ 'bar' ]);
    });
  });

  // Routines basics

  describe('and we run a routine', () => {
    describe('which is a generator', () => {
      it('should put and take from channels', () => {
        const ch = chan();
        const spy = jest.fn();
        const cleanup1 = jest.fn();
        const cleanup2 = jest.fn();

        go(
          function * (what) {
            spy(yield take(ch));
            yield put(ch, what);
            return 'a';
          },
          cleanup1,
          'pong'
        );
        go(
          function * (what) {
            yield put(ch, what);
            spy(yield take(ch));
            return 'b';
          },
          cleanup2,
          'ping'
        );
        expect(spy).toBeCalledWithArgs([ 'ping' ], [ 'pong' ]);
        expect(cleanup1).toBeCalledWithArgs([ 'a' ]);
        expect(cleanup2).toBeCalledWithArgs([ 'b' ]);
      });
    });
    it('should provide an API to stop the routine', async () => {
      const spy = jest.fn();
      const routine = go(function * A() {
        yield sleep(4);
        spy('foo');
      });

      await delay(2);
      routine.stop();
      await delay(4);
      expect(spy).not.toBeCalled();
    });
    describe('and we use channels to control flow', () => {
      it('should work', async () => {
        const spy = jest.fn();
        go(function * () {
          const value = yield take('xxx');
          spy('foo' + value);
        });
        go(function * () {
          yield sleep(10);
          yield put('xxx', 10);
          spy('done');
        });
        await delay(15);
        expect(spy).toBeCalledWithArgs([ 'foo10' ], [ 'done' ]);
      });
    });
    describe('when we yield a promise', () => {
      it('should continue with the routing after the promise is resolved', async () => {
        const spy = jest.fn();
        go(function * () {
          spy(yield new Promise(resolve => setTimeout(() => resolve('bar'), 10)));
          return 'foo';
        }, spy);

        await delay(20);
        expect(spy).toBeCalledWithArgs([ 'bar' ], [ 'foo' ]);
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
          function * A(log) {
            yield put(ch, 'foo');
            log('put successful');
          },
          function * B(log) {
            log(`take=${yield take(ch)}`);
          }
        ),
        [ '>A', '>B', 'put successful', '<A', 'take=foo', '<B' ]
      );
    });
  });
  describe('and we put without waiting', () => {
    it('should end the first routine and allow consuming from the channel in the second', () => {
      const ch = chan();

      exercise(
        Test(
          function * A() {
            sput(ch, 'foo');
            sput(ch, 'bar');
            sput(ch, 'zar');
          },
          function * B(log) {
            log(`take1=${yield take(ch)}`);
            log(`take2=${yield take(ch)}`);
            log(`take3=${yield take(ch)}`);
          }
        ),
        [ '>A', '<A', '>B', 'take1=foo', 'take2=bar', 'take3=zar', '<B' ]
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
          function * A(log) {
            log(`p1=${(yield put(ch, 'foo')).toString()}`);
            log(`p2=${(yield put(ch, 'bar')).toString()}`);
            log(`p3=${(yield put(ch, 'zar')).toString()}`);
          },
          function * B(log) {
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
          '<B'
        ]
      );
    });
    it('should resolve the pending takes with ENDED', () => {
      const ch = chan();

      exercise(
        Test(
          function * A(log) {
            log(`take1=${(yield take(ch)).toString()}`);
          },
          function * B() {
            close(ch);
          }
        ),
        [ '>A', '>B', 'take1=Symbol(ENDED)', '<A', '<B' ]
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
          function * A(log) {
            log(`p1=${(yield put(ch, 'foo')).toString()}`);
            log(`p2=${(yield put(ch, 'bar')).toString()}`);
            close(ch);
            log(`p3=${(yield put(ch, 'zar')).toString()}`);
            yield sleep(2);
            log(`p4=${(yield put(ch, 'moo')).toString()}`);
          },
          function * B(log) {
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
          '<B'
        ],
        10
      );
    });
    it('should resolve the pending takes with ENDED', () => {
      const ch = chan();

      exercise(
        Test(
          function * A(log) {
            log(`take1=${(yield take(ch)).toString()}`);
          },
          function * B() {
            close(ch);
          }
        ),
        [ '>A', '>B', 'take1=Symbol(ENDED)', '<A', '<B' ]
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
          function * A(log) {
            log(`take1=${(yield take(ch)).toString()}`);
            log(`take2=${(yield take(ch)).toString()}`);
          },
          function * B(log) {
            log(`put1=${(yield put(ch, 'foo')).toString()}`);
            log(`put2=${(yield put(ch, 'bar')).toString()}`);
          }
        ),
        [ '>A', '>B', 'take1=foo', 'put1=true', 'take2=bar', '<A', 'put2=true', '<B' ]
      );
    });
    it('should block the channel if there is no takers but we want to put', () => {
      const ch = chan();

      exercise(
        Test(
          function * A(log) {
            log(`put1=${(yield put(ch, 'foo')).toString()}`);
            log(`put2=${(yield put(ch, 'bar')).toString()}`);
          },
          function * B(log) {
            log(`take1=${(yield take(ch)).toString()}`);
            log(`take2=${(yield take(ch)).toString()}`);
          }
        ),
        [ '>A', '>B', 'put1=true', 'take1=foo', 'put2=true', '<A', 'take2=bar', '<B' ]
      );
    });
  });
  describe('when we create a channel with a fixed buffer with size > 0', () => {
    it('should allow as many puts as we have space', () => {
      const ch = chan(buffer.fixed(2));
      const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      return exercise(
        Test(
          function * A(log) {
            log(`value1=${ch.__value().toString()}`);
            log(`put1=${(yield put(ch, 'foo')).toString()}`);
            log(`value2=${ch.__value().toString()}`);
            log(`put2=${(yield put(ch, 'bar')).toString()}`);
            log(`value3=${ch.__value().toString()}`);
            log(`put3=${(yield put(ch, 'zar')).toString()}`);
            log(`value4=${ch.__value().toString()}`);
            log(`put4=${(yield put(ch, 'mar')).toString()}`);
            log(`value5=${ch.__value().toString()}`);
          },
          function * B(log) {
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
          '<B'
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
            function * A(log) {
              log(`value=${ch.__value().toString()}`);
              log(`put1=${(yield put(ch, 'foo')).toString()}`);
              log(`value=${ch.__value().toString()}`);
              log(`put2=${(yield put(ch, 'bar')).toString()}`);
              log(`value=${ch.__value().toString()}`);
              log(`put3=${(yield put(ch, 'zar')).toString()}`);
              log(`value=${ch.__value().toString()}`);
              yield sleep(10);
              log(`put4=${(yield put(ch, 'final')).toString()}`);
              log(`value=${ch.__value().toString()}`);
            },
            function * B(log) {
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
            '<A'
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
            function * A(log) {
              log(`value=${ch.__value().toString()}`);
              log(`put1=${(yield put(ch, 'foo')).toString()}`);
              log(`value=${ch.__value().toString()}`);
              log(`put2=${(yield put(ch, 'bar')).toString()}`);
              log(`value=${ch.__value().toString()}`);
              log(`put3=${(yield put(ch, 'zar')).toString()}`);
              log(`value=${ch.__value().toString()}`);
              yield sleep(10);
              log(`put4=${(yield put(ch, 'final')).toString()}`);
              log(`value=${ch.__value().toString()}`);
            },
            function * B(log) {
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
            '<A'
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
          Test(function * A(log) {
            log(`take1=${(yield take(ch)).toString()}`);
            log(`take2=${(yield take(ch)).toString()}`);
          }),
          [ '>A', 'take1=a', 'take2=b', '<A' ]
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
            function * A(log) {
              log(`value=${ch.__value().toString()}`);
              log(`put1=${(yield put(ch, 'foo')).toString()}`);
              log(`value=${ch.__value().toString()}`);
              log(`put2=${(yield put(ch, 'bar')).toString()}`);
              log(`value=${ch.__value().toString()}`);
              log(`put3=${(yield put(ch, 'zar')).toString()}`);
              log(`value=${ch.__value().toString()}`);
              yield sleep(10);
              log(`put4=${(yield put(ch, 'final')).toString()}`);
              log(`value=${ch.__value().toString()}`);
            },
            function * B(log) {
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
            '<A'
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
            function * A(log) {
              log(`value=${ch.__value().toString()}`);
              log(`put1=${(yield put(ch, 'foo')).toString()}`);
              log(`value=${ch.__value().toString()}`);
              log(`put2=${(yield put(ch, 'bar')).toString()}`);
              log(`value=${ch.__value().toString()}`);
              log(`put3=${(yield put(ch, 'zar')).toString()}`);
              log(`value=${ch.__value().toString()}`);
              yield sleep(10);
              log(`put4=${(yield put(ch, 'final')).toString()}`);
              log(`value=${ch.__value().toString()}`);
            },
            function * B(log) {
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
            '<A'
          ],
          15,
          () => {
            spy.mockRestore();
          }
        );
      });
    });
  });
  describe('when we create a channel with an ever buffer', () => {
    it(`should
      * have non-blocking puts
      * have non-blocking takes
      * resolve the puts with the latest put value`, () => {
      const ch = chan(buffer.ever());
      const takeSpy = jest.fn();
      const putSpy = jest.fn();

      go(function * () {
        takeSpy(yield take(ch));
        putSpy(yield put(ch, 'foo'));
        takeSpy(yield take(ch));
        putSpy(yield put(ch, 'bar'));
        takeSpy(yield take(ch));
      });

      expect(takeSpy).toBeCalledWithArgs([ undefined ], [ 'foo' ], [ 'bar' ]);
      expect(putSpy).toBeCalledWithArgs([ true ], [ true ]);
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
          function * A(log) {
            log(`put1=${(yield put(ch1, 'foo')).toString()}`);
            log(`put2=${(yield put(ch2, 'bar')).toString()}`);
            log(`put3=${(yield put(ch3, 'zar')).toString()}`);
            log(`put4=${(yield put(ch4, 'moo')).toString()}`);
          },
          function * B(log) {
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
          '<B'
        ]
      );
    });
  });

  // compose

  describe('when composing two channels', () => {
    it(`should
      * aggregate value
      * put to the 'to' channel only if all the source channels receive data`, () => {
      const c1 = chan();
      const c2 = chan();
      const c3 = chan();
      const spy = jest.fn();

      compose(
        c3,
        [ c1, c2 ]
      );
      sub(c3, spy);
      sput(c1, 'foo');
      sput(c2, 'bar');
      sput(c1, 'baz');

      expect(spy).toBeCalledWithArgs([ [ 'foo', 'bar' ] ], [ [ 'baz', 'bar' ] ]);
    });
    it('should use the transform function', () => {
      const c1 = chan();
      const c2 = chan();
      const c3 = chan();
      const spy = jest.fn();

      compose(
        c3,
        [ c1, c2 ],
        (a, b) => {
          return a.toUpperCase() + b.toUpperCase();
        }
      );
      sub(c3, spy);
      sput(c1, 'foo');
      sput(c2, 'bar');
      sput(c1, 'baz');

      expect(spy).toBeCalledWithArgs([ 'FOOBAR' ], [ 'BAZBAR' ]);
    });
    describe('and when we use state', () => {
      it('should aggregate state values', () => {
        const users = state([ { name: 'Joe' }, { name: 'Steve' }, { name: 'Rebeka' } ]);
        const currentUser = state(1);
        const spy = jest.fn();

        sub('app', spy);
        compose(
          'app',
          [ users.READ, currentUser.READ ],
          (users, currentUserIndex) => {
            return users[ currentUserIndex ].name;
          }
        );

        sput(currentUser.WRITE, 2);

        expect(spy).toBeCalledWithArgs([ 'Steve' ], [ 'Rebeka' ]);
      });
    });
    describe('when we use compose together with a routine', () => {
      it('should work just fine', () => {
        const users = state([ { name: 'Joe' }, { name: 'Steve' }, { name: 'Rebeka' } ]);
        const currentUser = state(1);
        const spy = jest.fn();

        compose(
          'app',
          [ users.READ, currentUser.READ ],
          (users, currentUserIndex) => {
            return users[ currentUserIndex ].name;
          }
        );

        go(function * () {
          spy(yield take('app'));
          spy(yield take('app'));
        });
        go(function * () {
          spy(yield put(currentUser.WRITE, 2));
        });

        expect(spy).toBeCalledWithArgs([ 'Steve' ], [ 'Rebeka' ], [ true ]);
      });
    });
  });

  // mult

  describe('when we pipe to other channels', () => {
    it('should distribute a single value to multiple channels', () => {
      const ch1 = chan();
      const ch2 = chan();
      const ch3 = chan();

      mult(ch1, [ ch2 ]);
      mult(ch2, [ ch3 ]);

      exercise(
        Test(
          function * A(log) {
            stake(ch2, v => log(`take_ch2=${v}`));
            stake(ch3, v => log(`take_ch3=${v}`));
            stake(ch3, v => log(`take_ch3=${v}`));
          },
          function * B() {
            sput(ch1, 'foo');
            sput(ch1, 'bar');
            sput(ch1, 'zar');
          }
        ),
        [ '>A', '<A', '>B', 'take_ch3=foo', 'take_ch2=bar', 'take_ch3=zar', '<B' ]
      );
    });
    it('should support nested piping', () => {
      const ch1 = chan('ch1');
      const ch2 = chan('ch2');
      const ch3 = chan('ch3');
      const ch4 = chan('ch4');

      mult(ch1, [ ch2, ch3 ]);
      mult(ch2, [ ch4 ]);

      exercise(
        Test(
          function * A() {
            yield put(ch1, 'foo');
            yield put(ch1, 'bar');
            yield put(ch1, 'zar');
          },
          function * B(log) {
            stake(ch1, v => log(`take_ch1=${v}`));
            stake(ch2, v => log(`take_ch2=${v}`));
            stake(ch3, v => log(`take_ch3=${v}`));
            stake(ch4, v => log(`take_ch4=${v}`));
          }
        ),
        [ '>A', '>B', 'take_ch1=bar', '<A', 'take_ch2=zar', 'take_ch3=foo', 'take_ch4=foo', '<B' ]
      );
    });
    describe('and we tap multiple times to the same channel', () => {
      it('should register the channel only once', () => {
        const ch1 = chan('ch1');
        const ch2 = chan('ch2');
        const ch3 = chan('ch3');

        mult(ch1, [ ch2 ]);
        mult(ch1, [ ch2 ]);
        mult(ch1, [ ch2 ]);
        mult(ch1, [ ch3 ]);

        exercise(
          Test(
            function * A(log) {
              log('p1=' + (yield put(ch1, 'foo')));
              log('p2=' + (yield put(ch1, 'bar')));
              log('p3=' + (yield put(ch1, 'zar')));
            },
            function * B(log) {
              stake(ch2, v => log(`ch2_1=${v}`));
              stake(ch3, v => log(`ch3_1=${v}`));
              stake(ch2, v => log(`ch2_2=${v}`));
              stake(ch3, v => log(`ch3_2=${v}`));
              stake(ch2, v => log(`ch2_3=${v}`));
              stake(ch3, v => log(`ch3_3=${v}`));
              stake(ch2, v => log(`ch2_4=${v}`));
              stake(ch3, v => log(`ch3_4=${v}`));
            }
          ),
          [
            '>A',
            'p1=true',
            '>B',
            'ch2_1=foo',
            'p2=true',
            'ch3_1=foo',
            'ch2_2=bar',
            'p3=true',
            '<A',
            'ch3_2=bar',
            'ch2_3=zar',
            'ch3_3=zar',
            '<B'
          ]
        );
      });
    });
    it('should properly handle the situation when a tapped channel is not open anymore', () => {
      const ch1 = chan();
      const ch2 = chan();
      const ch3 = chan();

      mult(ch1, [ ch2, ch3 ]);

      exercise(
        Test(
          function * A(log) {
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
          function * B() {
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
          '<B'
        ]
      );
    });
    it('should allow us to unmult', () => {
      const ch1 = chan();
      const ch2 = chan();
      const ch3 = chan();

      mult(ch1, [ ch2, ch3 ]);

      exercise(
        Test(
          function * A(log) {
            stake(ch2, v => log(`take_ch2=${v}`));
            stake(ch2, v => log(`take_ch2=${v}`));
            stake(ch2, v => log(`take_ch2=${v}`));
            stake(ch3, v => {
              log(`take_ch3=${v}`);
              unmult(ch1, ch3);
            });
            stake(ch3, v => log(`take_ch3=${v.toString()}`));
          },
          function * B() {
            sput(ch1, 'foo');
            sput(ch1, 'bar');
            sput(ch1, 'zar');
          }
        ),
        [ '>A', '<A', '>B', 'take_ch2=foo', 'take_ch3=foo', 'take_ch2=bar', 'take_ch2=zar', '<B' ]
      );
    });
    it('should allow us to unmult all', () => {
      const ch1 = chan();
      const ch2 = chan();
      const ch3 = chan();

      mult(ch1, [ ch2, ch3 ]);

      exercise(
        Test(
          function * A(log) {
            stake(ch2, v => log(`take_ch2=${v}`));
            stake(ch2, v => log(`take_ch2=${v}`));
            stake(ch2, v => log(`take_ch2=${v}`));
            stake(ch3, v => {
              log(`take_ch3=${v}`);
              unmultAll(ch1);
            });
            stake(ch3, v => log(`take_ch3=${v.toString()}`));
          },
          function * B() {
            sput(ch1, 'foo');
            sput(ch1, 'bar');
            sput(ch1, 'zar');
          }
        ),
        [ '>A', '<A', '>B', 'take_ch2=foo', 'take_ch3=foo', '<B' ]
      );
    });
  });

  // timeout

  describe('when we use the timeout method', () => {
    it('should create a channel that is self closing after X amount of time', () => {
      const ch = timeout(10);

      return exercise(
        Test(
          function * A(log) {
            log(`put1=${(yield put(ch, 'foo')).toString()}`);
            yield sleep(20);
            log(`put2=${(yield put(ch, 'bar')).toString()}`);
          },
          function * B(log) {
            log(`take1=${(yield take(ch)).toString()}`);
            yield sleep(20);
            log(`take2=${(yield take(ch)).toString()}`);
          }
        ),
        [ '>A', '>B', 'put1=true', 'take1=foo', 'put2=Symbol(ENDED)', '<A', 'take2=Symbol(ENDED)', '<B' ],
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
          function * A(log) {
            log(`put1=${(yield put(ch, 'foo')).toString()}`);
            log(`value=${ch.__value().toString()}`);
            log(`put2=${(yield put(ch, 'bar')).toString()}`);
            log(`value=${ch.__value().toString()}`);
            log(`put3=${(yield put(ch, 'zar')).toString()}`);
            log(`value=${ch.__value().toString()}`);
            yield sleep(10);
            log(`put4=${(yield put(ch, 'mar')).toString()}`);
            log(`value=${ch.__value().toString()}`);
          },
          function * B(log) {
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
          '<A'
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
});
