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
  ONE_OF,
} from '../index';
import { Test, exercise } from '../__helpers__';

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
