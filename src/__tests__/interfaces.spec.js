import { reset } from '../index';
import { implementObservableInterface } from '../interfaces';

describe('Given the riew library interfaces', () => {
  beforeEach(() => {
    reset();
  });
  describe('when we use implementObservableInterface helper', () => {
    it('should allow us to observe and emit events', () => {
      const type = 'foo';
      const objA = { id: 'a' };
      const objB = { id: 'b' };
      const spy = jest.fn();

      implementObservableInterface(objA);
      implementObservableInterface(objB);

      objA.on(type, spy);
      objB.on(type, spy);
      objA.emit(type, 'a', 'b');

      expect(spy).toBeCalledWithArgs([ 'a', 'b' ]);
    });
    it('should allow us kill all the listeners for given source', () => {
      const type = 'foo';
      const objA = { id: 'a' };
      const spy = jest.fn();

      implementObservableInterface(objA);

      objA.on(type, spy);
      objA.off();
      objA.emit(type, 'a', 'b');

      expect(spy).not.toBeCalled();
    });
  });
});
