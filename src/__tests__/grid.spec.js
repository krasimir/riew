import grid from '../grid';
import { state, reset } from '../index';

describe('Given the grid', () => {
  beforeEach(() => {
    reset();
  });
  describe('when we use the grid', () => {
    it('should store stuff for us and let us free resources', () => {
      const obj = { id: 'foo', something: 'else' };
      const obj2 = { id: 'bar' };
      const obj3 = { id: 'moo' };

      grid.add(obj);
      grid.add(obj2, obj.id);
      grid.add(obj3, obj2.id);
      expect(grid.get('foo')).toStrictEqual(obj);
      grid.remove(obj);
      expect(() => grid.get('foo')).toThrowError('A node with identifier "foo" is missing in the grid.');
      expect(() => grid.get('bar')).toThrowError('A node with identifier "bar" is missing in the grid.');
      expect(() => grid.get('moo')).toThrowError('A node with identifier "moo" is missing in the grid.');
      expect(() => grid.get('something')).toThrowError('A node with identifier "something" is missing in the grid.');
    });
  });
  describe('when we create a state', () => {
    it('should store the state as a node in the grid and remove it when we teardown the state', () => {
      const s1 = state('foo');
      const s2 = state('bar');

      expect(grid.nodes()).toStrictEqual([
        expect.objectContaining({ product: expect.objectContaining({ id: s1.state.id }) }),
        expect.objectContaining({ product: expect.objectContaining({ id: s1.id }) }),
        expect.objectContaining({ product: expect.objectContaining({ id: s2.state.id }) }),
        expect.objectContaining({ product: expect.objectContaining({ id: s2.id }) })
      ]);
      s1.destroy();
      s2.destroy();
      expect(grid.nodes()).toHaveLength(0);
    });
  });
});
