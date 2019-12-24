import {
  state,
  take,
  put,
  sub,
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
      sub('R', spy);
      s.set('bar');
      expect(spy).toBeCalledWithArgs(['FOO'], ['BAR']);
    });
  });
  describe('when using the built-in READ and WRITE channels', () => {
    it('should work', () => {
      const s = state('foo');
      const spy = jest.fn();
      const spy2 = jest.fn();

      sub(s, spy);
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
      const spy2 = jest.fn();

      s.select('R', value => `value is ${value}`);
      s.mutate('W1', (current, newValue) => current + newValue);
      s.mutate('W2', (current, newValue) => current * newValue);

      sub('R', spy1);
      sub('R', spy2);
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
    it('should close the created channels', () => {
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
    it(`should
      * have non-blocking puts
      * have non-blocking takes
      * when no puts the take should resolve with the initial value`, () => {
      const s = state('foo');
      const spy = jest.fn();
      const listen = jest.fn();

      s.select('R', value => value.toUpperCase());
      s.mutate('W', (a, b) => a + b);

      sub(s, v => listen(`READ=${v}`));
      sub('R', v => listen(`R=${v}`));
      sub(s.WRITE, v => listen(`WRITE=${v}`));
      sub('W', v => listen(`W=${v}`));

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
    it('should wait till the routine is gone', async () => {
      const spy = jest.fn();
      const s = state('foo');
      const s2 = state('bar');

      s.mutate('W', function*(current, newOne) {
        yield sleep(5);
        return current + newOne + (yield take(s2));
      });

      sub(s, spy);
      sput('W', 'zoo');

      await delay(10);
      expect(spy).toBeCalledWithArgs(['foo'], ['foozoobar']);
    });
    it('should block the put till the mutator is done', async () => {
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
    it('should wait till the routine is gone', async () => {
      const spy = jest.fn();
      const s = state();

      s.select('IS', function*(word) {
        return word;
      });

      sub('IS', spy);
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

      sub(ch, spy);
      s1.select(ch);
      s2.select(ch, items => items.map(({ name }) => name).join('-'));
      s2.mutate('add', (items, newItem) => [...items, newItem]);

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

      sub(s, spy);
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
    it('should warn us if we try a take on a WRITE channel', () => {
      const current = state(0);
      const spy = jest.spyOn(console, 'warn').mockImplementation();

      current.mutate('reset', () => 0);

      go(function*() {
        yield take('reset');
      });

      expect(spy).toBeCalledWithArgs([
        'You are about to `take` from a state WRITE channel. This type of channel is using `ever` buffer which means that will resolve its takes and puts immediately. You probably want to use `sub(<channel>)`.',
      ]);
      spy.mockRestore();
    });
    it('should be possible to react on a mutation from within multiple routines', () => {
      const current = state('xxx');
      const spy = jest.fn();

      current.mutate('reset', () => 'foobar');

      go(function*() {
        yield sub('reset');
        spy(`r1=${yield take(current)}`);
      });
      go(function*() {
        yield sub('reset');
        spy(`r2=${yield take(current)}`);
      });
      go(function*() {
        yield sub('reset');
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
    it('should mutate multiple states at once', () => {
      const s1 = state('foo');
      const s2 = state(12);

      s1.mutate('X', (value, payload) => value + payload);
      s2.mutate('X', (value, payload) => value * payload);

      sput('X', 3);
      sput('X', 10);

      expect(s1.get()).toBe('foo310');
      expect(s2.get()).toBe(360);
    });
    it('should not mess up the state values', () => {
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
