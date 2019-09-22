import { reset } from '../index';
import { createQueue } from '../queue';

describe('Given the createQueue helper', () => {
  beforeEach(() => {
    reset();
  });
  describe('when we create a queue', () => {
    it('should cycle over the items and call the appropriate callbacks', () => {
      const steps = [];
      const queueAPI = {
        foo: jest.fn().mockImplementation((q, func, payload, next) => next(func[0](q.result))),
        bar: jest.fn().mockImplementation((q, func, payload, next) => next(func[0](q.result)))
      };
      const setValue = jest.fn();
      const getValue = jest.fn().mockImplementation(() => 42);
      const emit = jest.fn().mockImplementation((type, q) => {
        steps.push([ type, q.result ]);
      });
      const q = createQueue({ set: setValue, get: getValue, queueAPI }, emit);

      q.add('foo', [(value) => {
        return value + 10;
      }]);
      q.add('foo', [(value) => {
        return value + 5;
      }]);
      q.add('bar', [(value) => {
        return value + 18;
      }]);

      expect(q.process()).toEqual(75);
      expect(steps).toStrictEqual([
        [ 'QUEUE_START', 42 ],
        [ 'QUEUE_STEP_IN', 42 ],
        [ 'QUEUE_STEP_OUT', 52 ],
        [ 'QUEUE_STEP_IN', 52 ],
        [ 'QUEUE_STEP_OUT', 57 ],
        [ 'QUEUE_STEP_IN', 57 ],
        [ 'QUEUE_STEP_OUT', 75 ],
        [ 'QUEUE_END', 75 ]
      ]);
    });
  });
});
