import {
  state,
  take,
  put,
  listen,
  reset,
  CHANNELS,
  go,
  sput,
  stake,
  sleep,
  chan,
  sliding,
} from '../index';
import { delay } from '../__helpers__';

describe('Given a CSP state extension', () => {
  beforeEach(() => {
    reset();
  });
  describe('when we use the imperative get and set api', () => {
    it('should manage the state', () => {
      const s = state('foo');
      const data = { bar: 42 };

      expect(s.get()).toBe('foo');
      s.set(data);
      expect(s.get()).toBe(data);
    });
    it('should trigger the defined selectors', () => {
      const s = state('foo');
      const spy = jest.fn();

      s.select(sliding('R'), value => value.toUpperCase());
      listen('R', spy, { initialCall: true });
      s.set('bar');
      expect(spy).toBeCalledWithArgs(['FOO'], ['BAR']);
    });
  });
  describe('when using the built-in READ and WRITE channels', () => {
    it('should work', () => {
      const s = state('foo');
      const spy = jest.fn();
      const spy2 = jest.fn();

      listen(s, spy, { initialCall: true });
      stake(s, spy2);
      sput(s, 'bar');
      stake(s, spy2);

      expect(spy).toBeCalledWithArgs(['foo'], ['bar']);
      expect(spy2).toBeCalledWithArgs(['foo'], ['bar']);
    });
  });
  describe("when we use channels to manage state's value", () => {
    it('should retrieve and change the state value', () => {
      const s = state(10);
      const spy1 = jest.fn();

      s.select(sliding('R'), value => `value is ${value}`);
      s.mutate(sliding('W1'), (current, newValue) => current + newValue);
      s.mutate(sliding('W2'), (current, newValue) => current * newValue);

      listen('R', spy1, { initialCall: true });
      sput('W1', 4);
      sput('W1', 12);
      sput('W2', 3);

      expect(spy1).toBeCalledWithArgs(
        ['value is 10'],
        ['value is 14'],
        ['value is 26'],
        ['value is 78']
      );
    });
  });
  describe('when we destroy the state', () => {
    it('should close the created channels', () => {
      const s = state('foo');

      s.select(sliding('RR'));
      s.select(sliding('WW'));

      expect(Object.keys(CHANNELS.getAll())).toStrictEqual([
        s.READ.id,
        s.WRITE.id,
        'RR',
        'WW',
      ]);
      s.destroy();
      expect(Object.keys(CHANNELS.getAll())).toStrictEqual([]);
    });
  });
  describe('when we use state into a routine', () => {
    it(`should
      * have non-blocking puts
      * have non-blocking takes
      * when no puts the take should resolve with the initial value`, () => {
      const s = state('foo');
      const spy = jest.fn();
      const listenSpy = jest.fn();

      s.select(sliding('R'), value => value.toUpperCase());
      s.mutate(sliding('W'), (a, b) => a + b);

      listen(s, v => listenSpy(`READ=${v}`), { initialCall: true });
      listen('R', v => listenSpy(`R=${v}`), { initialCall: true });
      listen(s.WRITE, v => listenSpy(`WRITE=${v}`));
      listen('W', v => listenSpy(`W=${v}`));

      go(function*() {
        spy(yield take(s));
        spy(yield take('R'));
        spy(yield put(s, 'bar'));
        spy(yield take(s));
        spy(yield take('R'));
        spy(yield put('W', 'hello world my friend'));
        spy(yield take(s));
        spy(yield take('R'));
      });

      expect(spy).toBeCalledWithArgs(
        ['foo'],
        ['FOO'],
        [true],
        ['bar'],
        ['BAR'],
        [true],
        ['barhello world my friend'],
        ['BARHELLO WORLD MY FRIEND']
      );
      expect(listenSpy).toBeCalledWithArgs(
        ['READ=foo'],
        ['R=FOO'],
        ['READ=bar'],
        ['R=BAR'],
        ['WRITE=bar'],
        ['READ=barhello world my friend'],
        ['R=BARHELLO WORLD MY FRIEND'],
        ['W=hello world my friend']
      );
    });
  });
  describe('when we have a routine as mutation', () => {
    it('should wait till the routine is gone', async () => {
      const spy = jest.fn();
      const s = state('foo');
      const s2 = state('bar');

      s.mutate(sliding('W'), function*(current, newOne) {
        yield sleep(5);
        return current + newOne + (yield take(s2));
      });

      listen(s, spy, { initialCall: true });
      sput('W', 'zoo');

      await delay(10);
      expect(spy).toBeCalledWithArgs(['foo'], ['foozoobar']);
    });
    it('should block the put till the mutator is done', async () => {
      const spy = jest.fn();
      const s = state('foo');

      s.mutate(sliding('W'), function*(current, newOne) {
        yield sleep(5);
        return current + newOne;
      });

      go(function*() {
        yield put('W', 'bar');
        spy(yield take(s));
      });

      await delay(10);
      expect(spy).toBeCalledWithArgs(['foobar']);
    });
  });
  describe('when we use a generator as a selector', () => {
    it('should wait till the routine is gone', async () => {
      const spy = jest.fn();
      const s = state();

      s.select(sliding('IS'), function*(word) {
        return word;
      });

      listen('IS', spy);
      sput(s, 'bar');
      sput(s, 'zar');

      await delay(2);
      expect(spy).toBeCalledWithArgs(['bar'], ['zar']);
    });
  });
  describe('when we pass an already existing channel as a selector', () => {
    it('should put selected values to that channel', () => {
      const ch = chan('XXX');
      const s1 = state('foo');
      const s2 = state([{ name: 'A' }, { name: 'B' }]);
      const spy = jest.fn();

      listen(ch, spy);
      s1.select(ch);
      s2.select(ch, items => items.map(({ name }) => name).join('-'));
      s2.mutate(sliding('add'), (items, newItem) => [...items, newItem]);

      sput(s1, 'bar');
      sput('add', { name: 'C' });

      expect(spy).toBeCalledWithArgs(['foo'], ['A-B'], ['bar'], ['A-B-C']);
    });
  });
  describe('when we pass an already existing channel as a mutator', () => {
    it('should mutate every time when we put to that channel', () => {
      const ch = chan();
      const s = state('a');
      const spy = jest.fn();

      listen(s, spy, { initialCall: true });
      s.mutate(ch, (a, b) => a + b);

      sput(s, 'hello-');
      sput(ch, 'd');
      sput(ch, 'e');

      expect(spy).toBeCalledWithArgs(
        ['a'],
        ['hello-'],
        ['hello-d'],
        ['hello-de']
      );
    });
  });
  describe('when we pipe from one channel to two mutation channels', () => {
    it('should mutate both states', () => {
      const s1 = state('foo');
      const s2 = state(12);
      chan('X');

      s1.mutate(sliding('X1'), (value, payload) => value + payload);
      s2.mutate(sliding('X2'), (value, payload) => value * payload);

      listen('X', 'X1');
      listen('X', 'X2');

      sput('X', 3);
      sput('X', 10);

      expect(s1.get()).toBe('foo310');
      expect(s2.get()).toBe(360);
    });
  });
  describe('when using same channel for mutations on different states', () => {
    it('should work for both states', () => {
      const s1 = state('foo');
      const s2 = state(12);
      const CHANGE = sliding('CHANGE');

      s1.mutate(CHANGE, a => a.toUpperCase());
      s2.mutate(CHANGE, a => a + 20);

      sput(CHANGE);

      expect(s1.get()).toBe('FOO');
      expect(s2.get()).toBe(32);
    });
  });
});
