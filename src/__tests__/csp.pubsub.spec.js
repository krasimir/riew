import { chan, sub, unsub, halt, topic, getTopics, go, topicExists, reset, grid } from '../index';
import { delay } from '../__helpers__';

describe('Given a CSP pubsub extension', () => {
  beforeEach(() => {
    reset();
  });
  describe('when we subscribe to a topic', () => {
    describe('and we publish to the same topic', () => {
      it('should call our callbacks', () => {
        expect(Object.keys(getTopics())).toHaveLength(0);

        const spyA = jest.fn();
        const spyB = jest.fn();

        sub('xxx', spyA);
        sub('xxx', spyB);

        topic('xxx').put('foo');
        topic('xxx').put('bar');

        expect(spyA).toBeCalledWithArgs([ 'foo' ], [ 'bar' ]);
        expect(spyB).toBeCalledWithArgs([ 'foo' ], [ 'bar' ]);
      });
    });
    it('should provide an API for unsubscribing', () => {
      expect(Object.keys(getTopics())).toHaveLength(0);

      const spyA = jest.fn();
      const spyB = jest.fn();
      const t = topic('a');

      sub('a', spyA);
      sub('a', spyB);

      t.put('foo');
      unsub('a', spyA);
      t.put('bar');

      expect(spyA).toBeCalledWithArgs([ 'foo' ]);
      expect(spyB).toBeCalledWithArgs([ 'foo' ], [ 'bar' ]);
    });
    it('should create a dedicated channel for each topic', () => {
      expect(Object.keys(getTopics())).toHaveLength(0);

      const spyA = jest.fn();
      const spyB = jest.fn();
      const t1 = topic('topicA');
      const t2 = topic('topicB');

      sub('topicA', spyA);
      sub('topicB', spyB);

      t1.put('foo');
      t1.put('bar');
      t2.put('baz');

      const gridNodes = grid.nodes().map(({ id }) => id);

      expect(gridNodes.includes('topicA')).toBe(true);
      expect(gridNodes.includes('topicB')).toBe(true);
    });
    it('should provide an API for deleting a topic', () => {
      expect(Object.keys(getTopics())).toHaveLength(0);

      const spyA = jest.fn();
      const spyB = jest.fn();
      const t = topic('a');

      sub('a', spyA);
      sub('a', spyB);

      expect(Object.keys(getTopics())).toHaveLength(1);

      t.put('foo');
      halt('a');

      expect(Object.keys(getTopics())).toHaveLength(0);
      expect(spyA).toBeCalledWithArgs([ 'foo' ]);
      expect(spyB).toBeCalledWithArgs([ 'foo' ]);
    });
  });
  describe('when we subscribe to a topic after someone publish on it', () => {
    it('should NOT fire the callbacks', () => {
      expect(Object.keys(getTopics())).toHaveLength(0);

      const spyA = jest.fn();
      const spyB = jest.fn();
      const t = topic('topic');

      t.put('foo');
      sub('topic', spyA);
      sub('topic', spyB);

      expect(spyA).not.toBeCalled();
      expect(spyB).not.toBeCalled();
    });
  });
  describe('when we want to use pubsub topics as part of routines', () => {
    it(`should be possible to
      * put to the topic's channel
      * take from the topic's channel`, () => {
      expect(Object.keys(getTopics())).toHaveLength(0);

      const spyTake1 = jest.fn();
      const spyTake2 = jest.fn();
      const spyPut = jest.fn();
      const log = jest.fn();

      sub('yyy', spyTake2);

      go(
        function * A({ take }) {
          log('>A');
          spyTake1(`value is ${yield take('yyy')}`);
        },
        () => log('<A')
      );
      go(
        function * B({ put }) {
          log('>B');
          spyPut(`(1) ${yield put('yyy', 42)}`);
          spyPut(`(2) ${yield put('yyy', 100)}`);
          spyPut(`(3) ${yield put('yyy', 200)}`);
        },
        () => log('<B')
      );

      expect(spyTake1).toBeCalledWithArgs([ 'value is 42' ]);
      expect(spyTake2).toBeCalledWithArgs([ 42 ], [ 100 ], [ 200 ]);
      expect(log).toBeCalledWithArgs([ '>A' ], [ '>B' ], [ '<A' ], [ '<B' ]);
    });
    describe('and the routine is a plain function', () => {
      it('should still work', () => {
        const spy = jest.fn();
        topic('xxx');
        go(function ({ take }) {
          take('xxx', spy);
        });
        go(function ({ put }) {
          put('xxx', 'foo');
        });
        expect(spy).toBeCalledWithArgs([ 'foo' ]);
      });
    });
    describe('and the routine is an async function', () => {
      it('should still work', async () => {
        const spy = jest.fn();
        topic('xxx');
        go(async function ({ take }) {
          spy(await take('xxx'));
        });
        go(async function ({ put }) {
          await put('xxx', 'foo');
          spy('bar');
        });
        await delay();
        expect(spy).toBeCalledWithArgs([ 'foo' ], [ 'bar' ]);
      });
    });
  });
  describe('when we check if a topic exists', () => {
    it('should return true or false', () => {
      expect(Object.keys(getTopics())).toHaveLength(0);

      topic('AAA');
      expect(topicExists('AAA')).toBe(true);
      expect(topicExists('BBB')).toBe(false);
    });
  });
  describe('when we want to know if a new subscriber is added or removed', () => {
    it('should return true or false', () => {
      const added = jest.fn();
      const removed = jest.fn();
      const callback = () => {};

      topic('foo')
        .onSubscriberAdded(added)
        .onSubscriberRemoved(removed);
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
      ch.put('foo');
      ch.close();
      ch.put('bar');

      expect(spy).toBeCalledWithArgs([ 'foo' ]);
    });
  });
});
