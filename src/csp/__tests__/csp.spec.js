import { chan, buffer, merge, timeout, go, put, take, sleep, state } from '../index';
import { getFuncName } from '../../utils';
import { delay } from '../../__helpers__';

function Test(...routines) {
  const log = [];
  routines.map(routine => {
    const rName = getFuncName(routine);
    const logSomething = str => log.push(str);
    log.push(`>${rName}`);
    go(routine, [ logSomething ], () => log.push(`<${rName}`));
  });
  return log;
}
function exercise(log, expectation, delay, cleanup = () => {}) {
  if (delay) {
    return new Promise(resolve => {
      setTimeout(() => {
        expect(log).toStrictEqual(expectation);
        resolve();
        cleanup();
      }, delay);
    });
  }
  expect(log).toStrictEqual(expectation);
}

describe('Given a CSP', () => {
  // Routines
  describe('and we run a routine', () => {
    it('should put and take from channels', () => {
      const ch = chan();
      const spy = jest.fn();
      const cleanup1 = jest.fn();
      const cleanup2 = jest.fn();

      go(
        function * () {
          spy(yield take(ch));
          yield put(ch, 'pong');
          return 'a';
        },
        [],
        cleanup1
      );
      go(
        function * () {
          yield put(ch, 'ping');
          spy(yield take(ch));
          return 'b';
        },
        [],
        cleanup2
      );
      expect(spy).toBeCalledWithArgs([ 'ping' ], [ 'pong' ]);
      expect(cleanup1).toBeCalledWithArgs([ 'a' ]);
      expect(cleanup2).toBeCalledWithArgs([ 'b' ]);
    });
    it('should work even if we use plain functions', () => {
      const ch = chan();
      const spy = jest.fn();
      const cleanup1 = jest.fn();
      const cleanup2 = jest.fn();

      go(
        function () {
          ch.take(v => {
            spy(v);
            ch.put('pong');
          });
          return 'a';
        },
        [],
        cleanup1
      );
      go(
        function () {
          ch.put('ping', () => {
            ch.take(spy);
          });
          return 'b';
        },
        [],
        cleanup2
      );
      expect(spy).toBeCalledWithArgs([ 'ping' ], [ 'pong' ]);
      expect(cleanup1).toBeCalledWithArgs([ 'a' ]);
      expect(cleanup2).toBeCalledWithArgs([ 'b' ]);
    });
    it('should work even if we use async function', async () => {
      const ch = chan();
      const spy = jest.fn();
      const cleanup1 = jest.fn();
      const cleanup2 = jest.fn();

      go(
        async function () {
          ch.take(v => {
            spy(v);
            ch.put('pong');
          });
          return 'a';
        },
        [],
        cleanup1
      );
      go(
        async function () {
          ch.put('ping', () => {
            ch.take(spy);
          });
          return 'b';
        },
        [],
        cleanup2
      );
      expect(spy).toBeCalledWithArgs([ 'ping' ], [ 'pong' ]);
      await delay();
      expect(cleanup1).toBeCalledWithArgs([ 'a' ]);
      expect(cleanup2).toBeCalledWithArgs([ 'b' ]);
    });
    it('should provide an API to stop the routine', async () => {
      const spy = jest.fn();
      const routine = go(function * A(log) {
        yield sleep(4);
        spy('foo');
      });

      await delay(2);
      routine.stop();
      await delay(4);
      expect(spy).not.toBeCalled();
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
        [ '>A', '>B', 'take=foo', '<B', 'put successful', '<A' ]
      );
    });
  });
  describe('and we put without waiting', () => {
    it('should end the first routine and allow consuming from the channel in the second', () => {
      const ch = chan();

      exercise(
        Test(
          function * A(log) {
            ch.put('foo');
            ch.put('bar');
            ch.put('zar');
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
            ch.close();
            log(`take2=${(yield take(ch)).toString()}`);
            log(`take3=${(yield take(ch)).toString()}`);
          }
        ),
        [
          '>A',
          '>B',
          'take1=foo',
          'take2=Symbol(ENDED)',
          'take3=Symbol(ENDED)',
          '<B',
          'p1=true',
          'p2=Symbol(ENDED)',
          'p3=Symbol(ENDED)',
          '<A'
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
            ch.close();
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
            ch.close();
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
            ch.close();
          }
        ),
        [ '>A', '>B', 'take1=Symbol(ENDED)', '<A', '<B' ]
      );
    });
  });

  // Types of buffers

  describe('when we create a channel with the default buffer (fixed buffer with size 0)', () => {
    it('allow writing and reading', async () => {
      const ch = chan();

      ch.put('foo');
      expect(await ch.take()).toEqual('foo');
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
        [ '>A', '>B', 'take1=foo', 'put1=true', 'take2=bar', '<B', 'put2=true', '<A' ]
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
        ch.put('a');
        ch.put('b');
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

  // subscribe

  describe('when using the `subscribe` method', () => {
    it('should provide an API for continues value receiving', () => {
      const ch = chan('ch1');

      exercise(
        Test(
          function * A(log) {
            log(`put1=${(yield put(ch, 'foo')).toString()}`);
            log(`put2=${(yield put(ch, 'bar')).toString()}`);
            log(`put3=${(yield put(ch, 'zar')).toString()}`);
          },
          function * B(log) {
            ch.subscribe(value => {
              log(`take=${value.toString()}`);
            });
          }
        ),
        [ '>A', '>B', 'take=foo', 'put1=true', 'take=bar', 'put2=true', 'take=zar', 'put3=true', '<A', '<B' ]
      );
    });
    it("shouldn't subscribe to the same observer twice", () => {
      const ch = chan();
      const spy1 = jest.fn();
      const spy2 = jest.fn();

      ch.subscribe(spy1);
      ch.subscribe(spy1);
      ch.subscribe(spy2, 'foo');
      ch.subscribe(spy2, 'foo');
      ch.subscribe(spy2, 'foo');

      ch.put('Hey');

      expect(spy1).toBeCalledWithArgs([ 'Hey' ], [ 'Hey' ]);
      expect(spy2).toBeCalledWithArgs([ 'Hey' ]);
    });
    it('should provide an API for unsubscribing', () => {
      const ch = chan();
      const spy = jest.fn();
      const unsub = ch.subscribe(spy);

      ch.put('foo');
      ch.put('bar');
      unsub();
      ch.put('baz');
      ch.put('moo');

      expect(spy).toBeCalledWithArgs([ 'foo' ], [ 'bar' ]);
    });
    describe('and we pass a channel instead of a function', () => {
      it('should pipe', () => {
        const ch = chan();
        const ch2 = chan();
        const spy2 = jest.fn();
        const ch3 = chan();
        const spy3 = jest.fn();

        ch.subscribe(ch2);
        ch.subscribe(ch3);
        ch.subscribe(ch3);
        ch2.subscribe(spy2);
        ch3.subscribe(spy3);

        ch.put('foo');
        ch.put('bar');
        ch.put('zar');

        expect(spy2).toBeCalledWithArgs([ 'foo' ], [ 'bar' ], [ 'zar' ]);
        expect(spy3).toBeCalledWithArgs([ 'foo' ], [ 'bar' ], [ 'zar' ]);
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
          'take4=moo',
          '<B',
          'put4=true',
          '<A'
        ]
      );
    });
  });

  // piping

  describe('when we pipe channels', () => {
    it('should distribute a single value to multiple channels', () => {
      const ch1 = chan();
      const ch2 = chan();
      const ch3 = chan();

      ch1.subscribe(ch2);
      ch2.subscribe(ch3);

      exercise(
        Test(
          function * A(log) {
            ch2.take(v => log(`take_ch2=${v}`));
            ch3.take(v => log(`take_ch3=${v}`));
            ch3.take(v => log(`take_ch3=${v}`));
          },
          function * B() {
            ch1.put('foo');
            ch1.put('bar');
            ch1.put('zar');
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

      ch1.subscribe(ch2);
      ch1.subscribe(ch3);
      ch2.subscribe(ch4);

      exercise(
        Test(
          function * A(log) {
            yield put(ch1, 'foo');
            yield put(ch1, 'bar');
            yield put(ch1, 'zar');
          },
          function * B(log) {
            ch1.take(v => log(`take_ch1=${v}`));
            ch2.take(v => log(`take_ch2=${v}`));
            ch3.take(v => log(`take_ch3=${v}`));
            ch4.take(v => log(`take_ch4=${v}`));
          }
        ),
        [ '>A', '<A', '>B', 'take_ch3=foo', 'take_ch3=bar', 'take_ch3=zar', 'take_ch4=foo', 'take_ch4=bar', 'take_ch4=zar', '<B' ]
      );
    });
    describe('and we pipe multiple times to the same channel', () => {
      it('should consider only the first pipe call', () => {
        const ch1 = chan('ch1');
        const ch2 = chan('ch2');

        ch1.subscribe(ch2);
        ch1.subscribe(ch2);
        ch1.subscribe(ch2);

        exercise(
          Test(
            function * A(log) {
              yield put(ch1, 'foo');
              yield put(ch1, 'bar');
              yield put(ch1, 'zar');
            },
            function * B(log) {
              ch2.take(v => log(`take_ch1=${v}`));
              ch2.take(v => log(`take_ch2=${v}`));
              ch2.take(v => log(`take_ch3=${v}`));
              ch2.take(v => log(`take_ch4=${v}`));
              ch2.take(v => log(`take_ch4=${v}`));
            }
          ),
          [ '>A', '<A', '>B', 'take_ch1=foo', 'take_ch1=bar', 'take_ch1=zar', '<B' ]
        );
      });
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
        [ '>A', '>B', 'take1=foo', 'put1=true', 'take2=Symbol(ENDED)', '<B', 'put2=Symbol(ENDED)', '<A' ],
        30
      );
    });
  });

  // reset

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
            ch.reset();
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

  // filter

  describe('when we use the filter method', () => {
    it('should return a new channel that only receives the filtered data', () => {
      const ch1 = chan();
      const ch2 = ch1.filter(v => v > 10);

      exercise(
        Test(
          function * A(log) {
            log(`put1=${(yield put(ch1, 5)).toString()}`);
            log(`put2=${(yield put(ch1, 12)).toString()}`);
            log(`put3=${(yield put(ch1, 20)).toString()}`);
            log(`put4=${(yield put(ch1, 4)).toString()}`);
          },
          function * B(log) {
            ch2.take(v => log(`take1=${v}`));
            ch2.take(v => log(`take2=${v}`));
            ch2.take(v => log(`take3=${v}`));
            ch2.take(v => log(`take4=${v}`));
          }
        ),
        [ '>A', 'put1=true', 'put2=true', 'put3=true', 'put4=true', '<A', '>B', 'take1=12', 'take1=20', '<B' ]
      );
    });
  });

  // map

  describe('when we use the map method', () => {
    it('should return a new channel that receives the mapped data', () => {
      const ch1 = chan();
      const ch2 = ch1.map(v => v * 2);
      const ch3 = ch1.map(v => v * 3);

      exercise(
        Test(
          function * A(log) {
            log(`put1=${(yield put(ch1, 5)).toString()}`);
            log(`put2=${(yield put(ch1, 12)).toString()}`);
          },
          function * B(log) {
            ch2.take(v => log(`take2_1=${v}`));
            ch2.take(v => log(`take2_2=${v}`));
            ch3.take(v => log(`take3_1=${v}`));
            ch3.take(v => log(`take3_2=${v}`));
          }
        ),
        [ '>A', 'put1=true', 'put2=true', '<A', '>B', 'take2_1=10', 'take2_1=24', 'take3_1=15', 'take3_1=36', '<B' ]
      );
    });
  });

  // state

  describe('when we want to have a state management', () => {
    it(`should
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
    it('should NOT do the initial put if there is no initial state', () => {
      const s = state();
      const read = s.map();
      const update = s.set();
      const spy = jest.fn();

      read.subscribe(spy);
      update.put(42);

      expect(spy).toBeCalledWithArgs([ 42 ]);
    });
    it('should allow us to use async setter', async () => {
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
  });

  // more complex examples

  describe('when we combine methods', () => {
    it('should work', () => {
      const spy1 = jest.fn();
      const spy2 = jest.fn();
      const message = chan();
      message.put('fOO');
      const update = v => message.put(v);

      message.map(value => value.toUpperCase()).subscribe(spy1);
      message.map(value => value.toLowerCase()).subscribe(spy2);
      update('Hello World');
      update('cHao');

      expect(spy1).toBeCalledWithArgs([ 'FOO' ], [ 'HELLO WORLD' ], [ 'CHAO' ]);
      expect(spy2).toBeCalledWithArgs([ 'hello world' ], [ 'chao' ]);
    });
  });
});
