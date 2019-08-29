import { createState, mergeStates, createStream } from '../state';
import { delay } from '../__helpers__';

const state = createState;
const merge = mergeStates;
const stream = createStream;

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
      expect(s.get()).toBe('foobar');
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
      expect(s.get()).toBe('foobar');
    });
    it('should work with no function passed', async () => {
      const s = state('foo');
      const m = s.mutate();

      m('bar');

      expect(s.get()).toBe('bar');
    });
  });

  /* filter */
  describe('when we use the `filter` method', () => {
    it('should continue the queue only if the filter function returns `true`', () => {
      const s = state('foo');
      const spy = jest.fn();
      const a = s.filter((value) => value === 'boo').map(() => 'moo').pipe(spy);

      expect(a()).toEqual('foo');
      s.set('boo');
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
      s.set('boo');
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

  /* cancel */
  describe('when we use the `cancel` method', () => {
    it('should empty the queue and disable the creation of new ones', () => {
      const s = state(10);
      const spyA = jest.fn();
      const spyB = jest.fn();
      const m = s.mutate((value) => value + 1).cancel().pipe(spyA);
      const n = s.pipe(() => {}).pipe(spyB);

      expect(m()).toBe(11);
      expect(m()).toBe(12);
      expect(m()).toBe(13);
      expect(n()).toBe(13);
      expect(s.get()).toBe(13);
      expect(spyA).toBeCalledTimes(0);
      expect(spyB).toBeCalledTimes(1);
      expect(spyB).toBeCalledWith(13);
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
      expect(s.get()).toBe(10);
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
    it('should call the queue if we call the stream method', () => {
      const s = state(10);
      const spy = jest.fn();

      s.stream.map(value => value * 3).pipe(spy);
      s.stream();

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(30);
    });
    it('should call set the value if we pass a parameter to stream method', () => {
      const s = state(10);
      const spy = jest.fn();

      s.stream.map(value => value * 3).pipe(spy);
      s.stream(120);

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(360);
    });
  });

  /* merge */
  describe('when we use the `merge` method', () => {
    it('should set a merged value coming from the sources', () => {
      const s1 = state(1);
      const s2 = state('a');
      const s = merge({ s1, s2 });

      expect(s.get()).toStrictEqual({ s1: 1, s2: 'a' });
    });
    it('should update the sources when we update the merged state', () => {
      const s1 = state(1);
      const s2 = state('a');
      const s = merge({ s1, s2 });

      s.set({ s1: 2 });

      expect(s.get()).toStrictEqual({ s1: 2, s2: 'a' });
      expect(s1.get()).toBe(2);
      expect(s2.get()).toBe('a');
    });
    it('should get the right merged state when we update the source states', () => {
      const s1 = state(1);
      const s2 = state('a');
      const s = merge({ s1, s2 });
      const getValue = s.map(({ s1, s2 }) => s1 + s2);

      s1.set(2);
      s2.set('b');

      expect(getValue()).toBe('2b');
      expect(s1.get()).toBe(2);
      expect(s2.get()).toBe('b');
    });
    it('should support the listening on the merge state', () => {
      const s1 = state(1);
      const s2 = state('a');
      const s = merge({ s1, s2 });
      const spy = jest.fn();

      s.stream.pipe(spy);

      s1.set(2);
      s2.set('b');

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
      expect(s.get('bar'));
      expect(s.get()).toBe('bar');
    });
  });

  /* mapToKey */
  describe('when we use the `mapToKey` method', () => {
    it('should map to an object which key is equal to the value of the state', () => {
      const spy = jest.fn();
      const s = state('foo');

      s.stream.mapToKey('myValue').pipe(spy);
      s.set('bar');

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith({ myValue: 'bar' });
    });
    it('should work as the other queue api methods', () => {
      expect(state('foo').mapToKey('bar')()).toStrictEqual({ bar: 'foo' });
    });
  });

  /* forking */
  describe('when we use wanna fork method', () => {
    it('should fork the queue', () => {
      const spy = jest.fn();
      const s = state([ 'foo', 'bar' ]);
      const getFirst = s.map(value => value[0]);
      const getUp = getFirst.pipe(spy);

      getFirst();
      getUp();

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith('foo');
    });
  });

  /* stream */
  describe('when we create a stream manually', () => {
    it('should create a stream and return a function which if called triggers the stream queue', () => {
      const st = stream();
      const spy1 = jest.fn();
      const spy2 = jest.fn();

      st.pipe(spy1);
      st.pipe(spy2);

      st('foo');

      expect(spy1).toBeCalledTimes(1);
      expect(spy1).toBeCalledWith('foo');
      expect(spy2).toBeCalledTimes(1);
      expect(spy2).toBeCalledWith('foo');
    });
    it('should allow us to stream on a trigger', () => {
      const s = state('foo');
      const spy = jest.fn();
      const up = s.map(value => value.toUpperCase());

      expect(up()).toBe('FOO');

      up.stream.map(value => value + 'BAR').pipe(spy);
      s.set('moo');

      expect(spy).toBeCalledTimes(1);
      expect(spy.mock.calls[0]).toStrictEqual([ 'MOOBAR' ]);
    });
  });

  /* Integration/general tests */
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
      expect(s.get()).toBe('The message is foobar');
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
      const increment = s
        .filter(({ flag }) => flag)
        .mutate(({ index }) => ({ flag: true, index: index + 1 }))
        .pipe(() => {});

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
        swapFirst(() => ({ flag: true, index: -10}), 'map');
      })()).toStrictEqual({ flag: true, index: -9 });

      expect(increment.test(({ setValue, swapLast }) => {
        setValue({ flag: true, index: 42 });
        swapLast(({ flag }) => ({ flag, index: 5000 }), 'map');
      })()).toStrictEqual({ flag: true, index: 5000 });
    });
  });
  it('should throw errors if we try using the queue as a state', () => {
    const s = state('foo');

    ['set', 'get', 'teardown'].forEach(stateMethod => {
      expect(() => s.pipe()[stateMethod]())
        .toThrowError(`"${ stateMethod }" is not a queue method but a method of the state object.`);
    });
  });
  describe('when we have a branching on a merged state', () => {
    it('should run the branching logic only once', () => {
      const s1 = state('1');
      const s2 = state('a');
      const m = merge({ s1, s2 });
      const action = m.mutate(() => ({ s1: 2, s2: 'b' }));
      const conditionSpy = jest.fn().mockImplementation(() => true);
      const okLogic = jest.fn();

      m.stream.filter(conditionSpy).pipe(okLogic);

      action();

      expect(conditionSpy).toBeCalledTimes(1);
      expect(conditionSpy).toBeCalledWith({ s1: 2, s2: 'b' });
      expect(okLogic).toBeCalledTimes(1);
      expect(okLogic).toBeCalledWith({ s1: 2, s2: 'b' });
    });
  });
  describe('when we have a branching after stream', () => {
    it('should run a fresh queue every time', () => {
      const s = state(0);
      const spyA = jest.fn();
      const spyB = jest.fn();

      s.stream
        .filter((value) => value < 2)
        .map(value => `value is ${ value }`)
        .pipe(spyA);

      expect(s.__listeners().length).toBe(1);
      expect(s.__listeners()[0].__itemsToCreate.map(({ type }) => type)).toStrictEqual([ 'filter', 'map', 'pipe' ]);

      s.stream
        .filter((value) => {
          return value >= 2;
        })
        .pipe(spyB);

      s.set(1);
      s.set(5);

      expect(spyA).toBeCalledTimes(1);
      expect(spyA.mock.calls[0]).toStrictEqual(['value is 1']);
      expect(spyB).toBeCalledTimes(1);
      expect(spyB.mock.calls[0]).toStrictEqual([5]);
    });
  });
  describe('when the queue finishes', () => {
    it('should remove it from the state created queues tracker array', async () => {
      const s = state(10);
      const m = s.mutate(async (value) => {
        await delay(5);
        return value * 5;
      }).map(value => value - 2);

      expect(s.__queues()).toHaveLength(0);
      m();
      expect(s.__queues()).toHaveLength(1);
      await delay(7);
      expect(s.get()).toBe(50);
      expect(s.__queues()).toHaveLength(0);
    });
  });
  describe('when we use a trigger as a beginning of new queue', () => {
    it('should not mess the already existing queue', () => {
      const spy1 = jest.fn();
      const spy2 = jest.fn();
      const s = state([ 'foo', 'bar' ]);
      const getFirst = s.map(value => value[0]).pipe(spy1);
      const getUp = getFirst.map(value => value.toUpperCase()).pipe(spy2);

      expect(getUp()).toBe('FOO');
      expect(getFirst()).toBe('foo');

      expect(spy1).toBeCalledTimes(2);
      expect(spy1.mock.calls[0]).toStrictEqual([ 'foo' ]);
      expect(spy1.mock.calls[1]).toStrictEqual([ 'foo' ]);
      expect(spy2).toBeCalledTimes(1);
      expect(spy2.mock.calls[0]).toStrictEqual([ 'FOO' ]);
    });
  });
});
