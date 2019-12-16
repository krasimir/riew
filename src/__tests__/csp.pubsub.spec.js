import { chan, sub, subOnce, unsub, CHANNELS, go, reset, grid, take, put, sput, close } from '../index';

describe('Given a CSP pubsub extension', () => {
  beforeEach(() => {
    reset();
  });
  describe('when we subscribe to a channel', () => {
    describe('and we put to the same channel', () => {
      it(`should
        * call our callbacks
        * should keep the blocking nature of the put operation`, () => {
        expect(Object.keys(CHANNELS.getAll())).toHaveLength(0);

        const spyA = jest.fn();
        const spyB = jest.fn();
        const spyC = jest.fn();

        sub('xxx', spyA);
        sub('xxx', spyB);

        go(function * () {
          spyC(yield put('xxx', 'foo'));
          spyC(yield put('xxx', 'bar'));
        });
        go(function * () {
          yield take('xxx');
        });

        expect(spyA).toBeCalledWithArgs([ 'foo' ], [ 'bar' ]);
        expect(spyB).toBeCalledWithArgs([ 'foo' ], [ 'bar' ]);
        expect(spyC).toBeCalledWithArgs([ true ]);
      });
    });
    it('should provide an API for unsubscribing', () => {
      expect(Object.keys(CHANNELS.getAll())).toHaveLength(0);

      const spyA = jest.fn();
      const spyB = jest.fn();

      sub('a', spyA);
      sub('a', spyB);

      go(function * () {
        yield put('a', 'foo');
        unsub('a', spyA);
        yield put('a', 'bar');
      });
      go(function * () {
        yield take('a');
      });

      expect(spyA).toBeCalledWithArgs([ 'foo' ]);
      expect(spyB).toBeCalledWithArgs([ 'foo' ], [ 'bar' ]);
    });
    it('should create a dedicated channel for each subscription', () => {
      expect(Object.keys(CHANNELS.getAll())).toHaveLength(0);

      const spyA = jest.fn();
      const spyB = jest.fn();

      sub('topicA', spyA);
      sub('topicB', spyB);

      go(function * () {
        yield put('topicA', 'foo');
        yield put('topicA', 'bar');
        yield put('topicB', 'baz');
      });
      go(function * () {
        yield take('topicA');
        yield take('topicA');
      });

      const gridNodes = grid.nodes().map(({ id }) => id);

      expect(gridNodes.includes('topicA')).toBe(true);
      expect(gridNodes.includes('topicB')).toBe(true);
      expect(spyA).toBeCalledWithArgs([ 'foo' ], [ 'bar' ]);
      expect(spyB).toBeCalledWithArgs([ 'baz' ]);
    });
  });
  describe('when we subscribe to a channel after someone publish on it', () => {
    it(`should not trigger any of the subscriptions`, () => {
      expect(Object.keys(CHANNELS.getAll())).toHaveLength(0);

      const spyA = jest.fn();
      const spyB = jest.fn();

      go(function * () {
        yield put('topic', 'foo');
      });

      sub('topic', spyA);
      sub('topic', spyB);

      expect(spyA).not.toBeCalled();
      expect(spyB).not.toBeCalled();
    });
  });
  describe('when we pass a channel instead of a string to the sub function', () => {
    it('should still work', () => {
      const spy = jest.fn();
      const ch = chan();

      sub(ch, spy);
      sput(ch, 'foo');
      close(ch);
      sput(ch, 'bar');

      expect(spy).toBeCalledWithArgs([ 'foo' ]);
    });
  });
  describe('when we use subOnce', () => {
    it('should unsubscribe after the first call', () => {
      const spy = jest.fn();
      const ch = chan();

      subOnce(ch, spy);

      sput(ch, 'foo');
      sput(ch, 'bar');
      sput(ch, 'zar');

      expect(spy).toBeCalledWithArgs([ 'foo' ]);
    });
  });
  describe('when we sub inside a routine', () => {
    it('should do a sub once', () => {
      const spy = jest.fn();
      const ch = chan();

      go(function * () {
        spy('start');
        spy(yield sub(ch));
        spy('end');
      });

      sput(ch, 'foo');
      sput(ch, 'bar');
      sput(ch, 'zar');

      expect(spy).toBeCalledWithArgs([ 'start' ], [ 'foo' ], [ 'end' ]);
    });
  });
});
