import {
  chan,
  buffer,
  sub,
  subOnce,
  unsub,
  CHANNELS,
  go,
  reset,
  grid,
  take,
  put,
  sput,
  close,
  sleep,
} from '../index';
import { delay } from '../__helpers__';

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

        go(function*() {
          spyC(yield put('xxx', 'foo'));
          spyC(yield put('xxx', 'bar'));
        });
        go(function*() {
          yield take('xxx');
        });

        expect(spyA).toBeCalledWithArgs(['foo'], ['bar']);
        expect(spyB).toBeCalledWithArgs(['foo'], ['bar']);
        expect(spyC).toBeCalledWithArgs([true]);
      });
    });
    it('should provide an API for unsubscribing', () => {
      expect(Object.keys(CHANNELS.getAll())).toHaveLength(0);

      const spyA = jest.fn();
      const spyB = jest.fn();

      sub('a', spyA);
      sub('a', spyB);

      go(function*() {
        yield put('a', 'foo');
        unsub('a', spyA);
        yield put('a', 'bar');
      });
      go(function*() {
        yield take('a');
      });

      expect(spyA).toBeCalledWithArgs(['foo']);
      expect(spyB).toBeCalledWithArgs(['foo'], ['bar']);
    });
    it('should create a dedicated channel for each subscription', () => {
      expect(Object.keys(CHANNELS.getAll())).toHaveLength(0);

      const spyA = jest.fn();
      const spyB = jest.fn();

      sub('topicA', spyA);
      sub('topicB', spyB);

      go(function*() {
        yield put('topicA', 'foo');
        yield put('topicA', 'bar');
        yield put('topicB', 'baz');
      });
      go(function*() {
        yield take('topicA');
        yield take('topicA');
      });

      const gridNodes = grid.nodes().map(({ id }) => id);

      expect(gridNodes.includes('topicA')).toBe(true);
      expect(gridNodes.includes('topicB')).toBe(true);
      expect(spyA).toBeCalledWithArgs(['foo'], ['bar']);
      expect(spyB).toBeCalledWithArgs(['baz']);
    });
  });
  describe('when we subscribe to a channel after someone publish on it', () => {
    it(`should not trigger any of the subscriptions`, () => {
      expect(Object.keys(CHANNELS.getAll())).toHaveLength(0);

      const spyA = jest.fn();
      const spyB = jest.fn();

      go(function*() {
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

      expect(spy).toBeCalledWithArgs(['foo']);
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

      expect(spy).toBeCalledWithArgs(['foo']);
    });
    describe('and when we subOnce as part of another subOnce', () => {
      it('should subOnce again', () => {
        const spy = jest.fn();
        const ch = chan();
        const callback = v => {
          subOnce(ch, callback);
          spy(v);
        };

        subOnce(ch, callback);

        sput(ch, 'foo');
        sput(ch, 'bar');
        sput(ch, 'zar');

        expect(spy).toBeCalledWithArgs(['foo'], ['bar'], ['zar']);
      });
    });
    describe('and when the subscriber is a channel', () => {
      it('should subOnce again', () => {
        const spy = jest.fn();
        const source = chan();
        const subscriber = chan();

        subOnce(source, subscriber);

        go(function*() {
          spy(yield take(subscriber));
          spy(yield take(subscriber));
        });

        sput(source, 'foo');
        sput(source, 'bar');

        expect(spy).toBeCalledWithArgs(['foo']);
      });
    });
  });
  describe('when we sub inside a routine', () => {
    it('should do a sub once', () => {
      const spy = jest.fn();
      const ch = chan();

      go(function*() {
        spy('start');
        spy(yield sub(ch));
        spy('end');
      });

      sput(ch, 'foo');
      sput(ch, 'bar');
      sput(ch, 'zar');

      expect(spy).toBeCalledWithArgs(['start'], ['foo'], ['end']);
    });
    describe('and we want to make a loop inside the routine', () => {
      it('should allow us to wait for the same channel many times', () => {
        const spy = jest.fn();
        let counter = 0;

        go(function*() {
          spy(yield sub('XXX'));
          counter += 1;
          spy(`foo${counter}`);
          return go;
        });

        sput('XXX', 'a');
        sput('XXX', 'b');
        sput('XXX', 'c');

        expect(spy).toBeCalledWithArgs(
          ['a'],
          ['foo1'],
          ['b'],
          ['foo2'],
          ['c'],
          ['foo3']
        );
      });
    });
  });
  describe('when we sub and there is already a value in the channel', () => {
    it('should fire the callback at least once with the value', () => {
      const spy = jest.fn();
      const ch = chan(buffer.fixed(1));

      go(function*() {
        yield put(ch, 'foo');
        yield put(ch, 'bar'); // <-- here we stop
        spy('never');
      });
      sub(ch, spy);

      expect(spy).toBeCalledWithArgs(['foo']);
    });
    it('should allow us to turn that behavior off', () => {
      const spy = jest.fn();
      const ch = chan(buffer.fixed(1));

      go(function*() {
        yield put(ch, 'foo');
        yield put(ch, 'bar'); // <-- here we stop
        spy('never');
      });
      sub(ch, spy, { initialCall: false });

      expect(spy).not.toBeCalled();
    });
  });
  describe('when we use the transform function', () => {
    it('should change the value before it gets send to the `to` function/channel', () => {
      const spy = jest.fn();
      const ch = chan();

      sub(ch, spy, { transform: value => value.toUpperCase() });
      sput(ch, 'foo');
      sput(ch, 'bar');

      expect(spy).toBeCalledWithArgs(['FOO'], ['BAR']);
    });
    describe('and when the transform is async', () => {
      it('should slow down the operation on the `to` function/channel', async () => {
        const spy = jest.fn();
        const ch = chan();

        sub(ch, spy, {
          *transform(v) {
            yield sleep(2);
            return v.toUpperCase();
          },
        });
        sput(ch, 'foo');
        sput(ch, 'bar');

        await delay(10);
        expect(spy).toBeCalledWithArgs(['FOO'], ['BAR']);
      });
    });
  });
});
