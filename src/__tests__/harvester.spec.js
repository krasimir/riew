import { use, register, state, riew, harvester, logger } from '../index';

describe('Given the harvester', () => {
  beforeEach(() => {
    harvester.reset();
  });
  describe('when we register something in there', () => {
    it('should let us use it later', () => {
      const myFunc = () => 42;

      register('foo', myFunc);
      expect(use('foo')()).toBe(42);
      expect(() => register('foo', 'bar')).toThrowError('An entry with name "foo" already exists.');
    });
  });
  describe('when we want to display what to see what happened', () => {
    it('should show us the events that happened', () => {
      const view = jest.fn();
      const [ s1, setState1 ] = state('a');
      const controller = function myController() {};
      const r = riew(view, controller).with({ s1 });

      r.mount();
      // setState1('foo');
      // r.update({ x: 'y' });

      logger.events();
    });
  });
});
