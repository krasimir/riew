import createState, { teardownAction } from '../state';
import System from '../System';

describe('Given the StateController', () => {
  beforeEach(() => {
    System.reset();
  });
  describe('when we create a state', () => {
    it(`should
      * accept an initial value and it should allow us to update the state
      * create a dedicated task`, () => {
      const c = createState('foo');

      expect(c.get()).toEqual('foo');
      c.set('bar');
      expect(c.get()).toEqual('bar');
      expect(System.tasks).toHaveLength(1);
    });
  });
  describe('when we subscribe to a state', () => {
    it('should call the subscriber callback when we change the value', () => {
      const spy = jest.fn();
      const c = createState('foo');

      c.subscribe(spy);
      c.set('bar');

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith('bar');
    });
    it('should provide an api for unsubscribing', () => {
      const spy = jest.fn();
      const c = createState('foo');

      const unsubscribe = c.subscribe(spy);

      unsubscribe();
      c.set('bar');

      expect(spy).not.toBeCalled();
    });
  });
  describe('when we teardown the state', () => {
    it('should unsubscribe all the subscribers and set the value to undefined', () => {
      const spy = jest.fn();
      const c = createState('foo');

      c.subscribe(spy);
      c.teardown();

      expect(c.get()).toBe(undefined);
      expect(c.__subscribers()).toHaveLength(0);
    });
  });
  describe('when we use a reducer', () => {
    it('should call the reducer if we put an action', () => {
      const spy = jest.fn();
      const c = createState(10, (oldValue, action) => {
        spy(oldValue, action);
        return oldValue + action.payload;
      });

      c.put('FOOBAR', 5);

      expect(spy).toBeCalledWith(10, { type: 'FOOBAR', payload: 5 });
      expect(c.get()).toEqual(15);
    });
    it(`should
      * call the reducer if a System.put is called
      * remove the reducer task if the state is teardown`, () => {
      const spy = jest.fn();
      const c = createState(10, (oldValue, action) => {
        spy(oldValue, action);
        return oldValue + action.payload;
      });

      System.put('FOOBAR', 5);

      expect(spy).toBeCalledWith(10, { type: 'FOOBAR', payload: 5 });
      expect(c.get()).toEqual(15);
      expect(System.tasks).toHaveLength(2);
      System.put(teardownAction(c.id));
      expect(System.tasks).toHaveLength(0);
    });
  });
});
