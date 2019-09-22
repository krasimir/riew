import { state, riew, logger, reset } from '../index';

describe('Given the logger', () => {
  beforeEach(() => {
    reset();
  });
  describe('when we want to see what happened', () => {
    it('should show us the events that were emitted', () => {
      const view = function MyView() {};
      const [ s1, setState1 ] = state('a');
      // const controller = function myController() {};
      // const r = riew(view, controller).with({ s1 });

      console.log(JSON.stringify(logger.events(), null, 2));

      // r.mount();
      // setState1('foo');
      // s1.map(value => value.toUpperCase()).mutate(value => value + 'BAR')();
      // r.update({ x: 'y' });

      // expect(logger.data.events()).toStrictEqual(loggerEvents);
    });
  });
  xdescribe('when we want to see the grid', () => {
    it('should shows us the grid', () => {
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
      // logger.grid();
      r.unmount();
      // logger.events();
    });
  });
});
