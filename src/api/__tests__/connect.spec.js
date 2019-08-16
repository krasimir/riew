import System from '../System';
import state from '../state';
import connect from '../connect';

describe('Given the connect method', () => {
  beforeEach(() => {
    System.reset();
  });
  describe('when call it', () => {
    it(`should
      * fire the callback at least once
      * fire the callback on every state change
      * pass any additional props that we send
      * return a clean up function`, () => {
      const spy = jest.fn();
      const A = state('a');
      const B = state('b');

      const cleanup = connect({ a: A, b: B, foo: 'bar' }, spy);

      A.set('c');
      B.set('d');
      cleanup();
      A.set('e');
      B.set('e');

      expect(spy).toBeCalledTimes(3);
      expect(spy.mock.calls[0]).toStrictEqual([ { a: 'a', b: 'b', foo: 'bar' }]);
      expect(spy.mock.calls[1]).toStrictEqual([ { a: 'c', b: 'b', foo: 'bar' }]);
      expect(spy.mock.calls[2]).toStrictEqual([ { a: 'c', b: 'd', foo: 'bar' }]);
      expect(A.__subscribers()).toHaveLength(0);
      expect(B.__subscribers()).toHaveLength(0);
    });
  });
  describe('when we connect to state that do not change', () => {
    it('should not fire the callback', () => {
      const spy = jest.fn();
      const s = state('b');
      const s2 = state('c');

      s.mutation((current, mewValue) => {
        return mewValue;
      }, 'update b');

      connect({ value: s2 }, spy);

      System.put('update b', 'new value of b');

      expect(s()).toBe('new value of b');
      expect(s2()).toBe('c');
      expect(spy).toBeCalledTimes(1);
      expect(spy.mock.calls[0]).toStrictEqual([ { value: 'c' }]);
    });
  });
});
