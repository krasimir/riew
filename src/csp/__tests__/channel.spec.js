import { chan, buffer, merge, timeout, state, go, put, take, sleep } from '../index';
import { delay } from '../../__helpers__';
import { getFuncName } from '../../utils';

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
  // States

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
        const ch = chan(buffer.dropping(2)).from([ 'a', 'b' ]);
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
  describe('when we create a channel with a reducer buffer', () => {
    it('should behave like a fixed buffer with size 0 but should accumulate state value', () => {
      const reducerSpy = jest.fn();
      const ch = chan(
        buffer.reducer((current = 10, data) => {
          reducerSpy(current);
          return current + data;
        })
      );

      return exercise(
        Test(
          function * A(log) {
            log(`put1=${(yield put(ch, 20)).toString()}`);
            log(`put2=${(yield put(ch, 5)).toString()}`);
            log(`put3=${(yield put(ch, 3)).toString()}`);
          },
          function * B(log) {
            yield sleep(5);
            log(`take1=${(yield take(ch)).toString()}`);
            log(`take2=${(yield take(ch)).toString()}`);
            log(`take3=${(yield take(ch)).toString()}`);
          }
        ),
        [ '>A', '>B', 'take1=30', 'put1=true', 'take2=35', 'put2=true', 'take3=38', '<B', 'put3=true', '<A' ],
        10,
        () => {
          expect(reducerSpy).toBeCalledWithArgs([ 10 ], [ 30 ], [ 35 ]);
        }
      );
    });
    describe('and we fire multiple puts one after each other', () => {
      it('should flatten them', () => {
        const reducerSpy = jest.fn();
        const ch = chan(
          buffer.reducer((current = 0, data) => {
            reducerSpy(current);
            return current + data;
          })
        );

        return exercise(
          Test(
            function * A(log) {
              ch.put(10);
              ch.put(20);
              ch.put(30);
              yield sleep(7);
              ch.put(40);
            },
            function * B(log) {
              yield sleep(5);
              log(`take1=${(yield take(ch)).toString()}`);
              log(`take2=${(yield take(ch)).toString()}`);
              log(`take2=${(yield take(ch)).toString()}`);
              log(`take2=${(yield take(ch)).toString()}`);
            }
          ),
          [ '>A', '>B', 'take1=10', 'take2=30', 'take2=60', 'take2=100', '<B', '<A' ],
          15,
          () => {
            expect(reducerSpy).toBeCalledWithArgs([ 0 ], [ 10 ], [ 30 ], [ 60 ]);
          }
        );
      });
    });
    describe('and we have an array of items as value', () => {
      it('should properly reduce value', () => {
        const reducerSpy = jest.fn();
        const ch = chan(
          buffer.reducer((current, data) => {
            reducerSpy(current, data);
            return current.map(item => {
              return {
                ...item,
                selected: data === item.id
              };
            });
          })
        ).from([ { id: 10, selected: true }, { id: 20, selected: true } ]);

        exercise(
          Test(
            function * A(log) {
              log(`take1=${(yield take(ch)).filter(({ selected }) => selected).map(({ id }) => id)}`);
              log(`take2=${(yield take(ch)).filter(({ selected }) => selected).map(({ id }) => id)}`);
              log(`take3=${(yield take(ch)).filter(({ selected }) => selected).map(({ id }) => id)}`);
            },
            function * B(log) {
              yield put(ch, 10);
              yield put(ch, 20);
            }
          ),
          [ '>A', 'take1=10,20', '>B', 'take2=10', 'take3=20', '<A', '<B' ]
        );

        expect(reducerSpy).toBeCalledWithArgs(
          [
            [
              {
                id: 10,
                selected: true
              },
              {
                id: 20,
                selected: true
              }
            ],
            10
          ],
          [
            [
              {
                id: 10,
                selected: true
              },
              {
                id: 20,
                selected: false
              }
            ],
            20
          ]
        );
      });
    });
  });

  // takeEvery

  describe('when using the `takeEvery` method', () => {
    it('should provide an API for streamed values', () => {
      const ch = chan('ch1');

      exercise(
        Test(
          function * A(log) {
            log(`put1=${(yield put(ch, 'foo')).toString()}`);
            log(`put2=${(yield put(ch, 'bar')).toString()}`);
            log(`put3=${(yield put(ch, 'zar')).toString()}`);
          },
          function * B(log) {
            ch.takeEvery(value => {
              log(`take=${value.toString()}`);
            });
          }
        ),
        [ '>A', '>B', 'take=foo', 'put1=true', 'take=bar', 'put2=true', 'take=zar', 'put3=true', '<A', '<B' ]
      );
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

  // pipe

  describe('when we pipe channels', () => {
    it('should distribute a single value to multiple channels', () => {
      const ch1 = chan();
      const ch2 = chan();
      const ch3 = chan();

      ch1.pipe(ch2);
      ch2.pipe(ch3);

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

      ch1.pipe(
        ch2,
        ch3
      );
      ch2.pipe(ch4);

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

        ch1.pipe(ch2);
        ch1.pipe(ch2);
        ch1.pipe(ch2);

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

  // from

  describe('when we use the from method', () => {
    describe('and we pass an array of values', () => {
      it('should pre-set the value of the channel', () => {
        const ch = chan(buffer.fixed(2)).from([ 'foo', 'bar' ]);

        return exercise(
          Test(
            function * A(log) {
              log(`take1=${(yield take(ch)).toString()}`);
              log(`take2=${(yield take(ch)).toString()}`);
              log(`take3=${(yield take(ch)).toString()}`);
            },
            function * B(log) {
              yield sleep(5);
              log('B put');
              log(`put=${(yield put(ch, 'zar')).toString()}`);
            }
          ),
          [ '>A', 'take1=foo', 'take2=bar', '>B', 'B put', 'take3=zar', '<A', 'put=true', '<B' ],
          10
        );
      });
    });
    describe('and we pass another channel', () => {
      it('should auto pipe', () => {
        const ch1 = chan();
        const ch2 = chan().from(ch1);

        return exercise(
          Test(
            function * A(log) {
              log(`take1=${(yield take(ch2)).toString()}`);
              log(`take2=${(yield take(ch2)).toString()}`);
            },
            function * B(log) {
              yield sleep(5);
              log(`put1=${(yield put(ch1, 'foo')).toString()}`);
              log(`put2=${(yield put(ch1, 'bar')).toString()}`);
            }
          ),
          [ '>A', '>B', 'take1=foo', 'put1=true', 'take2=bar', '<A', 'put2=true', '<B' ],
          10
        );
      });
    });
    describe('and we pass only a single value that is not array', () => {
      describe('and that value is undefined', () => {
        it('should do nothing', () => {
          const ch = chan().from();

          return exercise(
            Test(
              function * A(log) {
                log(`take1=${(yield take(ch)).toString()}`);
                log(`take2=${(yield take(ch)).toString()}`);
              },
              function * B(log) {
                yield sleep(5);
                log(`put1=${(yield put(ch, 'foo')).toString()}`);
                log(`put2=${(yield put(ch, 'bar')).toString()}`);
              }
            ),
            [ '>A', '>B', 'take1=foo', 'put1=true', 'take2=bar', '<A', 'put2=true', '<B' ],
            10
          );
        });
      });
      describe('and that value is NOT undefined', () => {
        it('should pass it as array of one item to the buffer', () => {
          const ch = state('foo');

          return exercise(
            Test(
              function * A(log) {
                log(`take1=${(yield take(ch)).toString()}`);
                log(`take2=${(yield take(ch)).toString()}`);
              },
              function * B(log) {
                yield sleep(5);
                log(`put2=${(yield put(ch, 'bar')).toString()}`);
              }
            ),
            [ '>A', 'take1=foo', '>B', 'take2=bar', '<A', 'put2=true', '<B' ],
            10
          );
        });
      });
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

  // iterable protocol

  describe('when we destruct a channel', () => {
    it('should gives us access to the take and put methods', async () => {
      const [ take, put ] = chan();

      exercise(
        Test(
          function * A(log) {
            put('foo', () => log('put1'));
            put('bar', () => log('put2'));
          },
          function * B(log) {
            take(v => log('take1=' + v));
            take(v => log('take2=' + v));
          }
        ),
        [ '>A', '<A', '>B', 'take1=foo', 'put1', 'take1=bar', 'put2', '<B' ]
      );
    });
  });

  // state helper

  describe('when we use the state method', () => {
    it('should create a unbuffered channel with a value inside', () => {
      const ch = state('foo', 'bar');

      exercise(
        Test(
          function * A(log) {
            log(`take1=${(yield take(ch)).toString()}`);
            log(`take2=${(yield take(ch)).toString()}`);
            log(`take3=${(yield take(ch)).toString()}`);
          },
          function * B(log) {
            log(`put=${(yield put(ch, 'zar')).toString()}`);
          }
        ),
        [ '>A', 'take1=foo', 'take2=bar', '>B', 'take3=zar', '<A', 'put=true', '<B' ]
      );
    });
  });
});
