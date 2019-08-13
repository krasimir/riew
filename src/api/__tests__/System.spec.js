import System from '../System';

describe('Given System', () => {
  beforeEach(() => {
    System.reset();
  });
  describe('when we add a task', () => {
    it('should resolve it when the action is fired (via promise interface)', (done) => {
      System.take('foo').done.then(payload => {
        expect(payload).toBe('bar');
        done();
      });
      System.put('foo', 'bar');
      expect(System.tasks).toHaveLength(0);
    });
    it('should resolve it when the action is fired (via callback interface)', (done) => {
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
    it('should support an array of types', () => {
      const spy = jest.fn();

      System.take(['foo', 'bar'], spy);
      System.takeEvery(['foo', 'bar'], spy);
      System.put('foo');
      System.put('bar');

      expect(spy).toBeCalledTimes(4);
    });
  });
  describe('when we removeTask', () => {
    it('should remove the tasks in the array', () => {
      const task1 = System.take('foo', () => {});
      const task2 = System.take('boo', () => {});

      expect(System.tasks).toHaveLength(2);
      System.removeTask(task1);
      System.removeTask(task2);
      expect(System.tasks).toHaveLength(0);
    });
  });
  describe('when we use a wildcard', () => {
    it('should fire the task no matter what is the type of the action', () => {
      const spy1 = jest.fn();
      const spy2 = jest.fn();

      System.take('*', spy1);
      System.takeEvery('*', spy2);
      System.put('foo', 1);
      System.put('bar', 2);

      expect(spy1).toBeCalledTimes(1);
      expect(spy2).toBeCalledTimes(2);
      expect(System.tasks).toHaveLength(1);
      expect(spy1.mock.calls[0]).toStrictEqual([ 1, 'foo' ]);
      expect(spy2.mock.calls[0]).toStrictEqual([ 1, 'foo' ]);
      expect(spy2.mock.calls[1]).toStrictEqual([ 2, 'bar' ]);
    });
  });
});
