import { createState, mergeStates } from '../state';
import { delay } from '../__helpers__';

const state = createState;
const merge = mergeStates;

describe('Given the state', () => {

  /* pipe */
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
    it('should work with no function passed', async () => {
      const s = state('foo');
      const m = s.map();

      expect(m()).toBe('foo');
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
    it('should work with no function passed', async () => {
      const s = state('foo');
      const m = s.mutate();

      m('bar');

      expect(s.__get()).toBe('bar');
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

  /* parallel */
  describe('when we use the `parallel` method', () => {
    it('should run functions in parallel', () => {
      const s = state('foo');
      const spyA = jest.fn().mockImplementation(() => 'a');
      const spyB = jest.fn().mockImplementation(() => 'b');
      const spyC = jest.fn().mockImplementation(() => 'c');
      const m = s.map(() => 'boo').parallel(spyA, spyB, spyC);

      expect(m('moo')).toStrictEqual(['a', 'b', 'c']);
      expect(spyA).toBeCalledTimes(1);
      expect(spyA).toBeCalledWith('boo', 'moo');
      expect(spyB).toBeCalledTimes(1);
      expect(spyB).toBeCalledWith('boo', 'moo');
      expect(spyC).toBeCalledTimes(1);
      expect(spyC).toBeCalledWith('boo', 'moo');
    });
    it('should wait till all the async parallel functions are done', async () => {
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
      const m = s.map(() => 'boo').parallel(spyA, spyB, spyC);

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
      const m = s.branch((value, payload) => {
        return value.toUpperCase() === payload;
      }, spyA).map(spyB);

      expect(m()).toBe('b');
      expect(m('FOO')).toBe('foo');
      expect(spyA).toBeCalledTimes(1);
      expect(spyA).toBeCalledWith(expect.objectContaining({
        pipe: expect.any(Function)
      }));
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
      expect(spyA).toBeCalledWith(expect.objectContaining({
        pipe: expect.any(Function)
      }));
      expect(spyB).toBeCalledTimes(1);
      expect(spyB).toBeCalledWith('foo');
      expect(s.__get()).toBe('bar');
    });
    it('should continuing the queue in the truthy function', () => {
      const s = state({ flag: true, index: 0 });
      const increment = s.branch(
        ({ flag }) => flag,
        $ => $.mutate(({ index }) => ({ flag: true, index: index + 1 }))
      );

      expect(increment()).toStrictEqual({ flag: true, index: 1 });
      expect(s.get()).toStrictEqual({ flag: true, index: 1 });
    });
    it('should respect the mutation in the truthy branch function (async)', async () => {
      const s = state({ flag: true, index: 0 });
      const increment = s.branch(
        ({ flag }) => flag,
        async $ => {
          await delay(5);
          return $.mutate(({ index }) => ({ flag: true, index: index + 1 }));
        }
      );

      expect(await increment()).toStrictEqual({ flag: true, index: 1 });
      expect(s.get()).toStrictEqual({ flag: true, index: 1 });
    });
  });

  /* cancel */
  describe('when we use the `cancel` method', () => {
    it('should empty the queue and disable the creation of new ones', () => {
      const s = state(10);
      const spyA = jest.fn();
      const spyB = jest.fn();
      const m = s.mutate((value) => value + 1).cancel().pipe(spyA);
      const n = s.pipe(() => {}).pipe(spyB);

      expect(m()).toBe(11);
      expect(m()).toBe(11);
      expect(m()).toBe(11);
      expect(n()).toBe(11);
      expect(s.__get()).toBe(11);
      expect(spyA).toBeCalledTimes(0);
      expect(spyB).toBeCalledTimes(1);
      expect(spyB).toBeCalledWith(11);
    });
  });

  /* teardown */
  describe('when we use the `teardown` method', () => {
    it('should cancel all the queues', () => {
      const s = state(10);
      const spyA = jest.fn();
      const spyB = jest.fn();
      const m = s.mutate((value) => value + 1).pipe(spyA);
      const n = s.pipe(() => {}).pipe(spyB);

      s.teardown();
      expect(m()).toBe(10);
      expect(m()).toBe(10);
      expect(m()).toBe(10);
      expect(n()).toBe(10);
      expect(s.__get()).toBe(10);
      expect(spyA).toBeCalledTimes(0);
      expect(spyB).toBeCalledTimes(0);
    });
  });

  /* stream */
  describe('when we use the `stream` method', () => {
    it('should trigger the queue on a state change', () => {
      const s = state(10);
      const spyA = jest.fn();
      const spyB = jest.fn();
      const m = s.mutate(value => value + 5);

      s.stream.map(value => value * 2).pipe(spyA);
      s.stream.map(value => value * 4).pipe(spyB);
      m();

      expect(spyA).toBeCalledTimes(1);
      expect(spyA).toBeCalledWith(30);
      expect(spyB).toBeCalledTimes(1);
      expect(spyB).toBeCalledWith(60);
    });
    it('should just return the state value if we call the `stream` as a function', () => {
      expect(state(10).stream()).toBe(10);
    });
  });

  /* merge */
  describe('when we use the `merge` method', () => {
    it('should set a merged value coming from the sources', () => {
      const s1 = state(1);
      const s2 = state('a');
      const s = merge({ s1, s2 });

      expect(s.__get()).toStrictEqual({ s1: 1, s2: 'a' });
    });
    it('should update the sources when we update the merged state', () => {
      const s1 = state(1);
      const s2 = state('a');
      const s = merge({ s1, s2 });

      s.__set({ s1: 2 });

      expect(s.__get()).toStrictEqual({ s1: 2, s2: 'a' });
      expect(s1.__get()).toBe(2);
      expect(s2.__get()).toBe('a');
    });
    it('should get the right merged state when we update the source states', () => {
      const s1 = state(1);
      const s2 = state('a');
      const s = merge({ s1, s2 });
      const getValue = s.map(({ s1, s2 }) => s1 + s2);

      s1.__set(2);
      s2.__set('b');

      expect(getValue()).toBe('2b');
      expect(s1.__get()).toBe(2);
      expect(s2.__get()).toBe('b');
    });
    it('should support the listening on the merge state', () => {
      const s1 = state(1);
      const s2 = state('a');
      const s = merge({ s1, s2 });
      const spy = jest.fn();

      s.stream.pipe(spy);

      s1.__set(2);
      s2.__set('b');

      expect(spy).toBeCalledTimes(2);
      expect(spy.mock.calls[0]).toStrictEqual([{ s1: 2, s2: 'a' }]);
      expect(spy.mock.calls[1]).toStrictEqual([{ s1: 2, s2: 'b' }]);
    });
  });

  /* get & set */
  describe('when we use `get` and `set`', () => {
    it('should get and set the current value', () => {
      const s = state('foo');

      s.set('bar');
      expect(s.__get('bar'));
      expect(s.get()).toBe('bar');
    });
  });

  /* mapToKey */
  describe('when we use the `mapToKey` method', () => {
    it('should map to an object which key is equal to the value of the state', () => {
      const spy = jest.fn();
      const s = state('foo');

      s.stream.mapToKey('myValue').pipe(spy);
      s.__set('bar');

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith({ myValue: 'bar' });
    });
    it('should work as the other queue api methods', () => {
      expect(state('foo').mapToKey('bar')()).toStrictEqual({ bar: 'foo' });
    });
  });

  /* fork */
  describe('when we use the `fork` method', () => {
    it('should fork the queue', () => {
      const spy = jest.fn();
      const s = state([ 'foo', 'bar' ]);
      const getFirst = s.map(value => value[0]);
      const getUp = getFirst.fork().pipe(spy);

      expect(s.__queues()).toHaveLength(2);

      const first = getFirst();

      getUp();

      expect(first).toBe('foo');
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith('foo');
    });
  });

  /* Integration tests */
  describe('when we have a slightly more complicated code', () => {
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
  describe('when we want to test', () => {
    it('should allow us to set a predefine value and swap queue items', () => {
      const s = state({ flag: false, index: 0 });
      const spy = jest.fn();
      const increment = s.branch(
        ({ flag }) => flag,
        $ => $.mutate(({ index }) => ({ flag: true, index: index + 1 }))
      ).pipe(() => {});

      expect(increment.test(({ setValue }) => {
        setValue({ flag: true, index: 11 });
      })()).toStrictEqual({ flag: true, index: 12 });

      increment.test(({ setValue, swap }) => {
        setValue({ flag: false, index: 100 });
        swap(1, spy);
      })();
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith({ flag: false, index: 100 });

      expect(increment.test(({ swapFirst }) => {
        swapFirst(() => 'banana', 'map');
      })()).toBe('banana');

      expect(increment.test(({ setValue, swapLast }) => {
        setValue({ flag: false, index: 42 });
        swapLast(({ flag }) => ({ flag, index: 5000 }), 'map');
      })()).toStrictEqual({ flag: false, index: 5000 });
    });
  });

  it('should throw errors if we try using the queue as a state', () => {
    const s = state('foo');

    ['set', 'get', 'teardown', 'stream'].forEach(stateMethod => {
      expect(() => s.pipe()[stateMethod]())
        .toThrowError(`"${ stateMethod }" is not a queue method but a method of the state object.`);
    });
  });
});
