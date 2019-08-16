import state from '../state';
import System from '../System';
import { delay } from '../../__helpers__';

describe('Given the StateController', () => {
  beforeEach(() => {
    System.reset();
  });
  describe('when we create a state', () => {
    it(`should
      * accept an initial value and it should allow us to update the state
      * create a dedicated task`, () => {
      const c = state('foo');

      expect(c()).toEqual('foo');
      c('bar');
      expect(c()).toEqual('bar');
      expect(System.tasks).toHaveLength(1);
    });
  });
  describe('when we subscribe to a state', () => {
    it('should call the subscriber callback when we change the value', () => {
      const spy = jest.fn();
      const c = state('foo');

      c.subscribe(spy);
      c('bar');

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith('bar');
    });
    it('should provide an api for unsubscribing', () => {
      const spy = jest.fn();
      const c = state('foo');

      const unsubscribe = c.subscribe(spy);

      unsubscribe();
      c('bar');

      expect(spy).not.toBeCalled();
    });
  });
  describe('when we teardown the state', () => {
    it('should unsubscribe all the subscribers and set the value to undefined', () => {
      const spy = jest.fn();
      const c = state('foo');

      c.subscribe(spy);
      c.teardown();

      expect(c()).toBe(undefined);
      expect(c.__subscribers()).toHaveLength(0);
    });
  });
  describe('when we define a mutation', () => {
    it(`should
    * return a function that if fired will run the reducer
    * create a task for listening on that particular action`, () => {
      const s = state(10);

      const add = s.mutation((currentValue, payload) => currentValue + payload, 'foo', 'bar');

      System.put('bar', 6);
      add(20);
      System.put('foo', 5);

      expect(s()).toBe(41);
      expect(System.tasks).toHaveLength(3);
      s.teardown();
      expect(System.tasks).toHaveLength(0);
    });
    describe('and the mutation is async', () => {
      it(`should
        * wait till the mutation is over
        * wait if there is another mutation running at the moment`, async () => {
        const s = state(10);
        const add = s.mutation(
          async (currentValue, payload) => {
            await delay(5);
            return currentValue + payload;
          },
          'foo',
          'bar'
        );

        add(20);
        System.put('foo', 5);
        System.put('bar', 6);

        await delay(20);

        expect(s()).toBe(41);
        expect(System.tasks).toHaveLength(3);
        s.teardown();
        expect(System.tasks).toHaveLength(0);
      });
      it('should return a promise for when we call the mutation function', (done) => {
        const s = state(10);
        const add = s.mutation(
          async (currentValue, payload) => {
            await delay(5);
            return currentValue + payload;
          }
        );
        const minus = s.mutation(async (currentValue, payload) => {
          await delay(5);
          return currentValue - payload;
        });

        Promise.all([
          add(5),
          minus(1),
          minus(1)
        ]).then(() => {
          expect(s()).toBe(13);
          done();
        });
      });
    });
  });
});
