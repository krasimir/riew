import { go, state, sput, reset, chan, put, stake } from '../index';
import { delay } from '../__helpers__';

describe('Given csp features', () => {
  beforeEach(() => {
    reset();
  });
  describe('when we have an error inside a routine', () => {
    xit('should allow us to catch the error', () => {
      expect(() => {
        go(function*() {
          throw new Error('boo');
        });
      }).toThrowError('boo');
    });
  });
  describe('when we yield a promise and it gets rejected', () => {
    xit('should pass back the error to the routine and should allow us to continue yielding', async () => {
      const error = new Error('ops');
      const ch = chan();
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
    xit('should allow us to catch the error', () => {
      const s = state('foo');

      s.select('R', function(value) {
        if (value === 'a-ha') {
          throw new Error('foo');
        }
        return value;
      });

      expect(() => sput(s, 'a-ha')).toThrowError('foo');
    });
    xit('should allow us to catch the error with a callback', done => {
      const s = state('foo');
      const error = new Error('foo');

      s.select(
        'R',
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

      sput(s, 'a-ha');
    });
    describe('and we use a routine', () => {
      xit('should allow us to catch the error', () => {
        const s = state('foo');

        s.select('R', function*(value) {
          if (value === 'a-ha') {
            throw new Error('foo');
          }
          return value;
        });

        expect(() => sput(s, 'a-ha')).toThrowError('foo');
      });
      xit('should allow us to catch the error with a callback', done => {
        const s = state('foo');
        const error = new Error('foo');

        s.select(
          'R',
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

        sput(s, 'a-ha');
      });
    });
  });
  describe('when we have an error in a mutator', () => {
    xit('should allow us to catch the error', async () => {
      const s = state('foo');
      const error = new Error('ops');

      s.mutate('W', function() {
        throw error;
      });

      expect(() => sput('W', 'zoo')).toThrowError(error);
    });
    xit('should allow us to catch the error with a callback', done => {
      const s = state('foo');
      const error = new Error('ops');

      s.mutate(
        'W',
        function() {
          throw error;
        },
        e => {
          expect(e).toBe(error);
          done();
        }
      );

      sput('W', 'zoo');
    });
    describe('and we use a routine', () => {
      xit('should allow us to catch the error', async () => {
        const s = state('foo');
        const error = new Error('ops');

        s.mutate('W', function*() {
          throw error;
        });

        expect(() => sput('W', 'zoo')).toThrowError(error);
      });
      xit('should allow us to catch the error with a callback', done => {
        const s = state('foo');
        const error = new Error('ops');

        s.mutate(
          'W',
          function*() {
            throw error;
          },
          e => {
            expect(e).toBe(error);
            done();
          }
        );

        sput('W', 'zoo');
      });
    });
  });
});
