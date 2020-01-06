import { buffer, reset, chan, put, take, sleep, go, sput } from '../index';
import { exercise, Test, delay } from '../__helpers__';
import { sread } from '../csp';

describe('Given the Fixed buffer', () => {
  beforeEach(() => {
    reset();
  });
  describe('when we put but there is no take', () => {
    it('should wait for a take', () => {
      const buf = buffer.fixed();
      const spy = jest.fn();

      buf.put('foo', v => spy('put', v));
      spy('waiting');
      buf.take(v => spy('take', v));

      expect(spy).toBeCalledWithArgs(
        ['waiting'],
        ['put', true],
        ['take', 'foo']
      );
    });
  });
  describe('when we take but there is no put', () => {
    it('should wait for a put to resolve the take', () => {
      const buf = buffer.fixed();
      const spy = jest.fn();

      buf.take(v => spy('take', v));
      spy('waiting');
      buf.put('foo', v => spy('put', v));

      expect(spy).toBeCalledWithArgs(
        ['waiting'],
        ['take', 'foo'],
        ['put', true]
      );
    });
  });
  describe('when we have size > 0', () => {
    it('should wait for a put to resolve the take', () => {
      const buf = buffer.fixed(1);
      const spy = jest.fn();

      buf.put('foo', v => spy('put', v));
      buf.put('bar', v => spy('put', v));
      spy('waiting');
      buf.take(v => spy('take', v));

      expect(spy).toBeCalledWithArgs(
        ['put', true],
        ['waiting'],
        ['put', true],
        ['take', 'foo']
      );
    });
  });
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
  });
});

describe('Given the dropping buffer', () => {
  beforeEach(() => {
    reset();
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
});

describe('Given the sliding buffer', () => {
  beforeEach(() => {
    reset();
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
});

describe('Given the divorce buffer', () => {
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
    it('should allow us to provide custom put and take resolvers', async () => {
      const spy = jest.fn();
      const ch = chan(
        buffer.divorced({
          value: [],
          onPut(getItem, callback) {
            setTimeout(() => {
              this.value = [getItem().toUpperCase()];
              callback(true);
            }, 10);
          },
          onTake(callback) {
            setTimeout(() => callback(`value: ${this.value[0]}`), 20);
          },
        })
      );

      go(function*() {
        spy(`put=${yield put(ch, 'foo')}`);
        spy('A');
      });
      go(function*() {
        spy(`take=${yield take(ch)}`);
        spy('B');
      });

      await delay(20);
      expect(spy).toBeCalledWithArgs(
        ['put=true'],
        ['A'],
        ['take=value: FOO'],
        ['B']
      );
      expect(ch.value()).toStrictEqual(['FOO']);
    });
    it('should allow us to add more then one behavior', () => {
      const spy = jest.fn();
      const ch = chan(
        buffer.divorced({
          value: [],
          onPut(getItem, callback) {
            spy((this.value = [getItem()]));
            callback(true);
          },
          onTake(callback) {
            callback(this.value[0]);
          },
        })
      );

      ch.buff.addBehavior({
        value: [],
        onPut(getItem, callback) {
          spy((this.value = [`Value: ${getItem()}`]));
          callback(true);
        },
        onTake(callback) {
          callback(this.value[0]);
        },
      });

      sput(ch, 'foo');
      sput(ch, 'bar');

      expect(spy).toBeCalledWithArgs(
        [['foo']],
        [['Value: foo']],
        [['bar']],
        [['Value: bar']]
      );
      expect(ch.value()).toStrictEqual([['bar'], ['Value: bar']]);
    });
    it('should block if not all the behaviors are resolved', async () => {
      const spy = jest.fn();
      const ch = chan(
        buffer.divorced({
          value: [],
          onPut(getItem, callback) {
            setTimeout(() => {
              this.value = [getItem()];
              callback('b1 onPut');
            }, 10);
          },
          onTake(callback) {
            setTimeout(() => {
              callback('b1 onTake');
            }, 10);
          },
        })
      );

      ch.buff.addBehavior({
        value: [],
        onPut(getItem, callback) {
          this.value = [getItem()];
          callback('b2 onPut');
        },
        onTake(callback) {
          callback('b2 onTake');
        },
      });

      go(function*() {
        spy('>');
        spy(yield put(ch, 'foo'));
        spy(ch.value());
        spy(yield take(ch));
        spy('<');
      });

      await delay(30);
      expect(spy).toBeCalledWithArgs(
        ['>'],
        [['b1 onPut', 'b2 onPut']],
        [[['foo'], ['foo']]],
        [['b1 onTake', 'b2 onTake']],
        ['<']
      );
    });
  });
});
