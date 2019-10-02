import grid from '../grid';
import { reset } from '../index';
import { implementObservableInterface } from '../interfaces';

describe('Given the riew library interfaces', () => {
  beforeEach(() => {
    reset();
  });
  describe('when we use implementObservableInterface helper', () => {
    it('should allow us to observe and emit events', () => {
      const objA = { id: 'a' };
      const objB = { id: 'b' };
      const spy = jest.fn();
      const gridSpy = jest.fn();

      implementObservableInterface(objA);
      implementObservableInterface(objB);

      objA.on('foo', spy);
      objB.on('foo', spy);
      grid.on('foo', gridSpy);

      objA.emit('foo', 'a', 'b');

      expect(spy).toBeCalledWithArgs([ 'a', 'b' ]);
      expect(gridSpy).toBeCalledWithArgs([ objA, 'a', 'b' ]);
    });
  });
});
