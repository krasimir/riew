import { reset } from '../index';
import { createQueue } from '../queue';

describe('Given the createQueue helper', () => {
  beforeEach(() => {
    reset();
  });
  describe('when we create a queue', () => {
    it('should cycle over the items, call the appropriate callbacks and fire onDone function when it finishes', () => {
      const spy = jest.fn();
      const q = createQueue(
        42,
        {
          id: 'effect',
          items: []
        },
        spy
      );

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
      expect(spy).toBeCalledTimes(1);
    });
  });
  describe('when we cancel queue', () => {
    it('should empty the items in the queue', () => {
      const q = createQueue(
        'foo',
        { id: 'effect', items: [] },
        () => {}
      );

      q.add('map', [() => {}]);

      expect(q.items).toHaveLength(1);
      q.cancel();
      expect(q.items).toHaveLength(0);
    });
  });
});
