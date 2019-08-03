import System from '../System';

describe('Given System', () => {
  beforeEach(() => {
    System.reset();
  });
  describe('when we add and remove a controller', () => {
    it('should keep and remove the controller from its internal storage', () => {
      const controller = { id: 'foo' };

      System.addController(controller);
      expect(System.controllers).toHaveLength(1);
      System.removeController(controller);
      expect(System.controllers).toHaveLength(0);
    });
  });
  describe('when we add a task', () => {
    it('should resolve it when the action is fired', (done) => {
      System.take('foo').then(payload => {
        expect(payload).toBe('bar');
        done();
      });
      System.put('foo', 'bar');
      expect(System.tasks).toHaveLength(0);
    });
    it('should resolve it when the action is fired (with callback)', (done) => {
      System.take('foo', payload => {
        expect(payload).toBe('bar');
        done();
      });
      System.put('foo', 'bar');
      expect(System.tasks).toHaveLength(0);
    });
    it('should resolve it multiple times if we use takeEvery', () => {
      const mock = jest.fn();

      System.takeEvery('foo', mock);
      System.put('foo', 100);
      System.put('foo', 200);

      expect(mock).toBeCalledTimes(2);
      expect(mock.mock.calls[0]).toStrictEqual([100]);
      expect(mock.mock.calls[1]).toStrictEqual([200]);
      expect(System.tasks).toHaveLength(1);
    });
    it('should remove the task if it is associated with a removed controller', () => {
      const controller = { id: 'foo' };

      System.take('foo', () => {}, controller);
      System.addController(controller);

      expect(System.tasks).toHaveLength(1);
      expect(System.controllers).toHaveLength(1);
      System.removeController(controller);
      expect(System.tasks).toHaveLength(0);
      expect(System.controllers).toHaveLength(0);
    });
  });
});
