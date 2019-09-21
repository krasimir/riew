import { use, register, state, riew, harvester, logger } from '../index';
import loggerEvents from './data/logger.events.json';

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
  describe('when we want to see what happened', () => {
    it('should show us the events that happened', () => {
      const view = function MyView() {};
      const [ s1, setState1 ] = state('a');
      const controller = function myController() {};
      const r = riew(view, controller).with({ s1 });

      r.mount();
      setState1('foo');
      s1.map(value => value.toUpperCase()).mutate(value => value + 'BAR')();
      r.update({ x: 'y' });

      expect(logger.data.events()).toStrictEqual(loggerEvents);
    });
  });
  describe('when we want to see the grid', () => {
    fit('should shows us the grid', () => {
      const view = function MyView() {};
      const [ s1, setState1 ] = state('a');
      const controller = function myController({ state, render }) {
        const [ xxx ] = state('banana');

        render({ xxx });
      };
      const r = riew(view, controller).with({ s1 });

      r.mount();
      setState1('foo');
      s1.map(value => value.toUpperCase()).mutate(value => value + 'BAR')();
      r.update({ x: 'y' });
      r.unmount();

      logger.events();
      logger.grid();
    });
  });
});
