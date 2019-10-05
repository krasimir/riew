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
      const type = 'foo';
      const target = { id: 'YYY' };
      const source = { id: 'XXX' };

      grid.subscribe(target).to(source).when(type, spy);
      grid.emit(type).from(source).with('a', 'b');

      expect(spy).toBeCalledWithArgs(
        [ 'a', 'b' ]
      );
    });
    it('should allow us unsubscribe', () => {
      const spy = jest.fn();
      const target = { id: 'YYY' };
      const source = { id: 'XXX' };

      grid.subscribe(target).to(source).when('foo', spy).unsubscribe;
      grid.unsubscribe(target).from(source);
      grid.emit(source, 'foo', 'a', 'b');

      expect(spy).not.toBeCalled();
    });
    it('should subscribe only once when we use the same target and source', () => {
      const spy = jest.fn();
      const type = 'foo';
      const target = { id: 'YYY' };
      const source = { id: 'XXX' };

      grid.subscribe(target).to(source).when(type, spy);
      grid.subscribe(target).to(source).when(type, spy);
      grid.subscribe(target).to(source).when(type, spy);
      grid.subscribe(target).to(source).when(type, spy);

      grid.emit(type).from(source).with('a', 'b');

      expect(spy).toBeCalledWithArgs(
        ['a', 'b']
      );
    });
    it('should allow us to subscribe without target and source', () => {
      const type = 'foo';
      const spy = jest.fn();

      grid.subscribe().when(type, spy);
      grid.emit(type).with('a', 'b');

      expect(spy).toBeCalledWithArgs(
        ['a', 'b']
      );
    });
  });
});
