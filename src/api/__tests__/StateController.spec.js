import createStateController from '../StateController';
import System from '../System';

describe('Given the StateController', () => {
  beforeEach(() => {
    System.reset();
  });
  describe('when we create the controller', () => {
    it('should accept an initial value and it should allow us to update the state', () => {
      const c = createStateController('foo');

      expect(c.get()).toEqual('foo');
      c.set('bar');
      expect(c.get()).toEqual('bar');
      expect(System.controllers).toHaveLength(1);
    });
    it('should remove the controller from System if we call destroy', () => {
      expect(System.controllers).toHaveLength(0);
      const c = createStateController('foo');

      expect(System.controllers).toHaveLength(1);
      c.destroy();
      expect(System.controllers).toHaveLength(0);
    });
  });
  describe('when we connect to a controller', () => {
    it('should call the subscriber callback when we change the state', () => {
      const spy = jest.fn();
      const c = createStateController('foo');

      c.connect(spy);
      c.set('bar');

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith('bar');
    });
    it('should should provide an api for unsubscribing', () => {
      const spy = jest.fn();
      const c = createStateController('foo');

      const unconnect = c.connect(spy);

      unconnect();
      c.set('bar');

      expect(spy).not.toBeCalled();
    });
  });
  describe('when we use a reducer', () => {
    it('should call the reducer if we put an action', () => {
      const spy = jest.fn();
      const c = createStateController(10, (oldValue, action) => {
        spy(oldValue, action);
        return oldValue + action.payload;
      });

      c.put('FOOBAR', 5);

      expect(spy).toBeCalledWith(10, { type: 'FOOBAR', payload: 5 });
      expect(c.get()).toEqual(15);
    });
  });
});
