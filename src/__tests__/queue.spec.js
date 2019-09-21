import harvester from '../harvester';
import createQueue from '../queue';

describe('Given the createQueue helper', () => {
  beforeEach(() => {
    harvester.reset();
  });
  describe('when we create a queue', () => {
    it('should cycle over the items and call the appropriate callbacks', () => {
      const steps = [];
      const lifecycle = {
        out: jest.fn(),
        stepIn: jest.fn().mockImplementation((q) => steps.push([ q.result, 'in' ])),
        stepOut: jest.fn().mockImplementation((q) => steps.push([ q.result, 'out' ]))
      };
      const queueAPI = {
        foo: jest.fn().mockImplementation((q, func, payload, next) => next(func[0](q.result))),
        bar: jest.fn().mockImplementation((q, func, payload, next) => next(func[0](q.result)))
      };
      const setValue = jest.fn();
      const getValue = jest.fn().mockImplementation(() => 42);
      const q = createQueue(setValue, getValue, lifecycle, queueAPI);

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
      expect(lifecycle.out).toBeCalledTimes(1);
      expect(steps).toStrictEqual(
        [[42, 'in'], [52, 'out'], [52, 'in'], [57, 'out'], [57, 'in'], [75, 'out']]
      );
    });
  });
});
