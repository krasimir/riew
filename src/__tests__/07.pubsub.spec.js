import {
  chan,
  buffer,
  read,
  sread,
  CHANNELS,
  go,
  reset,
  grid,
  take,
  put,
  sput,
  close,
  ONE_OF,
  state,
  stake,
  unreadAll,
} from '../index';
import { Test, exercise } from '../__helpers__';

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

      const unread = sread('a', spyA, { listen: true });
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
    it('should create a dedicated take for each subscription', () => {
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
  describe('when we pass a channel instead of a string to the read functions', () => {
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
    it('should subscribe only once', () => {
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
        sput(ch1, 'bar');
        sput(ch2, 'zar');

        expect(spy).toBeCalledWithArgs(['foo'], ['bar'], ['zar']);
      });
    });
  });
  describe('when piping', () => {
    it('take from one channel and pass it to another', () => {
      const c1 = chan();
      const c2 = chan();
      const spy = jest.fn();

      sread(c1, c2, { listen: true });

      go(function*() {
        spy(`put1=${yield put(c1, 'foo')}`);
        spy(`put2=${yield put(c1, 'bar')}`);
      });
      go(function*() {
        spy(`take1=${yield take(c2)}`);
        spy(`take2=${yield take(c2)}`);
      });
      sput(c1, 'baz');

      expect(spy).toBeCalledWithArgs(['take1=foo'], ['take2=baz']);
    });
  });
  describe('when composing two channels', () => {
    it(`should
      * aggregate value
      * put to the 'to' channel only if all the source channels receive data`, () => {
      const c1 = chan();
      const c2 = chan();
      const c3 = chan();
      const spy = jest.fn();

      sread([c1, c2], c3, { listen: true });
      sread(c3, spy, { listen: true });
      sput(c1, 'foo');
      sput(c2, 'bar');
      sput(c1, 'baz');

      expect(spy).toBeCalledWithArgs([['foo', 'bar']], [['baz', 'bar']]);
    });
    it('should allow us to transform', () => {
      const c1 = chan();
      const c2 = chan();
      const c3 = chan();
      const spy = jest.fn();

      sread(
        [c1, c2],
        ([a, b]) => {
          sput(c3, a.toUpperCase() + b.toUpperCase());
        },
        {
          listen: true,
        }
      );
      sread(c3, spy, { listen: true });
      sput(c1, 'foo');
      sput(c2, 'bar');
      sput(c1, 'baz');

      expect(spy).toBeCalledWithArgs(['FOOBAR'], ['BAZBAR']);
    });
    describe('and when we use state', () => {
      it('should aggregate state values', () => {
        const users = state([
          { name: 'Joe' },
          { name: 'Steve' },
          { name: 'Rebeka' },
        ]);
        const currentUser = state(1);
        const spy = jest.fn();

        sread('app', spy, { listen: true });
        sread(
          [users, currentUser],
          ([us, currentUserIndex]) => {
            sput('app', us[currentUserIndex].name);
          },
          { listen: true }
        );

        sput(currentUser, 2);

        expect(spy).toBeCalledWithArgs(['Steve'], ['Rebeka']);
      });
    });
    describe('when we use state together with a routine', () => {
      it('should work just fine', () => {
        const users = state([
          { name: 'Joe' },
          { name: 'Steve' },
          { name: 'Rebeka' },
        ]);
        const currentUser = state(1);
        const spy = jest.fn();

        sread(
          [users, currentUser],
          ([us, currentUserIndex]) => {
            sput('app', us[currentUserIndex].name);
          },
          { listen: true }
        );

        go(function*() {
          spy(yield take('app'));
          spy(yield take('app'));
        });
        go(function*() {
          spy(yield put(currentUser, 2));
        });

        expect(spy).toBeCalledWithArgs(['Steve'], ['Rebeka'], [true]);
      });
    });
    describe('when we use sread by passing a string for a channel', () => {
      it('should create a channel with a MemoryBuffer', () => {
        const users = state([
          { name: 'Joe' },
          { name: 'Steve' },
          { name: 'Rebeka' },
        ]);
        const currentUser = state(1);
        const spy = jest.fn();

        users.mutate('WWW', arr =>
          arr.map((user, i) => {
            if (i === 2) return { name: 'Batman' };
            return user;
          })
        );

        sread(
          [users, currentUser],
          ([us, currentUserIndex]) => {
            sput('app', us[currentUserIndex].name);
          },
          { listen: true }
        );

        go(function*() {
          spy(yield take('app'));
          spy(yield put(currentUser, 2));
          spy(yield take('app'));
          spy(yield put('WWW'));
          spy(yield take('app'));
        });

        expect(spy).toBeCalledWithArgs(
          ['Steve'],
          [true],
          ['Rebeka'],
          [true],
          ['Batman']
        );
        expect(users.get()).toStrictEqual([
          { name: 'Joe' },
          { name: 'Steve' },
          { name: 'Batman' },
        ]);
      });
    });
  });
  describe('when we pipe to other channels', () => {
    it('should distribute a single value to multiple channels', () => {
      const ch1 = chan();
      const ch2 = chan();
      const ch3 = chan();

      sread(ch1, ch2, { listen: true });
      sread(ch2, ch3, { listen: true });

      exercise(
        Test(
          function* A(log) {
            stake(ch2, v => log(`take_ch2=${v}`));
            stake(ch3, v => log(`take_ch3=${v}`));
            stake(ch3, v => log(`take_ch3=${v}`));
          },
          function* B() {
            sput(ch1, 'foo');
            sput(ch1, 'bar');
          }
        ),
        ['>A', '<A', '>B', 'take_ch3=foo', 'take_ch2=foo', 'take_ch3=bar', '<B']
      );
    });
    it('should support nested piping', () => {
      const ch1 = chan('ch1');
      const ch2 = chan('ch2');
      const ch3 = chan('ch3');
      const ch4 = chan('ch4');

      sread(ch1, ch2, { listen: true });
      sread(ch1, ch3, { listen: true });
      sread(ch2, ch4, { listen: true });

      exercise(
        Test(
          function* A() {
            yield put(ch1, 'foo');
          },
          function* B(log) {
            stake(ch1, v => log(`take_ch1=${v}`));
            stake(ch2, v => log(`take_ch2=${v}`));
            stake(ch3, v => log(`take_ch3=${v}`));
            stake(ch4, v => log(`take_ch4=${v}`));
          }
        ),
        [
          '>A',
          '>B',
          '<A',
          'take_ch1=foo',
          'take_ch2=foo',
          'take_ch3=foo',
          'take_ch4=foo',
          '<B',
        ]
      );
    });
    it('should properly handle the situation when a tapped channel is not open anymore', () => {
      const ch1 = chan();
      const ch2 = chan();
      const ch3 = chan();

      sread(ch1, ch2, { listen: true });
      sread(ch1, ch3, { listen: true });

      exercise(
        Test(
          function* A(log) {
            stake(ch2, v => log(`take_ch2=${v}`));
            stake(ch2, v => log(`take_ch2=${v}`));
            stake(ch2, v => log(`take_ch2=${v}`));
            stake(ch3, v => {
              log(`take_ch3=${v}`);
              close(ch3);
            });
            stake(ch3, v => log(`take_ch3=${v.toString()}`));
            stake(ch3, v => log(`take_ch3=${v.toString()}`));
          },
          function* B() {
            sput(ch1, 'foo');
            sput(ch1, 'bar');
            sput(ch1, 'zar');
          }
        ),
        [
          '>A',
          '<A',
          '>B',
          'take_ch2=foo',
          'take_ch3=foo',
          'take_ch3=Symbol(ENDED)',
          'take_ch3=Symbol(ENDED)',
          'take_ch2=bar',
          'take_ch2=zar',
          '<B',
        ]
      );
    });
    it('should allow us to unsubscribe', () => {
      const ch1 = chan();
      const ch2 = chan();
      const ch3 = chan();

      sread(ch1, ch2, { listen: true });
      const unread = sread(ch1, ch3, { listen: true });

      exercise(
        Test(
          function* A(log) {
            stake(ch2, v => log(`take_ch2=${v}`));
            stake(ch2, v => log(`take_ch2=${v}`));
            stake(ch2, v => log(`take_ch2=${v}`));
            stake(ch3, v => {
              log(`take_ch3=${v}`);
              unread(ch1, ch3);
            });
            stake(ch3, v => log(`take_ch3=${v.toString()}`));
          },
          function* B() {
            sput(ch1, 'foo');
            sput(ch1, 'bar');
            sput(ch1, 'zar');
          }
        ),
        [
          '>A',
          '<A',
          '>B',
          'take_ch2=foo',
          'take_ch3=foo',
          'take_ch2=bar',
          'take_ch2=zar',
          '<B',
        ]
      );
    });
    it('should allow us to unsubscribe all', () => {
      const ch1 = chan();
      const ch2 = chan();
      const ch3 = chan();

      sread(ch1, ch2, { listen: true });
      sread(ch1, ch3, { listen: true });

      exercise(
        Test(
          function* A(log) {
            stake(ch2, v => log(`take_ch2=${v}`));
            stake(ch2, v => log(`take_ch2=${v}`));
            stake(ch2, v => log(`take_ch2=${v}`));
            stake(ch3, v => {
              log(`take_ch3=${v}`);
              unreadAll(ch1);
            });
            stake(ch3, v => log(`take_ch3=${v.toString()}`));
          },
          function* B() {
            sput(ch1, 'foo');
            sput(ch1, 'bar');
            sput(ch1, 'zar');
          }
        ),
        ['>A', '<A', '>B', 'take_ch2=foo', 'take_ch3=foo', '<B']
      );
    });
  });
});
