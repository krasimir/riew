import { state, take, put, sub, reset, CHANNELS, go, sput, stake, sleep, chan } from '../index';
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
      expect(spy).toBeCalledWithArgs([ 'BAR' ]);
    });
  });
  describe('when using the built-in READ and WRITE channels', () => {
    it('should work', () => {
      const s = state('foo');
      const spy = jest.fn();
      const spy2 = jest.fn();

      sub(s.READ, spy);
      stake(s.READ, spy2);
      sput(s.WRITE, 'bar');
      stake(s.READ, spy2);

      expect(spy).toBeCalledWithArgs([ 'bar' ]);
      expect(spy2).toBeCalledWithArgs([ 'foo' ], [ 'bar' ]);
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

      expect(spy1).toBeCalledWithArgs([ 'value is 14' ], [ 'value is 26' ], [ 'value is 78' ]);
      expect(spy2).toBeCalledWithArgs([ 'value is 14' ], [ 'value is 26' ], [ 'value is 78' ]);
    });
  });
  describe('when we try creating a channel with the same name', () => {
    it('should throw an error', () => {
      const s = state(10);

      s.select('R');
      expect(() => s.select('R')).toThrowError('Channel with name R already exists.');
    });
  });
  describe('when we destroy the state', () => {
    it('should close the created channels', () => {
      const s = state('foo');

      s.select('RR');
      s.select('WW');

      expect(Object.keys(CHANNELS.getAll())).toStrictEqual([ s.READ, s.WRITE, 'RR', 'WW' ]);
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

      sub(s.READ, v => listen('READ=' + v));
      sub(s.WRITE, v => listen('WRITE=' + v));
      sub('R', v => listen('R=' + v));
      sub('W', v => listen('W=' + v));

      go(function * () {
        spy(yield take(s.READ));
        spy(yield take('R'));
        spy(yield put(s.WRITE, 'bar'));
        spy(yield take(s.READ));
        spy(yield take('R'));
        spy(yield put('W', 'hello world my friend'));
        spy(yield take(s.READ));
        spy(yield take('R'));
      });

      expect(spy).toBeCalledWithArgs(
        [ 'foo' ],
        [ 'FOO' ],
        [ true ],
        [ 'bar' ],
        [ 'BAR' ],
        [ true ],
        [ 'barhello world my friend' ],
        [ 'BARHELLO WORLD MY FRIEND' ]
      );
      expect(listen).toBeCalledWithArgs(
        [ 'READ=bar' ],
        [ 'R=BAR' ],
        [ 'WRITE=bar' ],
        [ 'READ=barhello world my friend' ],
        [ 'R=BARHELLO WORLD MY FRIEND' ],
        [ 'W=hello world my friend' ]
      );
    });
  });
  describe('when we have async mutation', () => {
    it('should wait till the mutation is done', async () => {
      const spy = jest.fn();
      const s = state('foo');

      s.mutate('W', async (current, newOne) => {
        await delay(5);
        return current + newOne;
      });

      sub(s.READ, spy);
      sput('W', 'bar');

      await delay(10);
      expect(spy).toBeCalledWithArgs([ 'foobar' ]);
    });
  });
  describe('when we have a routine as mutation', () => {
    it('should wait till the routine is gone', async () => {
      const spy = jest.fn();
      const s = state('foo');
      const s2 = state('bar');

      s.mutate('W', function * (current, newOne) {
        yield sleep(5);
        return current + newOne + (yield take(s2.READ));
      });

      sub(s.READ, spy);
      sput('W', 'zoo');

      await delay(10);
      expect(spy).toBeCalledWithArgs([ 'foo' ], [ 'foozoobar' ]);
    });
  });
  describe('when we use a generator as a selector', () => {
    it('should wait till the routine is gone', async () => {
      const spy = jest.fn();
      const s = state();

      s.select('IS', function * (word) {
        return word;
      });

      sub('IS', spy);
      sput(s.WRITE, 'bar');
      sput(s.WRITE, 'zar');

      await delay(2);
      expect(spy).toBeCalledWithArgs([ 'bar' ], [ 'zar' ]);
    });
  });
  describe('when we use an async function as a selector', () => {
    it('should wait till the routine is gone', async () => {
      const spy = jest.fn();
      const s = state('foo');

      s.select('IS', async function (word) {
        await delay(2);
        return word;
      });

      await delay(4);
      sub('IS', v => spy('sub=' + v));
      stake('IS', v => spy('stake=' + v));
      sput(s.WRITE, 'bar');
      sput(s.WRITE, 'zar');

      await delay(10);
      expect(spy).toBeCalledWithArgs([ 'stake=foo' ], [ 'sub=bar' ], [ 'sub=zar' ]);
    });
  });
  describe('when we pass an already existing channel as a selector', () => {
    it('should put selected values to that channel', () => {
      const ch = chan('XXX');
      const s1 = state('foo');
      const s2 = state([ { name: 'A' }, { name: 'B' } ]);
      const spy = jest.fn();

      sub(ch, spy);
      s1.select(ch);
      s2.select(ch, items => {
        return items.map(({ name }) => name).join('-');
      });
      s2.mutate('add', (items, newItem) => [ ...items, newItem ]);

      sput(s1.WRITE, 'bar');
      sput('add', { name: 'C' });

      expect(spy).toBeCalledWithArgs([ 'foo' ], [ 'A-B' ], [ 'bar' ], [ 'A-B-C' ]);
    });
  });
  describe('when we pass an already existing channel as a mutator', () => {
    it('should mutate every time when we put to that channel', () => {
      const ch = chan();
      const s = state('a');
      const spy = jest.fn();

      sub(s.READ, spy);
      s.mutate(ch, (a, b) => a + b);

      sput(s.WRITE, 'hello-');
      sput(ch, 'd');
      sput(ch, 'e');

      expect(spy).toBeCalledWithArgs([ 'hello-' ], [ 'hello-d' ], [ 'hello-de' ]);
    });
  });
});
