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
      xit('should properly reduce value', async () => {
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
              log(`take1=${(yield ch.take()).filter(({ selected }) => selected).map(({ id }) => id)}`);
              log(`take2=${(yield ch.take()).filter(({ selected }) => selected).map(({ id }) => id)}`);
              log(`take2=${(yield ch.take()).filter(({ selected }) => selected).map(({ id }) => id)}`);
            },
            function * B(log) {
              yield ch.put(10);
              yield ch.put(20);
            }
          ),
          [ '>A', '>B', 'take1=10,20', 'take2=10', 'take2=20', '<B', '<A' ]
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
    xit('should provide an API for streamed values', async () => {
      const ch = chan('ch1');

      exercise(
        Test(
          function * A(log) {
            log(`put1=${(yield ch.put('foo')).toString()}`);
            log(`put2=${(yield ch.put('bar')).toString()}`);
            log(`put3=${(yield ch.put('zar')).toString()}`);
            ch.close();
          },
          function * B(log) {
            ch.takeEvery(value => {
              log(`take=${value.toString()}`);
            });
          }
        ),
        [ '>A', '>B', 'put1=true', 'take=foo', '<B', 'put2=true', 'take=bar', 'put3=true', 'take=zar', '<A' ]
      );
    });
  });

  // takeLatest

  describe('when using takeLatest method', () => {
    xit('should fire the callback only if there are no more pending puts', async () => {
      const reducerSpy = jest.fn();
      const ch = chan(
        buffer.reducer((current = '', data) => {
          return current + data;
        })
      ).takeLatest(reducerSpy);
      const data1 = chan()
        .from([ 'foo' ])
        .pipe(ch);
      const data2 = chan()
        .from([ 'bar' ])
        .pipe(ch);

      data1.put('A');
      data2.put('B');
      delay();

      expect(reducerSpy).toBeCalledWithArgs([ 'foobarAB' ]);
    });
  });

  // merge

  describe('when we merge channels', () => {
    xit('should merge two and more into a single channel', async () => {
      const ch1 = chan('ch1');
      const ch2 = chan('ch2');
      const ch3 = chan('ch3');
      const ch4 = merge(ch1, ch2, ch3);

      exercise(
        Test(
          function * A(log) {
            log(`put1=${(yield ch1.put('foo')).toString()}`);
            log(`put2=${(yield ch2.put('bar')).toString()}`);
            log(`put3=${(yield ch3.put('zar')).toString()}`);
            log(`put4=${(yield ch4.put('moo')).toString()}`);
          },
          function * B(log) {
            log(`take1=${(yield ch4.take()).toString()}`);
            log(`take2=${(yield ch4.take()).toString()}`);
            log(`take3=${(yield ch4.take()).toString()}`);
            log(`take4=${(yield ch4.take()).toString()}`);
          }
        ),
        [
          '>A',
          '>B',
          'put1=true',
          'take1=foo',
          'put2=true',
          'take2=bar',
          'put3=true',
          'take3=zar',
          'put4=true',
          'take4=moo',
          '<A',
          '<B'
        ]
      );
    });
  });

  // pipe

  describe('when we pipe channels', () => {
    xit('should distribute a single value to multiple channels', async () => {
      const ch1 = chan();
      const ch2 = chan();
      const ch3 = chan();

      ch1.pipe(ch2);
      ch2.pipe(ch3);

      exercise(
        Test(
          function * A(log) {
            ch2.take().then(v => log(`take_ch2=${v}`));
            ch3.take().then(v => log(`take_ch3=${v}`));
            ch3.take().then(v => log(`take_ch3=${v}`));
            yield delay(5);
          },
          function * B() {
            ch1.put('foo');
            ch1.put('bar');
            ch1.put('zar');
          }
        ),
        [ '>A', '>B', '<B', 'take_ch3=foo', 'take_ch2=bar', 'take_ch3=zar', '<A' ]
      );
    });
    xit('should support nested piping', async () => {
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
            yield ch1.put('foo');
            yield ch1.put('bar');
            yield ch1.put('zar');
          },
          function * B(log) {
            ch1.take().then(v => log(`take_ch1=${v}`));
            ch2.take().then(v => log(`take_ch2=${v}`));
            ch3.take().then(v => log(`take_ch3=${v}`));
            ch4.take().then(v => log(`take_ch4=${v}`));
            yield delay(10);
          }
        ),
        [ '>A', '>B', 'take_ch3=foo', 'take_ch1=bar', 'take_ch4=foo', 'take_ch2=zar', '<A', '<B' ]
      );
    });
    describe('and we pipe multiple times to the same channel', () => {
      xit('should consider only the first pipe call', async () => {
        const ch1 = chan('ch1');
        const ch2 = chan('ch2');

        ch1.pipe(ch2);
        ch1.pipe(ch2);
        ch1.pipe(ch2);

        exercise(
          Test(
            function * A(log) {
              yield ch1.put('foo');
              yield ch1.put('bar');
              yield ch1.put('zar');
            },
            function * B(log) {
              ch2.take().then(v => log(`take_ch1=${v}`));
              ch2.take().then(v => log(`take_ch2=${v}`));
              ch2.take().then(v => log(`take_ch3=${v}`));
              ch2.take().then(v => log(`take_ch4=${v}`));
              ch2.take().then(v => log(`take_ch4=${v}`));
              yield delay(10);
            }
          ),
          [ '>A', '>B', 'take_ch1=foo', 'take_ch2=bar', 'take_ch3=zar', '<A', '<B' ]
        );
      });
    });
  });

  // timeout

  describe('when we use the timeout method', () => {
    xit('should create a channel that is self closing after X amount of time', async () => {
      const ch = timeout(10);

      exercise(
        Test(
          function * A(log) {
            log(`put1=${(yield ch.put('foo')).toString()}`);
            yield delay(20);
            log(`put2=${(yield ch.put('bar')).toString()}`);
          },
          function * B(log) {
            log(`take1=${(yield ch.take()).toString()}`);
            yield delay(20);
            log(`take2=${(yield ch.take()).toString()}`);
          }
        ),
        [ '>A', '>B', 'put1=true', 'take1=foo', 'put2=Symbol(ENDED)', 'take2=Symbol(ENDED)', '<A', '<B' ]
      );
    });
  });

  // reset

  describe('when we use the reset method', () => {
    xit('should put the channel in its initial state', async () => {
      const ch = chan(buffer.sliding(2));
      const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      exercise(
        Test(
          function * A(log) {
            log(`put1=${(yield ch.put('foo')).toString()}`);
            log(`value=${ch.__value().toString()}`);
            log(`put2=${(yield ch.put('bar')).toString()}`);
            log(`value=${ch.__value().toString()}`);
            log(`put3=${(yield ch.put('zar')).toString()}`);
            log(`value=${ch.__value().toString()}`);
            yield delay(10);
            log(`put4=${(yield ch.put('mar')).toString()}`);
            log(`value=${ch.__value().toString()}`);
          },
          function * B(log) {
            yield delay(5);
            ch.reset();
            log('reset');
          }
        ),
        [
          '>A',
          '>B',
          'put1=true',
          'value=foo',
          'put2=true',
          'value=foo,bar',
          'put3=true',
          'value=bar,zar',
          'reset',
          '<B',
          'put4=true',
          'value=mar',
          '<A'
        ]
      );
      spy.mockReset();
    });
  });

  // from

  describe('when we use the from method', () => {
    describe('and we pass an array of values', () => {
      xit('should pre-set the value of the channel', async () => {
        const ch = chan(buffer.fixed(2)).from([ 'foo', 'bar' ]);

        exercise(
          Test(
            function * A(log) {
              log(`take1=${(yield ch.take()).toString()}`);
              log(`take2=${(yield ch.take()).toString()}`);
              log(`take3=${(yield ch.take()).toString()}`);
            },
            function * B(log) {
              yield delay(5);
              log('B put');
              log(`put=${(yield ch.put('zar')).toString()}`);
            }
          ),
          [ '>A', '>B', 'take1=foo', 'take2=bar', 'B put', 'take3=zar', 'put=true', '<A', '<B' ]
        );
      });
    });
    describe('and we pass another channel', () => {
      xit('should auto pipe', async () => {
        const ch1 = chan();
        const ch2 = chan().from(ch1);

        exercise(
          Test(
            function * A(log) {
              log(`take1=${(yield ch2.take()).toString()}`);
              log(`take2=${(yield ch2.take()).toString()}`);
            },
            function * B(log) {
              yield delay(5);
              log(`put1=${(yield ch1.put('foo')).toString()}`);
              log(`put2=${(yield ch1.put('bar')).toString()}`);
            }
          ),
          [ '>A', '>B', 'put1=true', 'take1=foo', 'put2=true', 'take2=bar', '<B', '<A' ]
        );
      });
    });
    describe('and we pass only a single value that is not array', () => {
      describe('and that value is undefined', () => {
        xit('should do nothing', async () => {
          const ch = chan().from();

          exercise(
            Test(
              function * A(log) {
                log(`take1=${(yield ch.take()).toString()}`);
                log(`take2=${(yield ch.take()).toString()}`);
              },
              function * B(log) {
                yield delay(5);
                log(`put1=${(yield ch.put('foo')).toString()}`);
                log(`put2=${(yield ch.put('bar')).toString()}`);
              }
            ),
            [ '>A', '>B', 'take1=foo', 'put1=true', 'take2=bar', 'put2=true', '<A', '<B' ]
          );
        });
      });
      describe('and that value is NOT undefined', () => {
        xit('should pass it as array of one item to the buffer', async () => {
          const ch = state('foo');

          exercise(
            Test(
              function * A(log) {
                log(`take1=${(yield ch.take()).toString()}`);
                log(`take2=${(yield ch.take()).toString()}`);
              },
              function * B(log) {
                yield delay(5);
                log(`put2=${(yield ch.put('bar')).toString()}`);
              }
            ),
            [ '>A', '>B', 'take1=foo', 'take2=bar', 'put2=true', '<A', '<B' ]
          );
        });
      });
    });
  });

  // filter

  describe('when we use the filter method', () => {
    xit('should return a new channel that only receives the filtered data', async () => {
      const ch1 = chan();
      const ch2 = ch1.filter(v => v > 10);

      exercise(
        Test(
          function * A(log) {
            log(`put1=${(yield ch1.put(5)).toString()}`);
            log(`put2=${(yield ch1.put(12)).toString()}`);
            log(`put3=${(yield ch1.put(20)).toString()}`);
            log(`put4=${(yield ch1.put(4)).toString()}`);
          },
          function * B(log) {
            ch2.take().then(v => log(`take1=${v}`));
            ch2.take().then(v => log(`take2=${v}`));
            ch2.take().then(v => log(`take3=${v}`)); // not happening
            ch2.take().then(v => log(`take4=${v}`)); // not happening
            yield delay(5);
          }
        ),
        [ '>A', '>B', 'put1=true', 'put2=true', 'take1=12', 'put3=true', 'take2=20', 'put4=true', '<A', '<B' ]
      );
    });
  });

  // map

  describe('when we use the map method', () => {
    xit('should return a new channel that receives the mapped data', async () => {
      const ch1 = chan();
      const ch2 = ch1.map(v => v * 2);
      const ch3 = ch1.map(v => v * 3);

      exercise(
        Test(
          function * A(log) {
            log(`put1=${(yield ch1.put(5)).toString()}`);
            log(`put2=${(yield ch1.put(12)).toString()}`);
          },
          function * B(log) {
            ch2.take().then(v => log(`take2_1=${v}`));
            ch2.take().then(v => log(`take2_2=${v}`));
            ch3.take().then(v => log(`take3_1=${v}`));
            ch3.take().then(v => log(`take3_2=${v}`));
            yield delay(5);
          }
        ),
        [ '>A', '>B', 'put1=true', 'take2_1=10', 'take3_1=15', 'put2=true', 'take2_2=24', 'take3_2=36', '<A', '<B' ]
      );
    });
  });

  // iterable protocol

  describe('when we destruct a channel', () => {
    xit('should gives us access to the take and put methods', async () => {
      const [ take, put ] = chan();

      exercise(
        Test(
          function * A(log) {
            log(`put1=${(yield put('foo')).toString()}`);
            log(`put2=${(yield put('bar')).toString()}`);
          },
          function * B(log) {
            log(`take1=${(yield take()).toString()}`);
            log(`take2=${(yield take()).toString()}`);
          }
        ),
        [ '>A', '>B', 'put1=true', 'take1=foo', 'put2=true', 'take2=bar', '<A', '<B' ]
      );
    });
  });

  // iterable protocol

  describe('when we use the state method', () => {
    xit('should create a unbuffered channel with a value inside', async () => {
      const ch = state('foo');

      exercise(
        Test(
          function * A(log) {
            log(`take1=${(yield ch.take()).toString()}`);
            log(`take2=${(yield ch.take()).toString()}`);
          },
          function * B(log) {
            log(`put1=${(yield ch.put('bar')).toString()}`);
          }
        ),
        [ '>A', '>B', 'take1=foo', 'put1=true', 'take2=bar', '<B', '<A' ]
      );
    });
  });
});
