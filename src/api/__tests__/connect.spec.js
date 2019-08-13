import System from '../System';
import state from '../state';

import { connect } from '../connect';

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
  describe('when we connect to state that do not change and we use reducers', () => {
    it('should not fire the callback', () => {
      const spy = jest.fn();
      const s1 = state({ message: 'a' }, (value, action) => {
        return { ...value };
      });
      const s2 = state('b', (value, action) => {
        if (action.type === 'update b') {
          return action.payload;
        }
        return value;
      });

      connect({ value: s1 }, spy);

      System.put('update b', 'new value of b');

      expect(s2.get()).toBe('new value of b');
      expect(spy).toBeCalledTimes(1);
      expect(spy.mock.calls[0]).toStrictEqual([ { value: { message: 'a' } }]);
    });
  });
  describe('when we use a translate function', () => {
    it('should get the accumulated props and pass them through the translate function', () => {
      const spy = jest.fn();
      const s1 = state('foo');
      const s2 = state('bar');

      connect({ s1, s2 }, spy, function ({ s1, s2 }) {
        return {
          s3: s1 + '_xxx',
          s4: s2 + '_xxx'
        };
      });

      s1.set('oof');
      s2.set('rab');

      expect(spy).toBeCalledTimes(3);
      expect(spy.mock.calls[0]).toStrictEqual([ { s3: 'foo_xxx', s4: 'bar_xxx' } ]);
      expect(spy.mock.calls[1]).toStrictEqual([ { s3: 'oof_xxx', s4: 'bar_xxx' } ]);
      expect(spy.mock.calls[2]).toStrictEqual([ { s3: 'oof_xxx', s4: 'rab_xxx' } ]);
    });
  });
});
