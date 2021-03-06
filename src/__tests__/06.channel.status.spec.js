import { buffer, reset, put, sput, take, sleep, close, fixed } from '../index';
import { Test, exercise } from '../__helpers__';

describe('Given a CSP', () => {
  beforeEach(() => {
    reset();
  });

  describe('and we have an the channel OPEN', () => {
    it(`should
      * allow writing and reading
      * should block the put until take
      * should block the take until put`, () => {
      const ch = fixed();

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
      const ch = fixed();

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
      const ch = fixed();

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
      const ch = fixed();

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
      const ch = fixed(1);

      return exercise(
        Test(
          function* A(log) {
            log(`p1=${(yield put(ch, 'foo')).toString()}`);
            log(`p2=${(yield put(ch, 'bar')).toString()}`);
            close(ch);
            log(`p3=${(yield put(ch, 'zar')).toString()}`);
            yield sleep(5);
            log(`p4=${(yield put(ch, 'moo')).toString()}`);
          },
          function* B(log) {
            log(`take1=${(yield take(ch)).toString()}`);
            yield sleep(2);
            log([...ch.buff.getValue()]);
            log(`take2=${(yield take(ch)).toString()}`);
            log(`take3=${(yield take(ch)).toString()}`);
          }
        ),
        [
          '>A',
          'p1=true',
          '>B',
          'take1=foo',
          'p2=true',
          'p3=Symbol(CLOSED)',
          ['bar'],
          'take2=bar',
          'take3=Symbol(ENDED)',
          '<B',
          'p4=Symbol(ENDED)',
          '<A',
        ],
        10
      );
    });
    it('should resolve the pending takes with ENDED', () => {
      const ch = fixed();

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
});
