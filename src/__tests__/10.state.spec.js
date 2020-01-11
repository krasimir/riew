import {
  state,
  take,
  put,
  read,
  sread,
  reset,
  CHANNELS,
  go,
  sput,
  stake,
  sleep,
  chan,
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

      s.select('R', value => value.toUpperCase());
      sread('R', spy, { listen: true });
      s.set('bar');
      expect(spy).toBeCalledWithArgs(['FOO'], ['BAR']);
    });
  });
  describe('when using the built-in READ and WRITE channels', () => {
    xit('should work', () => {
      const s = state('foo');
      const spy = jest.fn();
      const spy2 = jest.fn();

      sread(s, spy, { listen: true });
      stake(s, spy2);
      sput(s, 'bar');
      stake(s, spy2);

      expect(spy).toBeCalledWithArgs(['foo'], ['bar']);
      expect(spy2).toBeCalledWithArgs(['foo'], ['bar']);
    });
  });
  describe("when we use channels to manage state's value", () => {
    xit('should retrieve and change the state value', () => {
      const s = state(10);
      const spy1 = jest.fn();
      const spy2 = jest.fn();

      s.select('R', value => `value is ${value}`);
      s.mutate('W1', (current, newValue) => current + newValue);
      s.mutate('W2', (current, newValue) => current * newValue);

      sread('R', spy1, { listen: true });
      sread('R', spy2, { listen: true });
      sput('W1', 4);
      sput('W1', 12);
      sput('W2', 3);

      expect(spy1).toBeCalledWithArgs(
        ['value is 10'],
        ['value is 14'],
        ['value is 26'],
        ['value is 78']
      );
      expect(spy2).toBeCalledWithArgs(
        ['value is 10'],
        ['value is 14'],
        ['value is 26'],
        ['value is 78']
      );
    });
  });
  describe('when we destroy the state', () => {
    xit('should close the created channels', () => {
      const s = state('foo');

      s.select('RR');
      s.select('WW');

      expect(Object.keys(CHANNELS.getAll())).toStrictEqual([
        s.READ,
        s.WRITE,
        'RR',
        'WW',
      ]);
      s.destroy();
      expect(Object.keys(CHANNELS.getAll())).toStrictEqual([]);
    });
  });
  describe('when we use state into a routine', () => {
    xit(`should
      * have non-blocking puts
      * have non-blocking takes
      * when no puts the take should resolve with the initial value`, () => {
      const s = state('foo');
      const spy = jest.fn();
      const listen = jest.fn();

      s.select('R', value => value.toUpperCase());
      s.mutate('W', (a, b) => a + b);

      sread(s, v => listen(`READ=${v}`), { listen: true });
      sread('R', v => listen(`R=${v}`), { listen: true });
      sread(s.WRITE, v => listen(`WRITE=${v}`), { listen: true });
      sread('W', v => listen(`W=${v}`), { listen: true });

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
      expect(listen).toBeCalledWithArgs(
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
    xit('should wait till the routine is gone', async () => {
      const spy = jest.fn();
      const s = state('foo');
      const s2 = state('bar');

      s.mutate('W', function*(current, newOne) {
        yield sleep(5);
        return current + newOne + (yield take(s2));
      });

      sread(s, spy, { listen: true });
      sput('W', 'zoo');

      await delay(10);
      expect(spy).toBeCalledWithArgs(['foo'], ['foozoobar']);
    });
    xit('should block the put till the mutator is done', async () => {
      const spy = jest.fn();
      const s = state('foo');

      s.mutate('W', function*(current, newOne) {
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
    xit('should wait till the routine is gone', async () => {
      const spy = jest.fn();
      const s = state();

      s.select('IS', function*(word) {
        return word;
      });

      sread('IS', spy, { listen: true });
      sput(s, 'bar');
      sput(s, 'zar');

      await delay(2);
      expect(spy).toBeCalledWithArgs(['bar'], ['zar']);
    });
  });
  describe('when we pass an already existing channel as a selector', () => {
    xit('should put selected values to that channel', () => {
      const ch = chan('XXX');
      const s1 = state('foo');
      const s2 = state([{ name: 'A' }, { name: 'B' }]);
      const spy = jest.fn();

      sread(ch, spy, { listen: true });
      s1.select(ch);
      s2.select(ch, items => items.map(({ name }) => name).join('-'));
      s2.mutate('add', (items, newItem) => [...items, newItem]);

      sput(s1, 'bar');
      sput('add', { name: 'C' });

      expect(spy).toBeCalledWithArgs(['foo'], ['A-B'], ['bar'], ['A-B-C']);
    });
  });
  describe('when we pass an already existing channel as a mutator', () => {
    xit('should mutate every time when we put to that channel', () => {
      const ch = chan();
      const s = state('a');
      const spy = jest.fn();

      sread(s, spy, { listen: true });
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
  describe('when we define a mutation', () => {
    xit('should be possible to react on a mutation from within multiple routines', () => {
      const current = state('xxx');
      const spy = jest.fn();

      current.mutate('reset', () => 'foobar');

      go(function*() {
        yield read('reset');
        spy(`r1=${yield take(current)}`);
      });
      go(function*() {
        yield read('reset');
        spy(`r2=${yield take(current)}`);
      });
      go(function*() {
        yield read('reset');
        spy(`r3=${yield take(current)}`);
      });

      sput('reset');

      expect(spy).toBeCalledWithArgs(
        ['r1=foobar'],
        ['r2=foobar'],
        ['r3=foobar']
      );
    });
  });
  describe('when we use the same channel for multiple mutations', () => {
    xit('should mutate multiple states at once', () => {
      const s1 = state('foo');
      const s2 = state(12);

      s1.mutate('X', (value, payload) => value + payload);
      s2.mutate('X', (value, payload) => value * payload);

      sput('X', 3);
      sput('X', 10);

      expect(s1.get()).toBe('foo310');
      expect(s2.get()).toBe(360);
    });
    xit('should not mess up the state values', () => {
      const spy = jest.fn();
      const table = state([]);
      table.mutate('ADD', (elements, newElement) => [...elements, newElement]);
      const counter = state(0);
      counter.mutate('ADD', n => n + 1);

      go(function* A() {
        yield put('ADD', 20);
        yield put('ADD', 30);
        yield put('ADD', 12);
        spy(yield take(table));
        spy(yield take(counter));
      });

      expect(spy).toBeCalledWithArgs([[20, 30, 12]], [3]);
    });
  });
});
