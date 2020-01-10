import {
  buffer,
  reset,
  chan,
  sleep,
  put,
  take,
  sput,
  go,
  read,
  sread,
} from '../index';
import { Test, exercise } from '../__helpers__';

// Fixed buffer

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
  describe('when the size is 0', () => {
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
  describe('when buffer size > 0', () => {
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

// Options (Fixed Buffer)

describe('Given we use take with options and a fixed buffer', () => {
  describe('when we _read_ from a channel via routine', () => {
    it('should just resolve the read but not consume the value and not resolve puts', () => {
      const ch = chan();

      exercise(
        Test(
          function* A(log) {
            log(`read1=${(yield read(ch)).toString()}`);
            log(`read2=${(yield read(ch)).toString()}`);
          },
          function* B(log) {
            sput(ch, 'foo', log);
            sput(ch, 'bar', log); // <- never resolve
            sput(ch, 'zar', log); // <- never resolve
          }
        ),
        ['>A', '>B', 'read1=foo', 'read2=foo', '<A', '<B']
      );
    });
  });
  describe('when we _read_ from a channel outside a routine', () => {
    it('should just resolve the read but not consume the value and not resolve puts', () => {
      const ch = chan();
      const spy = jest.fn();

      sread(ch, spy);
      sput(ch, 'foo', spy); // <- spy didn't call here
      sput(ch, 'bar', spy); // <- spy didn't call here

      expect(spy).toBeCalledWithArgs(['foo']);
    });
  });
  describe('when we _read_ from multiple channels via routine', () => {
    it('should wait till both channels have something', () => {
      const ch1 = chan();
      const ch2 = chan();

      exercise(
        Test(
          function* A(log) {
            log(`read=${(yield read([ch1, ch2])).toString()}`);
          },
          function* B(log) {
            sput(ch1, 'foo', log);
            sput(ch2, 'bar', log);
          }
        ),
        ['>A', '>B', 'read=foo,bar', '<A', '<B']
      );
    });
  });
  describe('when we _read_ from multiple channels outside a routine', () => {
    it('should wait till both channels have something', () => {
      const ch1 = chan();
      const ch2 = chan();
      const spy = jest.fn();

      sread([ch1, ch2], spy);
      sput(ch1, 'foo', spy); // <- spy didn't call here
      sput(ch2, 'bar', spy); // <- spy didn't call here

      expect(spy).toBeCalledWithArgs([['foo', 'bar']]);
    });
  });
});

// Dropping buffer

describe('Given we have a dropping buffer', () => {
  describe("when the buffer's size is 0", () => {
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
  describe("when the buffer's size is > 0", () => {
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
  describe('when we have a pre-set value', () => {
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

// Sliding buffer

describe('Given we have a sliding buffer', () => {
  describe("when the buffer's size is 0", () => {
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
  describe("when the buffer's size is > 0", () => {
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

// Divorced buffer

describe('Given the Divorced buffer', () => {
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
});
