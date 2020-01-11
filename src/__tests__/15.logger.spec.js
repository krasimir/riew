/* eslint-disable no-shadow */
import clipboardy from 'clipboardy'; // <-- do not remove, used below
import { delay } from '../__helpers__';
import { logger, riew, sput, reset, chan, state, go, sleep } from '../index';
import expectation1 from './data/logger.spec.data1.json';
import expectation2 from './data/logger.spec.data2.json';
import expectationRiew from './data/logger.spec.riew.json';

function findItemAllFrames(itemId) {
  const filteredFrames = logger
    .frames()
    .filter(({ state }) => state.find(({ id }) => id === itemId))
    .map(({ state }) => state.find(({ id }) => id === itemId));

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
  beforeEach(() => {
    reset();
  });
  describe('and we call the `frame` method', () => {
    xit('should create a snapshot that contains a riew', async () => {
      const r = riew(() => {});
      await delay();
      expect(findItem(r.id)).toMatchObject({
        id: r.id,
        type: 'RIEW',
      });
    });
    xit('should create a snapshot that contains a channel', async () => {
      const c = chan('FOO');
      await delay();
      expect(findItem(c.id)).toMatchObject({
        id: 'FOO',
        type: 'CHANNEL',
      });
    });
    xit('should create a snapshot that contains a state', async () => {
      const s = state(42);
      await delay();
      expect(findItem(s.id)).toMatchObject({
        id: s.id,
        type: 'STATE',
        value: 42,
      });
    });
    xit('should create a snapshot that contains a routine', async () => {
      const r = go(function* Test() {
        yield sleep(20);
      });
      await delay(30);
      expect(findItem(r.id)).toMatchObject({
        id: r.id,
        type: 'ROUTINE',
      });
    });
    xit('should create proper number of frames', async () => {
      await exercise();
      const logs = logger.frames().map(frame => frame.actions);
      // 1. Uncomment the line below if this test fails.
      // 2. Run the test
      // 3. In the clipboard you'll have all the frames.
      // 4. Make sure that the data is ok and paste it in logger.spec.data.json
      // ------------------------------------------------------
      // clipboardy.writeSync(JSON.stringify(logs, null, 2));
      expect(logs).toStrictEqual(expectation1);
    });
    xit('should return a snapshot containing the status of the system', async () => {
      await exercise();
      await delay();
      // clipboardy.writeSync(JSON.stringify(logger.frames(), null, 2));
      expect(logger.frames()).toStrictEqual(expectation2);
    });
  });

  // riew

  describe('when we have a riew', async () => {
    fxit(
      `should log
      * RIEW_RENDERED
      * RIEW_MOUNTED
      * RIEW_UNMOUNTED
      * RIEW_UPDATED
      * RIEW_CREATED
      `,
      async () => {
        const r = riew(() => {});
        r.mount({ a: 'b' });
        r.update({ c: 'd' });
        await delay();
        r.unmount();
        await delay();
        // clipboardy.writeSync(JSON.stringify(logger.frames(), null, 2));
        expect(logger.frames()).toStrictEqual(expectationRiew);
      }
    );
  });
});
