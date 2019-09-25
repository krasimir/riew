import { state, riew, reset, grid } from '../index';
import { delay } from '../__helpers__';
import logger from 'riew-logger';

describe('Given the logger', () => {
  beforeEach(() => {
    reset();
  });
  describe('when we want to see what happened', () => {
    fit('should show us the events that were emitted', async () => {
      logger.setup(grid);
      logger.on((type) => {
        logger.toConsole();
      });

      const view = function MyView() {};
      const [ s1, setState1 ] = state('a');
      const controller = function myController() {};
      const r = riew(view, controller).with({ s1 });
      const op1 = s1.map(async value => {
        await delay(5);
        return value.toUpperCase();
      }).mutate(value => value + 'BAR');
      const op2 = s1.pipe(async () => {
        await delay(6);
      });

      r.mount();
      setState1('foo');
      op1();
      op1();
      op2();
      r.update({ x: 'y' });

      await delay(10);
      // logger.toConsole();

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