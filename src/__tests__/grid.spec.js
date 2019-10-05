import grid from '../grid';
import { reset } from '../index';

describe('Given the grid', () => {
  beforeEach(() => {
    reset();
  });
  describe('when we use the grid', () => {
    it('should store products and let us free resources', () => {
      const obj = { id: 'foo', something: 'else' };
      const obj2 = { id: 'bar' };
      const obj3 = { id: 'moo' };

      grid.add(obj);
      grid.add(obj2);
      grid.add(obj3);
      expect(grid.nodes()).toHaveLength(3);
      grid.remove(obj);
      grid.remove(obj2);
      grid.remove(obj3);
      expect(grid.nodes()).toHaveLength(0);
    });
  });
  describe('when we want to observe events', () => {
    it('should allow us to subscribe and emit events', () => {
      const spy = jest.fn();
      const source = { id: 'XXX' };

      grid.subscribe(source, 'foo', spy);
      grid.emit(source, 'foo', 'a', 'b');

      expect(spy).toBeCalledWithArgs(
        [ 'a', 'b' ]
      );
    });
    it('should allow us to remove the listener', () => {
      const spy = jest.fn();
      const source = { id: 'XXX' };

      const unsubscribe = grid.subscribe(source, 'foo', spy);

      unsubscribe();
      grid.emit(source, 'foo', 'a', 'b');

      expect(spy).not.toBeCalled();
    });
  });
});
