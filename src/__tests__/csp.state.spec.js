import { state, take, put, sub, reset, getChannels, go, sput } from '../index';
import { delay } from '../__helpers__';

describe('Given a CSP state extension', () => {
  beforeEach(() => {
    reset();
  });
  describe('when we use the imperative get and set api', () => {
    it('should manage the state in a sync fashion', () => {
      const s = state('foo');
      const data = { bar: 42 };

      expect(s.get()).toBe('foo');
      s.set(data);
      expect(s.get()).toBe(data);
    });
    it('should trigger and selectors defined', () => {
      const s = state('foo');
      const spy = jest.fn();

      s.select('R', value => value.toUpperCase());
      sub('R', spy);

      s.set('bar');
      expect(spy).toBeCalledWithArgs([ 'FOO' ], [ 'BAR' ]);
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

      expect(spy1).toBeCalledWithArgs([ 'value is 10' ], [ 'value is 14' ], [ 'value is 26' ], [ 'value is 78' ]);
      expect(spy2).toBeCalledWithArgs([ 'value is 10' ], [ 'value is 14' ], [ 'value is 26' ], [ 'value is 78' ]);
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

      expect(Object.keys(getChannels())).toStrictEqual([ 'RR', 'WW' ]);
      s.destroy();
      expect(Object.keys(getChannels())).toStrictEqual([]);
    });
  });
  describe('when we use state into a generator routine', () => {
    it(`should
      * have a non-blocking takes`, () => {
      const s = state('foo');
      const log = jest.fn();

      s.select('get');
      s.mutate('set');
      s.mutate('xxx', (current, newV) => current + newV);
      s.select('up', current => current.toUpperCase());
      sub('up', value => log('sub=' + value));

      go(
        function * A() {
          log('>A');
          log('take1=' + (yield take('get')));
          log('take2=' + (yield take('get')));
          log('take3=' + (yield take('up')));
        },
        () => log('<A')
      );
      go(
        function * B() {
          log('>B');
          log('put1=' + (yield put('set', 'bar')));
          log('put2=' + (yield put('xxx', 'moo')));
          log('put3=' + (yield put('xxx', 'ko')));
        },
        () => log('<B')
      );

      expect(log).toBeCalledWithArgs(
        [ 'sub=FOO' ],
        [ '>A' ],
        [ '>B' ],
        [ 'take1=bar' ],
        [ 'sub=BAR' ],
        [ 'put1=true' ],
        [ 'take2=barmoo' ],
        [ 'sub=BARMOO' ],
        [ 'put2=true' ],
        [ 'take3=BARMOOKO' ],
        [ '<A' ],
        [ 'put3=true' ],
        [ '<B' ]
      );
    });
  });
});
