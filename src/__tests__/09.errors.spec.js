import {
  go,
  state,
  sput,
  reset,
  put,
  stake,
  sliding,
  fixed,
  sread,
  listen,
} from '../index';
import { delay } from '../__helpers__';

describe('Given csp features', () => {
  beforeEach(() => {
    reset();
  });
  describe('when we have an error inside a routine', () => {
    it('should allow us to catch the error', () => {
      expect(() => {
        go(function*() {
          throw new Error('boo');
        });
      }).toThrowError('boo');
    });
  });
  describe('when we yield a promise and it gets rejected', () => {
    it('should pass back the error to the routine and should allow us to continue yielding', async () => {
      const error = new Error('ops');
      const ch = fixed();
      const spy = jest.fn();

      go(function*() {
        try {
          yield new Promise((_, reject) => setTimeout(() => reject(error), 10));
        } catch (e) {
          expect(e).toBe(error);
          spy(error.toString());
          yield put(ch, 'sorry, error');
        }
      });
      stake(ch, spy);

      await delay(20);
      expect(spy).toBeCalledWithArgs(['Error: ops'], ['sorry, error']);
    });
  });
  describe('when we have an error inside the state selectors', () => {
    it('should allow us to catch the error', () => {
      const s = state('foo');
      const R = s.select(function() {
        throw new Error('foo');
      });

      expect(() => sread(R, () => {})).toThrowError('foo');
    });
    it('should allow us to catch the error with a callback', done => {
      const s = state('foo');
      const error = new Error('foo');
      const R = s.select(
        function(value) {
          if (value === 'a-ha') {
            throw error;
          }
          return value;
        },
        e => {
          expect(e).toBe(error);
          done();
        }
      );

      listen(R, () => {});
      sput(s, 'a-ha');
    });
    describe('and we use a routine', () => {
      it('should allow us to catch the error', () => {
        const s = state('foo');
        const R = s.select(function*() {
          throw new Error('foo');
        });

        expect(() => sread(R, () => {})).toThrowError('foo');
      });
      it('should allow us to catch the error with a callback', done => {
        const s = state('foo');
        const error = new Error('foo');
        const R = s.select(
          function*(value) {
            if (value === 'a-ha') {
              throw error;
            }
            return value;
          },
          e => {
            expect(e).toBe(error);
            done();
          }
        );

        listen(R, () => {});
        sput(s, 'a-ha');
      });
    });
  });
  describe('when we have an error in a mutator', () => {
    it('should allow us to catch the error', async () => {
      const s = state('foo');
      const error = new Error('ops');
      const M = s.mutate(function() {
        throw error;
      });

      expect(() => sput(M, 'zoo')).toThrowError(error);
    });
    it('should allow us to catch the error with a callback', done => {
      const s = state('foo');
      const error = new Error('ops');
      const M = s.mutate(
        function() {
          throw error;
        },
        e => {
          expect(e).toBe(error);
          done();
        }
      );

      sput(M, 'zoo');
    });
    describe('and we use a routine', () => {
      it('should allow us to catch the error', async () => {
        const s = state('foo');
        const error = new Error('ops');
        const M = s.mutate(function*() {
          throw error;
        });

        expect(() => sput(M, 'zoo')).toThrowError(error);
      });
      it('should allow us to catch the error with a callback', done => {
        const s = state('foo');
        const error = new Error('ops');
        const M = s.mutate(
          function*() {
            throw error;
          },
          e => {
            expect(e).toBe(error);
            done();
          }
        );

        sput(M, 'zoo');
      });
    });
  });
});
