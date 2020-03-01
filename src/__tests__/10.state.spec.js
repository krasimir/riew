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
      expect(s2.select().buff.getValue()).toStrictEqual([undefined]);
      expect(s2.mutate().buff.getValue()).toStrictEqual([undefined]);
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
      it('should consume the value and provide blocking takes', () => {
        const s = state('foo');
        const sel = s.select(v => `Value is ${v}`);
        const spy = jest.fn();

        go(function*() {
          spy(yield take(sel));
          return go;
        });
        sput(s, 'bar');
        sput(s, '001');
        expect(spy).toBeCalledWithArgs(
          ['Value is foo'],
          ['Value is bar'],
          ['Value is 001']
        );
      });
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
    it('should close the created channels', () => {
      const s = state('foo');
      const RR = s.select();
      const WW = s.select();

      expect(Object.keys(CHANNELS.getAll())).toStrictEqual([
        s.DEFAULT.id,
        RR.id,
        WW.id,
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

      const R = s.select(value => value.toUpperCase());
      const W = s.mutate((a, b) => a + b);

      listen(s, v => listenSpy(`DEFAULT=${v}`), { initialCall: true });
      listen(R, v => listenSpy(`R=${v}`), { initialCall: true });
      listen(W, v => listenSpy(`W=${v}`), { initialCall: true });

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
        ['DEFAULT=foo'],
        ['R=FOO'],
        ['W=foo'],
        ['R=BAR'],
        ['W=bar'],
        ['DEFAULT=bar'],
        ['DEFAULT=barhello world my friend'],
        ['R=BARHELLO WORLD MY FRIEND'],
        ['W=barhello world my friend']
      );
    });
  });
  describe('when we have a routine as mutation', () => {
    it('should wait till the routine is gone', async () => {
      const spy = jest.fn();
      const s = state('foo');
      const s2 = state('bar');

      const W = s.mutate(function*(current, newOne) {
        yield sleep(5);
        return current + newOne + (yield take(s2));
      });

      listen(s, spy, { initialCall: true });
      sput(W, 'zoo');

      await delay(10);
      expect(spy).toBeCalledWithArgs(['foo'], ['foozoobar']);
    });
    it('should block the put till the mutator is done', async () => {
      const spy = jest.fn();
      const s = state('foo');

      const W = s.mutate(function*(current, newOne) {
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
    it('should wait till the routine is gone', async () => {
      const spy = jest.fn();
      const s = state();

      const IS = s.select(function*(word) {
        return word;
      });

      listen(IS, spy);
      sput(s, 'bar');
      sput(s, 'zar');

      await delay(2);
      expect(spy).toBeCalledWithArgs(['bar'], ['zar']);
    });
  });
  describe('when we pipe from one channel to two mutation channels', () => {
    it('should mutate both states', () => {
      const s1 = state('foo');
      const s2 = state(12);
      const X = fixed();

      const X1 = s1.mutate((value, payload) => value + payload);
      const X2 = s2.mutate((value, payload) => value * payload);

      listen(X, X1);
      listen(X, X2);

      sput(X, 3);
      sput(X, 10);

      expect(s1.get()).toBe('foo310');
      expect(s2.get()).toBe(360);
    });
  });

  describe('when we use the instance of a state as a tagged template', () => {
    it('should set the name of the channel', () => {
      const s = state(0)`foobar`;
      sput(s, 42);
      stake(s, v => expect(v).toBe(42));
      expect(s.name).toBe('foobar');
    });
    it('should set the name of the channel even if we pass a dynamic name', () => {
      const name = 'XXX';
      const s = state(0)`a${name}b`;
      sput(s, 42);
      stake(s, v => expect(v).toBe(42));
      expect(s.name).toBe('aXXXb');
    });
  });
});
