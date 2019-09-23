import grid from '../grid';
import { state, reset } from '../index';

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
  describe('when we create a state', () => {
    it('should store the state as a node in the grid and remove it when we teardown the state', () => {
      const [ s1, , sInstance1 ] = state('foo');
      const [ s2, , sInstance2 ] = state('bar');

      expect(grid.nodes()).toStrictEqual([
        expect.objectContaining({ id: sInstance1.id }),
        expect.objectContaining({ id: sInstance2.id })
      ]);
      s1.destroy();
      s2.destroy();
      expect(grid.nodes()).toHaveLength(0);
    });
  });
});
