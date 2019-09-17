import { gridAdd, gridFreeNode, gridReset, gridGetNode, gridGetNodes, gridGetEvents, GRID_NAME } from '../grid';
import { createState as state } from '../state';
import { default as riew } from '../riew';

describe('Given the grid', () => {
  beforeEach(() => {
    gridReset();
  });
  describe('when we use the grid', () => {
    it('should store stuff for us and let us free resources', () => {
      const obj = { id: 'foo', something: 'else' };

      gridAdd(obj);
      expect(gridGetNode('foo')).toStrictEqual(obj);
      gridFreeNode('foo');
      expect(() => gridGetNode('foo')).toThrowError('A node with identifier "foo" is missing in the grid.');
      expect(() => gridGetNode('something')).toThrowError('A node with identifier "something" is missing in the grid.');
    });
  });
  describe('when set a name of a node', () => {
    it('should let us fetch the node by name', () => {
      const obj = { id: 'foo', something: 'else', [GRID_NAME]: 'myObj' };

      gridAdd(obj);
      expect(gridGetNode('myObj')).toStrictEqual(obj);
    });
  });
  describe('when we create a state', () => {
    it('should store the state as a node in the grid and remove it when we teardown the state', () => {
      const s1 = state('foo');
      const s2 = state('bar');

      expect(gridGetNodes()).toStrictEqual([
        expect.objectContaining({ id: s1.state.id }),
        expect.any(Function),
        expect.objectContaining({ id: s2.state.id }),
        expect.any(Function)
      ]);
      s1.teardown();
      s2.teardown();
      expect(gridGetNodes()).toHaveLength(0);
    });
  });
  describe('when we want to display what to see what happened', () => {
    it('should show us the events that happened', () => {
      const view = jest.fn();
      const [ s1, setState1 ] = state('a');
      const controller = jest.fn();
      const r = riew(view, controller).with({ s1 });

      r.mount();
      setState1('foo');
      r.update({ x: 'y' });

      // console.log(gridGetEvents());
    });
  });
});
