import {
  chan,
  buffer,
  read,
  sread,
  unread,
  CHANNELS,
  go,
  reset,
  grid,
  take,
  put,
  sput,
  close,
  sleep,
  ONE_OF,
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

        sread('xxx', spyA, { listen: true });
        sread('xxx', spyB, { listen: true });

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

      sread('a', spyA, { listen: true });
      sread('a', spyB, { listen: true });

      go(function*() {
        yield put('a', 'foo');
        unread('a', spyA);
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

      sread('topicA', spyA, { listen: true });
      sread('topicB', spyB, { listen: true });

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

      read('topic', spyA);
      read('topic', spyB);

      expect(spyA).not.toBeCalled();
      expect(spyB).not.toBeCalled();
    });
  });
  describe('when we pass a channel instead of a string to the sub function', () => {
    it('should still work', () => {
      const spy = jest.fn();
      const ch = chan();

      sread(ch, spy);
      sput(ch, 'foo');
      close(ch);
      sput(ch, 'bar');

      expect(spy).toBeCalledWithArgs(['foo']);
    });
  });
  describe('when we use read once (by default)', () => {
    it('should unsubscribe after the first call', () => {
      const spy = jest.fn();
      const ch = chan();

      sread(ch, spy);

      sput(ch, 'foo');
      sput(ch, 'bar');
      sput(ch, 'zar');

      expect(spy).toBeCalledWithArgs(['foo']);
    });
    describe('and when we read once as part of another read once', () => {
      it('should read once again', () => {
        const spy = jest.fn();
        const ch = chan();
        const callback = v => {
          sread(ch, callback);
          spy(v);
        };

        sread(ch, callback);

        sput(ch, 'foo');
        sput(ch, 'bar');
        sput(ch, 'zar');

        expect(spy).toBeCalledWithArgs(['foo'], ['bar'], ['zar']);
      });
    });
    describe('and when the subscriber is a channel', () => {
      it('should read once again', () => {
        const spy = jest.fn();
        const source = chan();
        const subscriber = chan();

        sread(source, subscriber);

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
  describe('when we read inside a routine', () => {
    it('should do read once', () => {
      const spy = jest.fn();
      const ch = chan();

      go(function*() {
        spy('start');
        spy(yield read(ch));
        spy('end');
      });

      sput(ch, 'foo');
      sput(ch, 'bar');
      sput(ch, 'zar');

      expect(spy).toBeCalledWithArgs(['start'], ['foo'], ['end']);
    });
    describe('and when there is already a value in the channel', () => {
      it('should perform a non-blocking read', () => {
        const ch = chan(buffer.fixed(1));
        const spy = jest.fn();

        go(function* A() {
          spy('A starts');
          yield put(ch, 42);
          spy('A ends');
        });
        go(function* B() {
          spy('B starts');
          spy(yield read(ch));
          spy('B ends');
        });

        expect(spy).toBeCalledWithArgs(
          ['A starts'],
          ['A ends'],
          ['B starts'],
          [42],
          ['B ends']
        );
        expect(ch.value()).toStrictEqual([42]);
      });
    });
    describe('and we want to make a loop inside the routine', () => {
      it('should allow us to wait for the same channel many times', () => {
        const spy = jest.fn();
        let counter = 0;

        go(function*() {
          spy(yield read('XXX'));
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
  describe('when we read and there is already a value in the channel', () => {
    it('should fire the callback at least once with the value', () => {
      const spy = jest.fn();
      const ch = chan(buffer.fixed(1));

      go(function*() {
        yield put(ch, 'foo');
        yield put(ch, 'bar'); // <-- here we stop
        spy('never');
      });
      sread(ch, spy);

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
      read(ch, spy, { initialCall: false });

      expect(spy).not.toBeCalled();
    });
  });
  describe('when we use the transform function', () => {
    it('should change the value before it gets send to the `to` function/channel', () => {
      const spy = jest.fn();
      const ch = chan();

      sread(ch, spy, {
        transform: value => value.toUpperCase(),
        listen: true,
      });
      sput(ch, 'foo');
      sput(ch, 'bar');

      expect(spy).toBeCalledWithArgs(['FOO'], ['BAR']);
    });
    describe('and when the transform is async', () => {
      it('should slow down the operation on the `to` function/channel', async () => {
        const spy = jest.fn();
        const ch = chan();

        sread(ch, spy, {
          *transform(v) {
            yield sleep(2);
            return v.toUpperCase();
          },
          listen: true,
        });
        sput(ch, 'foo');
        sput(ch, 'bar');

        await delay(10);
        expect(spy).toBeCalledWithArgs(['FOO'], ['BAR']);
      });
    });
  });
  describe('when we use ON_OFF strategy', () => {
    describe('and we use `sub` function', () => {
      it('should fire the callback without waiting for all the channels', () => {
        const ch1 = chan();
        const ch2 = chan();
        const spy = jest.fn();

        sread([ch1, ch2], spy, { strategy: ONE_OF, listen: true });

        sput(ch1, 'foo');
        sput(ch2, 'bar');
        sput(ch1, 'zoo');

        expect(spy).toBeCalledWithArgs(['foo', 0], ['bar', 1], ['zoo', 0]);
      });
    });
    describe('and we use `read` in a routine', () => {
      it('should unblock when one of the channels receives value', () => {
        const ch1 = chan();
        const ch2 = chan();
        const spy = jest.fn();

        go(function*() {
          const v = yield read([ch1, ch2], { strategy: ONE_OF });
          spy(v);
          return go;
        });

        sput(ch1, 'foo');
        sput(ch2, 'bar');

        expect(spy).toBeCalledWithArgs(['foo'], ['bar']);
      });
    });
  });
  describe('when we use `sread().listen()`', () => {
    it('should set the `listen` option to `true`', () => {
      const ch = chan();
      const ch2 = chan();
      const spy1 = jest.fn();
      const spy2 = jest.fn();
      const spy3 = jest.fn();

      sread(ch, spy1);
      sread(ch, spy2).listen();
      sread([ch, ch2], spy3, { strategy: ONE_OF }).listen();

      sput(ch, 'foo');
      sput(ch2, 'a');
      sput(ch, 'bar');
      sput(ch2, 'b');
      sput(ch, 'moo');
      sput(ch2, 'c');

      expect(spy1).toBeCalledWithArgs(['foo']);
      expect(spy2).toBeCalledWithArgs(['foo'], ['bar'], ['moo']);
      expect(spy3).toBeCalledWithArgs(
        ['foo', 0],
        ['a', 1],
        ['bar', 0],
        ['b', 1],
        ['moo', 0],
        ['c', 1]
      );
    });
  });
});
