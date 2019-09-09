import { createState, mergeStates } from '../state';
import registry from '../registry';
import { delay } from '../__helpers__';

const state = createState;
const merge = mergeStates;

describe('Given the state', () => {

  /* get & set */
  describe('when we use `get` and `set`', () => {
    it('should get and set the current value', () => {
      const [ get, set ] = state('foo');

      set('bar');
      expect(get()).toBe('bar');
    });
  });

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

  /* mapToKey */
  describe('when we use the `mapToKey` method', () => {
    it('should map to an object which key is equal to the value of the state', () => {
      const spy = jest.fn();
      const [ s, setState ] = state('foo');

      s.mapToKey('myValue').pipe(spy).subscribe();
      setState('bar');

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith({ myValue: 'bar' });
    });
    it('should work as the other queue api methods', () => {
      expect(state('foo').mapToKey('bar')()).toStrictEqual({ bar: 'foo' });
    });
  });

  /* mutate */
  describe('when we use the `mutate` method', () => {
    it('should add a queue item for mutating the state', () => {
      const [ s ] = state('foo');
      const spy = jest.fn().mockImplementation((current, payload) => current + payload);
      const m = s.mutate(spy);

      expect(m('bar')).toBe('foobar');
      expect(s()).toBe('foobar');
    });
    it('should support async mutations', async () => {
      const [ s ] = state('foo');
      const spy = jest.fn().mockImplementation(async (current, payload) => {
        await delay(5);
        return current + payload;
      });
      const m = s.mutate(spy);
      const result = await m('bar');

      expect(result).toBe('foobar');
      expect(s()).toBe('foobar');
    });
    it('should work with no function passed', async () => {
      const [ s ] = state('foo');
      const m = s.mutate();

      m('bar');

      expect(s()).toBe('bar');
    });
  });

  /* filter */
  describe('when we use the `filter` method', () => {
    it('should continue the queue only if the filter function returns `true`', () => {
      const [ s, setState ] = state('foo');
      const spy = jest.fn();
      const a = s.filter((value) => value === 'boo').map(() => 'moo').pipe(spy);

      expect(a()).toEqual('foo');
      setState('boo');
      expect(a()).toEqual('moo');
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith('moo');
    });
    it('should support an async filter', async () => {
      const [ s, setState ] = state('foo');
      const spy = jest.fn();
      const a = s.filter(async (value) => {
        await delay(5);
        return value === 'boo';
      }).map(() => 'moo').pipe(spy);

      expect(await a()).toEqual('foo');
      setState('boo');
      expect(await a()).toEqual('moo');
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith('moo');
    });
  });

  /* cancel */
  describe('when we use the `cancel` method', () => {
    it('should stop the currently running queues (if any)', async () => {
      const [ s ] = state(10);
      const spy = jest.fn();
      const m = s.pipe(async () => {
        await delay(5);
      }).mutate((value) => value + 5).pipe(spy);

      m();
      m.cancel();

      await delay(10);
      expect(s()).toBe(10);
      expect(spy).not.toBeCalled();
    });
  });

  /* teardown */
  describe('when we use the `teardown` method', () => {
    it('should cancel all the queues', () => {
      const [ s ] = state(10);
      const spyA = jest.fn();
      const spyB = jest.fn();
      const m = s.mutate((value) => value + 1).pipe(spyA);
      const n = s.pipe(() => {}).pipe(spyB);

      s.teardown();
      expect(m()).toBe(10);
      expect(m()).toBe(10);
      expect(m()).toBe(10);
      expect(n()).toBe(10);
      expect(s()).toBe(10);
      expect(spyA).toBeCalledTimes(0);
      expect(spyB).toBeCalledTimes(0);
    });
  });

  /* subscribe */
  describe('when we use the `subscribe` method', () => {
    it('should trigger the queue on a state change', () => {
      const s = state(10);
      const spyA = jest.fn();
      const spyB = jest.fn();
      const m = s.mutate(value => value + 5);

      s.map(value => value * 2).pipe(spyA).subscribe();
      s.map(value => value * 4).pipe(spyB).subscribe();
      m();

      expect(spyA).toBeCalledTimes(1);
      expect(spyA).toBeCalledWith(30);
      expect(spyB).toBeCalledTimes(1);
      expect(spyB).toBeCalledWith(60);
    });
    it('should not trigger the queue if the value is the same', () => {
      const [ s, setState ] = state(10);
      const spy = jest.fn();

      s.map(value => value * 2).pipe(spy).subscribe();
      setState(20);
      setState(20);
      setState(20);

      expect(spy).toBeCalledWithArgs([ 40 ]);
    });
    it('should trigger the queue initially once if we pass `true` as param', () => {
      const s = state(10);
      const spy = jest.fn();

      s.map(value => value * 3).pipe(spy).subscribe(true);

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(30);
    });
    it('should allow us to fork streams', () => {
      const [ s, setState ] = state(10);
      const spyA = jest.fn();
      const spyB = jest.fn();
      const spyC = jest.fn();

      const subscription = s.map(value => value * 2).pipe(function A(...args) { spyA(...args); }).subscribe();

      const t1 = subscription.map(value => value + 'B').pipe(function B(...args) { spyB(...args); }).subscribe();
      const t2 = subscription.map(value => value + 'C').pipe(function C(...args) { spyC(...args); }).subscribe();

      setState(100);

      expect(s.__listeners().map(({ id }) => id)).toStrictEqual([ subscription.id, t1.id, t2.id ]);
      expect(spyA).toBeCalledTimes(3);
      expect(spyA.mock.calls[0]).toStrictEqual([ 200 ]);
      expect(spyA.mock.calls[1]).toStrictEqual([ 200 ]);
      expect(spyA.mock.calls[2]).toStrictEqual([ 200 ]);
      expect(spyB).toBeCalledTimes(1);
      expect(spyB).toBeCalledWith('200B');
      expect(spyC).toBeCalledTimes(1);
      expect(spyC).toBeCalledWith('200C');
    });
    it('should allow us to unsubscribe from the stream', () => {
      const [ s, setState ] = state(10);
      const spy = jest.fn();
      const subscription = s.map(value => value * 3).pipe(spy).subscribe(true);

      subscription.unsubscribe();

      subscription();
      subscription();
      setState(200);
      setState(300);
      subscription();

      expect(spy).toBeCalledTimes(4);
      expect(spy.mock.calls[0]).toStrictEqual([ 30 ]);
      expect(spy.mock.calls[1]).toStrictEqual([ 30 ]);
      expect(spy.mock.calls[2]).toStrictEqual([ 30 ]);
      expect(spy.mock.calls[3]).toStrictEqual([ 900 ]);
    });
    it('should throw an error if we subscribe for mutating trigger', () => {
      expect(() => state(10).mutate(value => value + 1).subscribe()).toThrowError();
    });
  });

  /* merge */
  describe('when we use the `merge` method', () => {
    it('should set a merged value coming from the sources', () => {
      const s1 = state(1);
      const s2 = state('a');
      const [ s ] = merge({ s1, s2 });

      expect(s()).toStrictEqual({ s1: 1, s2: 'a' });
    });
    it('should update the sources when we update the merged state', () => {
      const [ s1 ] = state(1);
      const [ s2 ] = state('a');
      const [ s, setState ] = merge({ s1, s2 });

      setState({ s1: 2 });

      expect(s()).toStrictEqual({ s1: 2, s2: 'a' });
      expect(s1()).toBe(2);
      expect(s2()).toBe('a');
    });
    it('should get the right merged state when we update the source states', () => {
      const [ s1, setState1 ] = state(1);
      const [ s2, setState2 ] = state('a');
      const [ s ] = merge({ s1, s2 });
      const getValue = s.map(({ s1, s2 }) => s1 + s2);

      setState1(2);
      setState2('b');

      expect(getValue()).toBe('2b');
      expect(s1()).toBe(2);
      expect(s2()).toBe('b');
    });
    it('should support the listening on the merge state', () => {
      const [ s1, setState1 ] = state(1);
      const [ s2, setState2 ] = state('a');
      const s = merge({ s1, s2 });
      const spy = jest.fn();

      s.pipe(spy).subscribe();

      setState1(2);
      setState2('b');

      expect(spy).toBeCalledWithArgs(
        [{ s1: 2, s2: 'a' }],
        [{ s1: 2, s2: 'b' }]
      );
    });
    it('should update the state properly if we create a mutation out of the merged state', () => {
      const [ s1 ] = state('foo');
      const [ s2 ] = state('bar');
      const [ m ] = merge({ s1, s2 });
      const change = m.mutate(({ s1, s2 }, payload) => ({
        s1: s1 + payload,
        s2: s2 + payload
      }));

      change('xx');
      expect(m()).toStrictEqual({ s1: 'fooxx', s2: 'barxx' });
    });
  });

  /* forking */
  describe('when we use want to fork a trigger', () => {
    it('should fork it', () => {
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

  /* Integration/general */
  describe('when we have a slightly more complicated code', () => {
    it('should work :)', async () => {
      const arr = [];
      const [ s ] = state('foo');
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
      expect(s()).toBe('The message is foobar');
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
  describe('when we have a branching on a merged state', () => {
    it('should run the branching logic only once', () => {
      const s1 = state('1');
      const s2 = state('a');
      const m = merge({ s1, s2 });
      const action = m.mutate(() => ({ s1: 2, s2: 'b' }));
      const conditionSpy = jest.fn().mockImplementation(() => true);
      const okLogic = jest.fn();

      m.filter(conditionSpy).pipe(okLogic).subscribe();

      action();

      expect(conditionSpy).toBeCalledWithArgs(
        [{ s1: 2, s2: 'a' }],
        [{ s1: 2, s2: 'b' }]
      );
      expect(okLogic).toBeCalledWithArgs(
        [{ s1: 2, s2: 'a' }],
        [{ s1: 2, s2: 'b' }]
      );
    });
  });
  describe('when we have two triggers that are subscribed', () => {
    it('should run a fresh queue every time', () => {
      const [ s, setState ] = state(0);
      const spyA = jest.fn();
      const spyB = jest.fn();

      s
        .filter((value) => value < 2)
        .map(value => `value is ${ value }`)
        .pipe(spyA)
        .subscribe();

      expect(s.__listeners().length).toBe(1);
      expect(s.__listeners()[0].__itemsToCreate.map(({ type }) => type))
        .toStrictEqual([ 'map', 'filter', 'map', 'pipe' ]);

      s
        .filter((value) => {
          return value >= 2;
        })
        .pipe(spyB)
        .subscribe();

      setState(1);
      setState(5);

      expect(spyA).toBeCalledTimes(1);
      expect(spyA.mock.calls[0]).toStrictEqual(['value is 1']);
      expect(spyB).toBeCalledTimes(1);
      expect(spyB.mock.calls[0]).toStrictEqual([5]);
    });
  });
  describe('when the queue finishes', () => {
    it('should remove it from the state created queues tracker array', async () => {
      const [ s ] = state(10);
      const m = s.mutate(async (value) => {
        await delay(5);
        return value * 5;
      }).map(value => value - 2);

      m();
      expect(m.__queues).toHaveLength(1);
      await delay(7);
      expect(s()).toBe(50);
      expect(m.__queues).toHaveLength(0);
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
  describe('when we want to test a trigger', () => {
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

  /* registry */
  describe('when we register the state into the registry', () => {
    it('should allow us to use it from there', () => {
      state(10).export('my state');
      const [ getState, setState ] = registry.get('my state');

      expect(getState()).toBe(10);
      getState.mutate(() => 200)();
      expect(getState()).toBe(200);
      setState(42);
      expect(getState()).toBe(42);
    });
    it('should free the resource in the registry if we teardown the state', () => {
      const s = state(0).export('my state');

      s.teardown();
      expect(() => registry.get('my state')).toThrowError('"my state" is missing in the registry.');
    });
  });

  /* isMutating */
  describe('when we use the `isMutating` method', () => {
    [
      'pipe',
      'map',
      'mutate',
      'filter',
      'mapToKey'
    ].forEach(method => {
      it(`should return "true" for the ones that mutate the state (${ method })`, () => {
        expect(state('foo')[method](() => {}).isMutating()).toBe(method === 'mutate');
      });
    });
  });

  /* Iterable */
  describe('when we destruct a state', () => {
    it('should give us getter, setter which are actually triggers and the state itself', () => {
      const [ get, set, s ] = state('foo');
      const spy = jest.fn();

      get.map(value => value.toUpperCase()).pipe(spy).subscribe(true);

      set('bar');
      expect(get()).toBe('bar');
      expect(s.map(value => value + 'zar')()).toBe('barzar');
      expect(spy).toBeCalledWithArgs([ 'FOO' ], [ 'BAR' ]);
    });
  });

  /* define (custom methods) */
  describe('when we define a custom method', () => {
    it('should be able to use it as a normal queue method', () => {
      const [ s, setState ] = state(2);
      const [ y ] = state({ hello: 'world' });
      const spy3 = jest.fn();
      const spy2 = jest.fn().mockImplementation((value, arg1) => {
        return value + arg1.reduce((v, n) => v + n, 0);
      });
      const spy = jest.fn().mockImplementation(() => {
        return spy2;
      });

      s.define('bar', spy);

      let trigger = s.map(value => value * 2).bar('a', 'b').pipe(spy3);

      trigger.subscribe(true);

      expect(trigger(8, 2)).toBe(14);

      setState(10);

      expect(spy).toBeCalledWithArgs([ 'a', 'b' ], [ 'a', 'b'], [ 'a', 'b' ]);
      expect(spy2).toBeCalledWithArgs(
        [ 4, [], expect.any(Function), expect.any(Object) ],
        [ 4, [8, 2], expect.any(Function), expect.any(Object) ],
        [ 20, [], expect.any(Function), expect.any(Object) ]
      );
      expect(s()).toBe(10);
      expect(y()).toStrictEqual({ hello: 'world' });
    });
    describe('and we use an async function', () => {
      it('should keep the queue working properly', async () => {
        const s = state();
        const spy = jest.fn();
        const spy2 = jest.fn();
        const m = s.mutate((current, payload) => payload.toUpperCase());

        m.define('gamble', (args) => {
          return async (word, payload) => {
            spy2(word, payload);
            await delay(5);
            if (word === 'BAR') return 'JACKPOT';
            return 'Nope';
          };
        });

        const play = m.gamble().pipe(spy);

        // this shouldn't throw
        s.pipe().gamble().pipe();

        await play('foo');
        await play('bar');
        await play('baz');

        expect(spy).toBeCalledWithArgs(
          ['Nope', 'foo'], ['JACKPOT', 'bar'], ['Nope', 'baz']
        );
        expect(spy2).toBeCalledWithArgs(
          ['FOO', ['foo']],
          ['BAR', ['bar']],
          ['BAZ', ['baz']]
        );
      });
    });
    describe('when we define a method, export the trigger and fork it after that', () => {
      it('should still work', () => {
        const [ s ] = state('foo').export('hey');

        s.define('toUpperCase', () => {
          return (intermediateValue, payload, next, q) => {
            return next(intermediateValue.toUpperCase());
          };
        });

        expect(s.toUpperCase().map()()).toBe('FOO');

        const exported = registry.get('hey');

        expect('toUpperCase' in exported).toBe(true);

        const m = exported.mutate(() => 'bar');

        expect(m.toUpperCase()()).toBe('BAR');
      });
    });
  });
});
