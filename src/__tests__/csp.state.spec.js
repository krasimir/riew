import { state, take, put, sub, reset, getChannels, go, sput, stake } from '../index';
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

      expect(Object.keys(getChannels())).toStrictEqual([ s.READ, s.WRITE, 'RR', 'WW' ]);
      s.destroy();
      expect(Object.keys(getChannels())).toStrictEqual([]);
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
});
