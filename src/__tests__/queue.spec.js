import { reset } from '../index';
import { createQueue } from '../queue';
import { QUEUE_START, QUEUE_END, QUEUE_STEP_IN, QUEUE_STEP_OUT } from '../constants';

describe('Given the createQueue helper', () => {
  beforeEach(() => {
    reset();
  });
  describe('when we create a queue', () => {
    it('should cycle over the items and call the appropriate callbacks', () => {
      const steps = [];
      const setValue = jest.fn();
      const getValue = jest.fn().mockImplementation(() => 42);
      const q = createQueue({ set: setValue, get: getValue, on: () => {} }, { id: 'effect', items: [] });

      q.on(QUEUE_START, () => steps.push([ 'start', q.result ]));
      q.on(QUEUE_END, () => steps.push([ 'end', q.result ]));
      q.on(QUEUE_STEP_IN, () => steps.push([ 'stepIn', q.result ]));
      q.on(QUEUE_STEP_OUT, () => steps.push([ 'stepOut', q.result ]));

      q.add('map', [(value) => {
        return value + 10;
      }]);
      q.add('map', [(value) => {
        return value + 5;
      }]);
      q.add('map', [(value) => {
        return value + 18;
      }]);

      expect(q.process()).toEqual(75);
      expect(steps).toStrictEqual([
        [ 'start', 42 ],
        [ 'stepIn', 42 ],
        [ 'stepOut', 52 ],
        [ 'stepIn', 52 ],
        [ 'stepOut', 57 ],
        [ 'stepIn', 57 ],
        [ 'stepOut', 75 ],
        [ 'end', 75 ]
      ]);
    });
  });
  describe('when we cancel the state', () => {
    it('should cancel the queue', () => {
      let callback;
      const q = createQueue(
        {
          set: () => {},
          get: () => 'foo',
          on: (type, c) => (callback = c)
        },
        { id: 'effect', items: [] }
      );

      q.add('map', [() => {}]);

      expect(q.items).toHaveLength(1);
      callback();
      expect(q.items).toHaveLength(0);
    });
  });
});
