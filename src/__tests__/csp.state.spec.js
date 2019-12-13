import { state, topic, sub, reset, getTopics, go } from '../index';

describe('Given a CSP state extension', () => {
  beforeEach(() => {
    reset();
  });
  describe('when we use the built-in get and set', () => {
    it('should retrieve and change the state value', () => {
      const s = state(10);
      const spy1 = jest.fn();
      const spy2 = jest.fn();

      s.select('R', value => `value is ${value}`);
      s.mutate('W1', (current, newValue) => current + newValue);
      s.mutate('W2', (current, newValue) => current * newValue);

      sub('R', spy1);
      sub('R', spy2);
      topic('W1').put(4);
      topic('W1').put(12);
      topic('W2').put(3);

      expect(spy1).toBeCalledWithArgs([ 'value is 10' ], [ 'value is 14' ], [ 'value is 26' ], [ 'value is 78' ]);
      expect(spy2).toBeCalledWithArgs([ 'value is 10' ], [ 'value is 14' ], [ 'value is 26' ], [ 'value is 78' ]);
    });
  });
  describe('when we try creating a topic with the same name', () => {
    it('should throw an error', () => {
      const s = state(10);

      s.select('R');
      expect(() => s.select('R')).toThrowError('Topic with name R already exists.');
    });
  });
  describe('when we destroy the state', () => {
    it('should halt the created topics', () => {
      const s = state('foo');

      s.select('R');
      s.select('W');

      expect(Object.keys(getTopics())).toHaveLength(4);
      s.destroy();
      expect(Object.keys(getTopics())).toHaveLength(0);
    });
  });
  describe('when we use the built-in read and write channels', () => {
    it('should get and set the state value', () => {
      const s = state('foo');
      const s2 = state('a');
      const spy = jest.fn();
      const spy2 = jest.fn();

      sub(s.GET, spy);
      sub(s2.GET, spy2);

      topic(s.SET).put('bar');
      topic(s2.SET).put('b');

      expect(spy).toBeCalledWithArgs([ 'foo' ], [ 'bar' ]);
      expect(spy2).toBeCalledWithArgs([ 'a' ], [ 'b' ]);
    });
  });
  describe('when we want to get the value by using the `getValue` method', () => {
    it('should return the current state value', () => {
      const s = state('foo');

      expect(s.getValue()).toBe('foo');
      topic(s.SET).put('bar');
      expect(s.getValue()).toBe('bar');
    });
  });
  describe('when we use state into a generator routine', () => {
    it(`should
      * have a non-blocking takes`, async () => {
      const s = state('foo');
      const log = jest.fn();

      s.mutate('xxx', (current, newV) => current + newV);
      s.select('up', current => current.toUpperCase());
      sub('up', value => log('sub=' + value));

      go(
        function * A({ take }) {
          log('>A');
          log('take1=' + (yield take(s.GET)));
          log('take2=' + (yield take(s.GET)));
          log('take3=' + (yield take('up')));
        },
        () => log('<A')
      );
      go(
        function * B({ put }) {
          log('>B');
          log('put1=' + (yield put(s.SET, 'bar')));
          log('put2=' + (yield put('xxx', 'moo')));
        },
        () => log('<B')
      );

      expect(log).toBeCalledWithArgs(
        [ 'sub=FOO' ],
        [ '>A' ],
        [ 'take1=foo' ],
        [ 'take2=foo' ],
        [ 'take3=FOO' ],
        [ '<A' ],
        [ '>B' ],
        [ 'sub=BAR' ],
        [ 'put1=true' ],
        [ 'sub=BARMOO' ],
        [ 'put2=true' ],
        [ '<B' ]
      );
    });
  });
});
