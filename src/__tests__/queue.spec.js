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
      const q = createQueue({ set: setValue, get: getValue, queueAPI }, {
        start() {
          steps.push([ 'start', q.result ]);
        },
        end() {
          steps.push([ 'end', q.result ]);
        },
        stepIn() {
          steps.push([ 'stepIn', q.result ]);
        },
        stepOut() {
          steps.push([ 'stepOut', q.result ]);
        }
      });

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
});
