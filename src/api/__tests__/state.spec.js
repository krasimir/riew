import state from '../state';
import { delay } from '../../__helpers__';

describe('Given the state', () => {
  describe('when we use the `pipe` method', () => {
    it('should create a queue of functions and run them one after each other', () => {
      const arr = [];
      const spyA = jest.fn().mockImplementation(() => arr.push('a'));
      const spyB = jest.fn().mockImplementation(() => arr.push('b'));
      const spyC = jest.fn().mockImplementation(() => arr.push('c'));
      const s = state('foo');
      const go = s.pipe(spyA).pipe(spyB).pipe(spyC);

      go('boo');

      expect(spyA).toBeCalledTimes(1);
      expect(spyA).toBeCalledWith('foo', 'boo');
      expect(spyB).toBeCalledTimes(1);
      expect(spyB).toBeCalledWith('foo', 'boo');
      expect(spyC).toBeCalledTimes(1);
      expect(spyC).toBeCalledWith('foo', 'boo');
      expect(arr).toStrictEqual(['a', 'b', 'c']);
    });
    it('should wait if there is any async piping', async () => {
      const arr = [];
      const spyA = jest.fn().mockImplementation(() => arr.push('a'));
      const spyB = jest.fn().mockImplementation(async () => {
        await delay(10);
        arr.push('b');
      });
      const spyC = jest.fn().mockImplementation(() => arr.push('c'));
      const s = state('foo');
      const go = s.pipe(spyA).pipe(spyB).pipe(spyC);

      go('boo');

      await delay(12);

      expect(spyA).toBeCalledTimes(1);
      expect(spyA).toBeCalledWith('foo', 'boo');
      expect(spyB).toBeCalledTimes(1);
      expect(spyB).toBeCalledWith('foo', 'boo');
      expect(spyC).toBeCalledTimes(1);
      expect(spyC).toBeCalledWith('foo', 'boo');
      expect(arr).toStrictEqual(['a', 'b', 'c']);
    });
    it('should have separate queue runs if we trigger multiple times', () => {
      const arr = [];
      const spyA = jest.fn().mockImplementation((p1, p2) => arr.push(p2 + 'a'));
      const spyB = jest.fn().mockImplementation((p1, p2) => arr.push(p2 + 'b'));
      const s = state('foo');
      const go = s.pipe(spyA).pipe(spyB);

      go('moo');
      go('zoo');

      expect(spyA).toBeCalledTimes(2);
      expect(spyA.mock.calls[0]).toStrictEqual(['foo', 'moo']);
      expect(spyA.mock.calls[1]).toStrictEqual(['foo', 'zoo']);
      expect(spyB).toBeCalledTimes(2);
      expect(spyB.mock.calls[0]).toStrictEqual(['foo', 'moo']);
      expect(spyB.mock.calls[1]).toStrictEqual(['foo', 'zoo']);
      expect(arr).toStrictEqual([ 'mooa', 'moob', 'zooa', 'zoob' ]);
    });
  });
  describe('when we use the `map` method', () => {
    it(`should
      * map the value
      * change the state value for the next item in the queue`, () => {
       const s = state('foo');
       const mapper = jest.fn().mockImplementation(value => ({ message: value }));
       const spyA = jest.fn();
       const m = s.map(mapper).pipe(spyA).map(({ message }, payload) => message + payload);

       expect(m(100)).toStrictEqual('foo100');
       expect(mapper).toBeCalledTimes(1);
       expect(mapper).toBeCalledWith('foo', 100);
       expect(spyA).toBeCalledTimes(1);
       expect(spyA).toBeCalledWith({ message: 'foo' }, 100);
    });
    it('should support async mappers', async () => {
      const arr = [];
      const s = state('foo');
      const mapper = async (value, payload) => {
        await delay(10);
        arr.push('b');
        return value + payload;
      };
      const m = s.pipe(() => arr.push('a')).map(mapper).pipe(() => arr.push('c'));
      const result = await m('bar');

      expect(result).toBe('foobar');
      expect(arr).toStrictEqual(['a', 'b', 'c']);
    });
  });
});
