import { gridAdd, gridFreeNode, gridGetNode, gridGetNodes } from '../grid';
import { state } from '../index';
import harvester from '../harvester';

describe('Given the grid', () => {
  beforeEach(() => {
    harvester.reset();
  });
  describe('when we use the grid', () => {
    it('should store stuff for us and let us free resources', () => {
      const obj = { id: 'foo', something: 'else' };

      gridAdd(obj);
      expect(gridGetNode('foo')).toStrictEqual(obj);
      gridFreeNode(obj);
      expect(() => gridGetNode('foo')).toThrowError('A node with identifier "foo" is missing in the grid.');
      expect(() => gridGetNode('something')).toThrowError('A node with identifier "something" is missing in the grid.');
    });
  });
  describe('when we create a state', () => {
    it('should store the state as a node in the grid and remove it when we teardown the state', () => {
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
