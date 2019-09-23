import { state, riew, logger, reset } from '../index';

describe('Given the logger', () => {
  beforeEach(() => {
    reset();
  });
  describe('when we want to see what happened', () => {
    fit('should show us the events that were emitted', () => {
      const spy = jest.fn();

      // logger.on(spy);

      const view = function MyView() {};
      const [ s1, setState1 ] = state('a');
      const controller = function myController() {};
      const r = riew(view, controller).with({ s1 });

      r.mount();
      setState1('foo');
      // s1.map(value => value.toUpperCase()).mutate(value => value + 'BAR')();
      // r.update({ x: 'y' });

      logger.toConsole();

      // console.log(JSON.stringify(spy.mock.calls, null, 2));
      // console.log(JSON.stringify(spy.mock.calls[spy.mock.calls.length - 1][1], null, 2));
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
