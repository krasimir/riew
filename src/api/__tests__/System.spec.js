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
  });
  describe('when we removeTasks', () => {
    it('should remove the tasks in the array', () => {
      const task1 = System.take('foo', () => {});
      const task2 = System.take('boo', () => {});

      expect(System.tasks).toHaveLength(2);
      System.removeTasks([ task1, task2 ]);
      expect(System.tasks).toHaveLength(0);
    });
  });
});
