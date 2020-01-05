/* eslint-disable no-shadow */
import clipboardy from 'clipboardy'; // <-- do not remove, used below
import { delay } from '../__helpers__';
import { logger, riew, sput, reset, chan, state, go, sleep } from '../index';
import expectation from './data/logger.spec.data.json';

function findItemAllFrames(itemId) {
  const filteredFrames = logger
    .frames()
    .filter(({ items }) => items.find(({ id }) => id === itemId))
    .map(({ items }) => items.find(({ id }) => id === itemId));

  if (filteredFrames.length > 0) {
    return filteredFrames;
  }
  return null;
}
function findItem(itemId) {
  const allFrames = findItemAllFrames(itemId);
  if (allFrames && allFrames.length > 0) {
    return allFrames.pop();
  }
  return null;
}

async function exercise() {
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
  const routine = function* RRR({ state, render }) {
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
  r.unmount();
  expect(viewSpy).toBeCalledWithArgs(['Value: 2'], ['Value: 5']);

  return { r };
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
    it('should create a snapshot that contains a routine', () => {
      const r = go(function* Test() {
        yield sleep(20);
      });
      expect(findItem(r.id)).toMatchObject({
        id: r.id,
        type: 'ROUTINE',
      });
    });
    fit('should create proper number of frames', async () => {
      await exercise();
      expect(
        logger.frames().map(({ what, who }) => `${who.id} ${what}`)
      ).toStrictEqual([
        'channel_view_myView_2 GRID_ITEM_ADDED',
        'channel_props_myView_3 GRID_ITEM_ADDED',
        'riew_myView_1 GRID_ITEM_ADDED',
        'state_5_read GRID_ITEM_ADDED',
        'state_5_write GRID_ITEM_ADDED',
        'state_5 GRID_ITEM_ADDED',
        'CCC GRID_ITEM_ADDED',
        'UUU GRID_ITEM_ADDED',
        'routine_RRR_4 GRID_ITEM_ADDED',
        'routine_transform_6 GRID_ITEM_ADDED',
        'YYY GRID_ITEM_ADDED',
        'state_5_read GRID_ITEM_REMOVED',
        'CCC GRID_ITEM_REMOVED',
        'state_5_write GRID_ITEM_REMOVED',
        'UUU GRID_ITEM_REMOVED',
        'state_5 GRID_ITEM_REMOVED',
        'channel_props_myView_3 GRID_ITEM_REMOVED',
        'channel_view_myView_2 GRID_ITEM_REMOVED',
        'riew_myView_1 GRID_ITEM_REMOVED',
      ]);
    });
    it('should return a snapshot containing the status of the system', async () => {
      await exercise();
      // 1. Uncomment the line below if this test fails.
      // 2. Run the test
      // 3. In the clipboard you'll have all the frames.
      // 4. Make sure that the data is ok and paste it in logger.spec.data.json
      // ------------------------------------------------------
      clipboardy.writeSync(JSON.stringify(logger.frames(), null, 2));
      expect(logger.frames()).toStrictEqual(expectation);
    });
  });
});
