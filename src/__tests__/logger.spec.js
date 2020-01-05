/* eslint-disable no-shadow */
import { delay } from '../__helpers__';
import { logger, riew, sput, reset, chan, state } from '../index';
import expectation from './data/logger.spec.data.json';

function findItem(itemId) {
  const filteredFrames = logger
    .frames()
    .filter(({ items }) => items.find(({ id }) => id === itemId));

  if (filteredFrames.length > 0) {
    const frame = filteredFrames.pop();
    return frame.items.find(({ id }) => id === itemId);
  }
  return null;
}

describe('Given the logger', () => {
  describe('and we call the `snapshot` method', () => {
    beforeEach(() => {
      reset();
    });
    it('should create a snapshot that contains a riew', () => {
      const r = riew(() => {});
      expect(findItem(r.id)).toMatchObject({
        id: r.id,
        type: 'RIEW',
      });
    });
    it('should create a snapshot that contains a channel', () => {
      const c = chan('FOO');
      expect(findItem(c.id)).toMatchObject({
        id: 'FOO',
        type: 'CHANNEL',
      });
    });
    it('should create a snapshot that contains a state', () => {
      const s = state(42);
      expect(findItem(s.id)).toMatchObject({
        id: s.id,
        type: 'STATE',
        value: 42,
      });
    });
    xit('should return a snapshot containing the status of the system', async () => {
      const viewSpy = jest.fn();
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

      r.mount({ a: 'b' });
      r.update({ c: 'd' });

      await delay(20);
      expect(viewSpy).toBeCalledWithArgs(['Value: 2'], ['Value: 5']);
      expect(logger.frames()).toStrictEqual(expectation);
    });
  });
});
