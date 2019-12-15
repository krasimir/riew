import { go, state, sput, reset } from '../index';
import { delay } from '../__helpers__';

describe('Given csp features', () => {
  beforeEach(() => {
    reset();
  });
  describe('when we have an error inside a routine', () => {
    it('should allow us to catch the error', () => {
      expect(() => {
        go(function * () {
          throw new Error('boo');
        });
      }).toThrowError('boo');
    });
  });
  describe('when we yield a promise and it gets rejected', () => {
    it('should pass back the error to the routine', async () => {
      const error = new Error('ops');

      go(function * () {
        try {
          yield new Promise((_, reject) => setTimeout(() => reject(error), 10));
        } catch (e) {
          expect(e).toBe(error);
        }
      });
      await delay(20);
    });
  });
  describe('when we have an error inside the state selectors', () => {
    it('should allow us to catch the error', () => {
      const s = state('foo');

      s.select('R', function (value) {
        if (value === 'a-ha') {
          throw new Error('foo');
        }
        return value;
      });

      expect(() => sput(s.WRITE, 'a-ha')).toThrowError('foo');
    });
    it('should allow us to catch the error with a callback', done => {
      const s = state('foo');
      const error = new Error('foo');

      s.select(
        'R',
        function (value) {
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

      sput(s.WRITE, 'a-ha');
    });
    describe('and when we have am async mutator', () => {
      it('should allow us to catch the error', done => {
        const s = state('foo');
        const error = new Error('a-ha');

        s.select(
          'R',
          () => {
            throw error;
          },
          e => {
            expect(e).toBe(error);
            done();
          }
        );
        s.mutate('W', async function (_, value) {
          return value;
        });
        sput('W');
      });
    });
  });
  describe('when we have an error inside the state mutator', () => {
    it('should allow us to catch the error', done => {
      const s = state('foo');
      const error = new Error('a-ha');

      s.mutate(
        'W',
        async function (value) {
          throw error;
        },
        e => {
          expect(e).toBe(error);
          done();
        }
      );
      sput('W');
    });
  });
  describe('when we have an error in a routine used as part of a state mutation', () => {
    it('should wait till the routine is gone', async () => {
      const s = state('foo');
      const error = new Error('ops');

      s.mutate('W', function * (current, newOne) {
        throw error;
      });

      expect(() => sput('W', 'zoo')).toThrowError(error);
    });
  });
});
