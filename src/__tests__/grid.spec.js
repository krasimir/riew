import { gridAddNode, gridDestroy, gridReset, gridSetNodeName, gridGetNode, gridGetNodes } from '../grid';
import { createState as state } from '../state';

describe('Given the grid', () => {
  beforeEach(() => {
    gridReset();
  });
  describe('when we use the grid', () => {
    it('should store stuff for us and let us free resources', () => {
      const obj = { id: 'foo', something: 'else' };

      gridAddNode(obj);
      expect(gridGetNode('foo')).toStrictEqual(obj);
      gridDestroy('foo');
      expect(() => gridGetNode('foo')).toThrowError('A node with identifier "foo" is missing in the grid.');
      expect(() => gridGetNode('something')).toThrowError('A node with identifier "something" is missing in the grid.');
    });
  });
  describe('when set a name of a node', () => {
    it('should let us fetch the node by name', () => {
      const obj = { id: 'foo', something: 'else' };

      gridAddNode(obj);
      gridSetNodeName(obj, 'myObj');
      expect(gridGetNode('myObj')).toStrictEqual(obj);
    });
  });
  describe('when we create a state', () => {
    it('should store the state as a node part of the grid and remove it when we teardown the state', () => {
      const s1 = state('foo');
      const s2 = state('bar');

      expect(gridGetNodes()).toStrictEqual([
        expect.objectContaining({ id: s1.state.id }),
        expect.objectContaining({ id: s2.state.id })
      ]);
      s1.teardown();
      s2.teardown();
      expect(gridGetNodes()).toHaveLength(0);
    });
  });
});
