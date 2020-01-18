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
  sliding,
  fixed,
  sread,
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
      const r = s.select(value => value.toUpperCase());
      expect(r.buff.getValue()).toStrictEqual(['foo']);
      sread(r, v => expect(v).toStrictEqual('FOO'));

      listen(r, spy, { initialCall: true });
      s.set('bar');
      expect(spy).toBeCalledWithArgs(['FOO'], ['BAR']);
    });
  });
  describe('when we create state channels', () => {
    it('should create only sliding channels with already populated value', () => {
      const s1 = state('foo');
      expect(s1.select().buff.getValue()).toStrictEqual(['foo']);
      expect(s1.mutate().buff.getValue()).toStrictEqual(['foo']);
      const s2 = state();
      expect(s2.select().buff.getValue()).toStrictEqual([null]);
      expect(s2.mutate().buff.getValue()).toStrictEqual([null]);
    });
    describe('and we create a selector', () => {
      it('should return a channel which value is always calculated via the select function and the state value is always the canonical one', () => {
        const s = state('foo');
        const sel = s.select(v => v.toUpperCase());
        const spy = jest.fn();

        expect(s.get()).toBe('foo');
        sread(sel, spy);
        sread(sel, spy);
        sread(sel, spy);
        sput(s, 'bar');
        expect(s.get()).toBe('bar');
        sread(sel, spy);
        sread(sel, spy);
        expect(spy).toBeCalledWithArgs(
          ['FOO'],
          ['FOO'],
          ['FOO'],
          ['BAR'],
          ['BAR']
        );
      });
      it('should keep the selectors independent', () => {
        const s = state('Foo');
        const sel1 = s.select(v => v.toUpperCase());
        const sel2 = s.select(v => v.toLowerCase());
        const spy = jest.fn();

        expect(s.get()).toBe('Foo');
        sread(sel1, spy);
        sread(sel2, spy);
        s.set('Bar');
        expect(s.get()).toBe('Bar');
        sread(sel1, spy);
        sread(sel2, spy);
        expect(spy).toBeCalledWithArgs(['FOO'], ['foo'], ['BAR'], ['bar']);
      });
    });
    describe('and when we create mutators', () => {
      it('should sync all the selectors', () => {
        const s = state('Foo');
        const sel1 = s.select(v => v.toUpperCase());
        const sel2 = s.select(v => v.toLowerCase());
        const m = s.mutate((_, v) => v);
        const spy = jest.fn();

        expect(s.get()).toBe('Foo');
        sread(sel1, spy);
        sread(sel2, spy);
        sput(m, 'Bar');
        expect(s.get()).toBe('Bar');
        sread(sel1, spy);
        sread(sel2, spy);
        sread(s, spy);
        expect(spy).toBeCalledWithArgs(
          ['FOO'],
          ['foo'],
          ['BAR'],
          ['bar'],
          ['Bar']
        );
      });
      it('should sync also mutators', () => {
        const s = state('Foo');
        const m1 = s.mutate(() => 'Bar');
        const m2 = s.mutate(() => 'Zar');
        const spy = jest.fn();

        expect(s.get()).toBe('Foo');
        sread(m1, spy);
        sread(m2, spy);
        sput(m1);
        expect(s.get()).toBe('Bar');
        sread(m1, spy);
        sread(m2, spy);
        sput(m2);
        expect(s.get()).toBe('Zar');
        sread(m1, spy);
        sread(m2, spy);
        expect(spy).toBeCalledWithArgs(
          ['Foo'],
          ['Foo'],
          ['Bar'],
          ['Bar'],
          ['Zar'],
          ['Zar']
        );
      });
      it('should allow listening when we mutate', () => {
        const s = state('foo');
        const sel = s.select(v => `Value is ${v}`);
        const spy = jest.fn();

        listen(sel, spy);
        sput(s, 'bar');
        expect(spy).toBeCalledWithArgs(['Value is bar']);
      });
    });
    describe('and we take from a selector', () => {
      const s = state('foo');
      const sel = s.select(v => `Value is ${v}`);
      const spy = jest.fn();

      go(function*() {
        spy(yield take(sel));
        return go;
      });
      sput(s, 'bar');
      sput(s, '000');
      expect(spy).toBeCalledWithArgs(
        ['Value is foo'],
        ['Value is bar'],
        ['Value is 000']
      );
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

      const R = s.select(value => `value is ${value}`);
      const W1 = s.mutate((current, newValue) => current + newValue);
      const W2 = s.mutate((current, newValue) => current * newValue);

      listen(R, spy1, { initialCall: true });
      sput(W1, 4);
      sput(W1, 12);
      sput(W2, 3);

      expect(spy1).toBeCalledWithArgs(
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
      const RR = sliding();
      const WW = sliding();

      s.select(RR);
      s.select(WW);

      expect(Object.keys(CHANNELS.getAll())).toStrictEqual([
        s.READ.id,
        s.WRITE.id,
        RR.id,
        WW.id,
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
      const listenSpy = jest.fn();
      const R = sliding();
      const W = sliding();

      s.select(R, value => value.toUpperCase());
      s.mutate(W, (a, b) => a + b);

      listen(s, v => listenSpy(`READ=${v}`), { initialCall: true });
      listen(R, v => listenSpy(`R=${v}`), { initialCall: true });
      listen(s.WRITE, v => listenSpy(`WRITE=${v}`));
      listen(W, v => listenSpy(`W=${v}`));

      go(function*() {
        spy(yield take(s));
        spy(yield take(R));
        spy(yield put(s, 'bar'));
        spy(yield take(s));
        spy(yield take(R));
        spy(yield put(W, 'hello world my friend'));
        spy(yield take(s));
        spy(yield take(R));
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
    xit('should wait till the routine is gone', async () => {
      const spy = jest.fn();
      const s = state('foo');
      const s2 = state('bar');
      const W = sliding();

      s.mutate(W, function*(current, newOne) {
        yield sleep(5);
        return current + newOne + (yield take(s2));
      });

      listen(s, spy, { initialCall: true });
      sput(W, 'zoo');

      await delay(10);
      expect(spy).toBeCalledWithArgs(['foo'], ['foozoobar']);
    });
    xit('should block the put till the mutator is done', async () => {
      const spy = jest.fn();
      const s = state('foo');
      const W = sliding();

      s.mutate(W, function*(current, newOne) {
        yield sleep(5);
        return current + newOne;
      });

      go(function*() {
        yield put(W, 'bar');
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
      const IS = sliding();

      s.select(IS, function*(word) {
        return word;
      });

      listen(IS, spy);
      sput(s, 'bar');
      sput(s, 'zar');

      await delay(2);
      expect(spy).toBeCalledWithArgs(['bar'], ['zar']);
    });
  });
  describe('when we pass an already existing channel as a selector', () => {
    xit('should put selected values to that channel', () => {
      const ch = fixed();
      const s1 = state('foo');
      const s2 = state([{ name: 'A' }, { name: 'B' }]);
      const spy = jest.fn();
      const add = sliding('add');

      listen(ch, spy);
      s1.select(ch);
      s2.select(ch, items => items.map(({ name }) => name).join('-'));
      s2.mutate(add, (items, newItem) => [...items, newItem]);

      sput(s1, 'bar');
      sput(add, { name: 'C' });

      expect(spy).toBeCalledWithArgs(['foo'], ['A-B'], ['bar'], ['A-B-C']);
    });
  });
  describe('when we pass an already existing channel as a mutator', () => {
    xit('should mutate every time when we put to that channel', () => {
      const ch = fixed();
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
    xit('should mutate both states', () => {
      const s1 = state('foo');
      const s2 = state(12);
      const X = fixed();
      const X1 = sliding();
      const X2 = sliding();

      s1.mutate(X1, (value, payload) => value + payload);
      s2.mutate(X2, (value, payload) => value * payload);

      listen(X, X1);
      listen(X, X2);

      sput(X, 3);
      sput(X, 10);

      expect(s1.get()).toBe('foo310');
      expect(s2.get()).toBe(360);
    });
  });
  describe('when using same channel for mutations on different states', () => {
    xit('should work for both states', () => {
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
