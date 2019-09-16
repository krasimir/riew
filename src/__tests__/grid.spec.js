import grid from '../grid';
import { createState as state } from '../state';

describe('Given the grid', () => {
  beforeEach(() => {
    grid.reset();
  });
  describe('when we use the grid', () => {
    it('should store stuff for us and let us free resources', () => {
      const obj = { id: 'foo', something: 'else' };

      grid.add(obj);
      expect(grid.get('foo')).toStrictEqual(obj);
      grid.free('foo');
      expect(() => grid.get('foo')).toThrowError('A node with identifier "foo" is missing in the grid.');
      expect(() => grid.get('something')).toThrowError('A node with identifier "something" is missing in the grid.');
    });
  });
  describe('when set a name of a node', () => {
    it('should let us fetch the node by name', () => {
      const obj = { id: 'foo', something: 'else' };

      grid.add(obj);
      grid.name(obj, 'myObj');
      expect(grid.get('myObj')).toStrictEqual(obj);
    });
  });
  describe('when we create a state', () => {
    it('should store the state as a node part of the grid and remove it when we teardown the state', () => {
      const s1 = state('foo');
      const s2 = state('bar');

      expect(grid.nodes()).toStrictEqual([
        expect.objectContaining({ id: s1.state.id }),
        expect.objectContaining({ id: s2.state.id })
      ]);
      s1.teardown();
      s2.teardown();
      expect(grid.nodes()).toHaveLength(0);
    });
  });
});
