import { sub, pub, unsub, halt, topic, getTopics, buffer, go, take, put, topicExists, reset, grid } from '../index';

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

        sub('topic', spyA);
        sub('topic', spyB);

        pub('topic', 'foo');
        pub('topic', 'bar');

        expect(spyA).toBeCalledWithArgs([ 'foo' ], [ 'bar' ]);
        expect(spyB).toBeCalledWithArgs([ 'foo' ], [ 'bar' ]);
      });
    });
    it('should provide an API for unsubscribing', () => {
      expect(Object.keys(getTopics())).toHaveLength(0);

      const spyA = jest.fn();
      const spyB = jest.fn();

      sub('a', spyA);
      sub('a', spyB);

      pub('a', 'foo');
      unsub('a', spyA);
      pub('a', 'bar');

      expect(spyA).toBeCalledWithArgs([ 'foo' ]);
      expect(spyB).toBeCalledWithArgs([ 'foo' ], [ 'bar' ]);
    });
    it('should create a dedicated channel for each topic', () => {
      expect(Object.keys(getTopics())).toHaveLength(0);

      const spyA = jest.fn();
      const spyB = jest.fn();

      sub('topicA', spyA);
      sub('topicB', spyB);

      pub('topicA', 'foo');
      pub('topicA', 'bar');
      pub('topicB', 'baz');

      const gridNodes = grid.nodes().map(({ id }) => id);

      expect(gridNodes.includes('topicA')).toBe(true);
      expect(gridNodes.includes('topicB')).toBe(true);
    });
    it('should provide an API for deleting a topic', () => {
      expect(Object.keys(getTopics())).toHaveLength(0);

      const spyA = jest.fn();
      const spyB = jest.fn();

      sub('a', spyA);
      sub('a', spyB);

      expect(Object.keys(getTopics())).toHaveLength(1);

      pub('a', 'foo');
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

      pub('topic', 'foo');
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
        function * A() {
          log('>A');
          spyTake1(`value is ${yield take('yyy')}`);
        },
        [],
        () => log('<A')
      );
      go(
        function * B() {
          log('>B');
          spyPut(`(1) ${yield put('yyy', 42)}`);
          spyPut(`(2) ${yield put('yyy', 100)}`);
          spyPut(`(3) ${yield put('yyy', 200)}`);
        },
        [],
        () => log('<B')
      );

      expect(spyTake1).toBeCalledWithArgs([ 'value is 42' ]);
      expect(spyTake2).toBeCalledWithArgs([ 42 ], [ 100 ], [ 200 ]);
      expect(log).toBeCalledWithArgs([ '>A' ], [ '>B' ], [ '<A' ], [ '<B' ]);
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
});
