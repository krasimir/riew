import state from '../state';
import { delay } from '../../__helpers__';

describe('Given the state', () => {

  /* Integration pipe */
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
        await delay(5);
        arr.push('b');
      });
      const spyC = jest.fn().mockImplementation(() => arr.push('c'));
      const s = state('foo');
      const go = s.pipe(spyA).pipe(spyB).pipe(spyC);

      go('boo');

      await delay(6);

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
    it('should have a default piping function', () => {
      const s = state('foo');
      const m = s.pipe();

      expect(m()).toBe('foo');
    });
  });

  /* map */
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
        await delay(5);
        arr.push('b');
        return value + payload;
      };
      const m = s.pipe(() => arr.push('a')).map(mapper).pipe(() => arr.push('c'));
      const result = await m('bar');

      expect(result).toBe('foobar');
      expect(arr).toStrictEqual(['a', 'b', 'c']);
    });
  });

  /* mutate */
  describe('when we use the `mutate` method', () => {
    it('should add a queue item for mutating the state', () => {
      const s = state('foo');
      const spy = jest.fn().mockImplementation((current, payload) => current + payload);
      const m = s.mutate(spy);

      expect(m('bar')).toBe('foobar');
      expect(s.__get()).toBe('foobar');
    });
    it('should support async mutations', async () => {
      const s = state('foo');
      const spy = jest.fn().mockImplementation(async (current, payload) => {
        await delay(5);
        return current + payload;
      });
      const m = s.mutate(spy);
      const result = await m('bar');

      expect(result).toBe('foobar');
      expect(s.__get()).toBe('foobar');
    });
  });

  /* filter */
  describe('when we use the `filter` method', () => {
    it('should continue the queue only if the filter function returns `true`', () => {
      const s = state('foo');
      const spy = jest.fn();
      const a = s.filter((value) => value === 'boo').map(() => 'moo').pipe(spy);

      expect(a()).toEqual('foo');
      s.__set('boo');
      expect(a()).toEqual('moo');
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith('moo');
    });
    it('should support an async filter', async () => {
      const s = state('foo');
      const spy = jest.fn();
      const a = s.filter(async (value) => {
        await delay(5);
        return value === 'boo';
      }).map(() => 'moo').pipe(spy);

      expect(await a()).toEqual('foo');
      s.__set('boo');
      expect(await a()).toEqual('moo');
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith('moo');
    });
  });

  /* fork */
  describe('when we use the `fork` method', () => {
    it('should run functions in parallel', () => {
      const s = state('foo');
      const spyA = jest.fn().mockImplementation(() => 'a');
      const spyB = jest.fn().mockImplementation(() => 'b');
      const spyC = jest.fn().mockImplementation(() => 'c');
      const m = s.map(() => 'boo').fork(spyA, spyB, spyC);

      expect(m('moo')).toStrictEqual(['a', 'b', 'c']);
      expect(spyA).toBeCalledTimes(1);
      expect(spyA).toBeCalledWith('boo', 'moo');
      expect(spyB).toBeCalledTimes(1);
      expect(spyB).toBeCalledWith('boo', 'moo');
      expect(spyC).toBeCalledTimes(1);
      expect(spyC).toBeCalledWith('boo', 'moo');
    });
    it('should wait till all the async forks are done', async () => {
      const s = state('foo');
      const spyA = jest.fn().mockImplementation(() => 'a');
      const spyB = jest.fn().mockImplementation(async () => {
        await delay(5);
        return 'b';
      });
      const spyC = jest.fn().mockImplementation(async () => {
        await delay(7);
        return 'c';
      });
      const m = s.map(() => 'boo').fork(spyA, spyB, spyC);

      expect(await m('moo')).toStrictEqual(['a', 'b', 'c']);
      expect(spyA).toBeCalledTimes(1);
      expect(spyA).toBeCalledWith('boo', 'moo');
      expect(spyB).toBeCalledTimes(1);
      expect(spyB).toBeCalledWith('boo', 'moo');
      expect(spyC).toBeCalledTimes(1);
      expect(spyC).toBeCalledWith('boo', 'moo');
    });
  });

  /* branch */
  describe('when we use the `branch` method', () => {
    it('should run the branching function if the condition function returns true', () => {
      const s = state('foo');
      const spyA = jest.fn();
      const spyB = jest.fn().mockImplementation(() => 'b');
      const m = s.branch((value, payload) => value.toUpperCase() === payload, spyA).map(spyB);

      expect(m()).toBe('b');
      expect(m('FOO')).toBe('foo');
      expect(spyA).toBeCalledTimes(1);
      expect(spyA).toBeCalledWith('foo', 'FOO');
      expect(spyB).toBeCalledTimes(1);
      expect(spyB).toBeCalledWith('foo');
    });
    it('should support async functions', async () => {
      const s = state('foo');
      const spyA = jest.fn().mockImplementation(async () => {
        await delay(7);
        s.__set('bar');
      });
      const spyB = jest.fn().mockImplementation(() => 'b');
      const m = s.branch(async (value, payload) => {
        await delay(5);
        return value.toUpperCase() === payload;
      }, spyA).map(spyB);

      expect(await m()).toBe('b');
      expect(await m('FOO')).toBe('foo');
      expect(spyA).toBeCalledTimes(1);
      expect(spyA).toBeCalledWith('foo', 'FOO');
      expect(spyB).toBeCalledTimes(1);
      expect(spyB).toBeCalledWith('foo');
      expect(s.__get()).toBe('bar');
    });
  });

  /* Integration tests */
  describe('when we use all the methods', () => {
    it('should work :)', async () => {
      const arr = [];
      const s = state('foo');
      const spyPipe = jest.fn().mockImplementation(async () => arr.push('pipe'));
      const spyMap = jest.fn().mockImplementation(async (value, payload) => {
        await delay(5);
        arr.push('map');
        return { message: value + payload };
      });
      const spyMutate = jest.fn().mockImplementation(async ({ message }) => {
        await delay(5);
        arr.push('mutate');
        return `The message is ${ message }`;
      });

      const trigger = s
        .pipe(spyPipe)
        .map(spyMap)
        .pipe(() => {})
        .pipe(spyPipe)
        .mutate(spyMutate)
        .pipe(spyPipe)
        .map(sentence => sentence.toUpperCase());
      const result = await trigger('bar');

      expect(result).toBe('THE MESSAGE IS FOOBAR');
      expect(s.__get()).toBe('The message is foobar');
      expect(arr).toStrictEqual([
        'pipe', 'map', 'pipe', 'mutate', 'pipe'
      ]);
    });
  });
  describe('when we call the same trigger multiple times', () => {
    it('should keep the queue items separate', () => {
      const s = state('foo');
      const m1 = s.map(value => value + 1).pipe(() => {});
      const m2 = s.map(value => value + 2).map(value => value.toUpperCase());

      expect(m1()).toBe('foo1');
      expect(m2()).toBe('FOO2');
    });
  });
});
