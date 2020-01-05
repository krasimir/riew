import { delay } from '../__helpers__';
import { logger, riew, sput } from '../index';

describe('Given the logger', () => {
  describe('and we call the `snapshot` method', () => {
    it('should return a snapshot containing the status of the system', async () => {
      const viewSpy = jest.fn();
      const loggerSnapshots = jest.fn();
      const myView = function({ value, update, pointless }) {
        if (value === 'Value: 2') {
          setTimeout(() => {
            update(3);
            pointless();
          }, 10);
        }
        viewSpy(value);
      };
      const routine = function*({ state, render }) {
        const counter = state(2);

        counter.select('CCC', value => `Value: ${value}`);
        counter.mutate('UUU', (current, n) => current + n);

        render({ value: 'CCC', update: n => sput('UUU', n) });
      };
      const r = riew(myView, routine).with({
        pointless: () => sput('YYY', 'Hey'),
      });
      loggerSnapshots(logger.snapshot());

      r.mount();
      loggerSnapshots(logger.snapshot());

      await delay(20);
      loggerSnapshots(logger.snapshot());
      expect(viewSpy).toBeCalledWithArgs(['Value: 2'], ['Value: 5']);
      // expect(loggerSnapshots).toBeCalledWithArgs();
    });
  });
});
