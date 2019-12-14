import {
  chan,
  sub,
  unsub,
  getChannels,
  go,
  channelExists,
  reset,
  grid,
  take,
  put,
  sput,
  close,
  buffer,
  onSubscriberAdded,
  onSubscriberRemoved
} from '../index';

describe('Given a CSP pubsub extension', () => {
  beforeEach(() => {
    reset();
  });
  describe('when we subscribe to a topic', () => {
    describe('and we publish to the same topic', () => {
      it('should call our callbacks', () => {
        expect(Object.keys(getChannels())).toHaveLength(0);

        const spyA = jest.fn();
        const spyB = jest.fn();

        sub('xxx', spyA);
        sub('xxx', spyB);

        go(function * () {
          yield put('xxx', 'foo');
          yield put('xxx', 'bar');
        });

        expect(spyA).toBeCalledWithArgs([ 'foo' ], [ 'bar' ]);
        expect(spyB).toBeCalledWithArgs([ 'foo' ], [ 'bar' ]);
      });
    });
    it('should provide an API for unsubscribing', () => {
      expect(Object.keys(getChannels())).toHaveLength(0);

      const spyA = jest.fn();
      const spyB = jest.fn();

      sub('a', spyA);
      sub('a', spyB);

      go(function * () {
        yield put('a', 'foo');
        unsub('a', spyA);
        yield put('a', 'bar');
      });

      expect(spyA).toBeCalledWithArgs([ 'foo' ]);
      expect(spyB).toBeCalledWithArgs([ 'foo' ], [ 'bar' ]);
    });
    it('should create a dedicated channel for each topic', () => {
      expect(Object.keys(getChannels())).toHaveLength(0);

      const spyA = jest.fn();
      const spyB = jest.fn();

      sub('topicA', spyA);
      sub('topicB', spyB);

      go(function * () {
        yield put('topicA', 'foo');
        yield put('topicA', 'bar');
        yield put('topicB', 'baz');
      });

      const gridNodes = grid.nodes().map(({ id }) => id);

      expect(gridNodes.includes('topicA')).toBe(true);
      expect(gridNodes.includes('topicB')).toBe(true);
      expect(spyA).toBeCalledWithArgs([ 'foo' ], [ 'bar' ]);
      expect(spyB).toBeCalledWithArgs([ 'baz' ]);
    });
  });
  describe('when we subscribe to a topic after someone publish on it', () => {
    it(`should trigger the first subscriber only`, () => {
      expect(Object.keys(getChannels())).toHaveLength(0);

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
  describe('when we want use broadcasting buffer', () => {
    it('should satisfy the subscription but also the takes in a routine', () => {
      expect(Object.keys(getChannels())).toHaveLength(0);

      const spyTake1 = jest.fn();
      const spyTake2 = jest.fn();
      const spyPut = jest.fn();
      const log = jest.fn();

      chan('yyy', buffer.broadcasting());
      sub('yyy', spyTake2);

      go(
        function * A() {
          log('>A');
          spyTake1(`value is ${yield take('yyy')}`);
          spyTake1(`value is ${yield take('yyy')}`);
        },
        () => log('<A')
      );
      go(
        function * B() {
          log('>B');
          spyPut(`(1) ${yield put('yyy', 42)}`);
          spyPut(`(2) ${yield put('yyy', 100)}`);
          spyPut(`(3) ${yield put('yyy', 200)}`);
        },
        () => log('<B')
      );

      expect(spyTake1).toBeCalledWithArgs([ 'value is 42' ], [ 'value is 100' ]);
      expect(spyTake2).toBeCalledWithArgs([ 42 ], [ 100 ], [ 200 ]);
      expect(log).toBeCalledWithArgs([ '>A' ], [ '>B' ], [ '<A' ], [ '<B' ]);
      expect(spyPut).toBeCalledWithArgs([ '(1) true' ], [ '(2) true' ], [ '(3) true' ]);
    });
  });
  describe('when we check if a topic exists', () => {
    it('should return true or false', () => {
      expect(Object.keys(getChannels())).toHaveLength(0);

      chan('AAA');
      expect(channelExists('AAA')).toBe(true);
      expect(channelExists('BBB')).toBe(false);
    });
  });
  describe('when we want to know if a new subscriber is added or removed', () => {
    it('should return true or false', () => {
      const added = jest.fn();
      const removed = jest.fn();
      const callback = () => {};

      onSubscriberAdded('foo', added);
      onSubscriberRemoved('foo', removed);
      sub('foo', callback);
      unsub('foo', callback);

      expect(added).toBeCalledWithArgs([ callback ]);
      expect(removed).toBeCalledWithArgs([ callback ]);
    });
  });
  describe('when we pass a channel instead of a string to the sub function', () => {
    it('should return true or false', () => {
      const spy = jest.fn();
      const ch = chan();

      sub(ch, spy);
      sput(ch, 'foo');
      close(ch);
      sput(ch, 'bar');

      expect(spy).toBeCalledWithArgs([ 'foo' ]);
    });
  });
});
