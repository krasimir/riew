import { sub, pub, unsub, halt, topic, topics, buffer, go, take, put, topicExists, reset } from '../index';

describe('Given a CSP pubsub extension', () => {
  beforeEach(() => {
    reset();
  });
  describe('when we publish', () => {
    it('should provide an API for subscribing', () => {
      expect(Object.keys(topics())).toHaveLength(0);

      const spyA = jest.fn();
      const spyB = jest.fn();

      sub('topic', spyA);
      sub('topic', spyB);

      pub('topic', 'foo');
      pub('topic', 'bar');

      expect(spyA).toBeCalledWithArgs([ 'foo' ], [ 'bar' ]);
      expect(spyB).toBeCalledWithArgs([ 'foo' ], [ 'bar' ]);
    });
    it('should create a dedicated channel for each topic', () => {
      expect(Object.keys(topics())).toHaveLength(0);

      const spyA = jest.fn();
      const spyB = jest.fn();

      sub('topicA', spyA);
      sub('topicB', spyB);

      pub('topicA', 'foo');
      pub('topicA', 'bar');
      pub('topicB', 'baz');

      expect(spyA).toBeCalledWithArgs([ 'foo' ], [ 'bar' ]);
      expect(spyB).toBeCalledWithArgs([ 'baz' ]);
    });
    it('should provide an API for unsubscribing', () => {
      expect(Object.keys(topics())).toHaveLength(0);

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
    it('should provide an API for deleting a topic', () => {
      expect(Object.keys(topics())).toHaveLength(0);

      const spyA = jest.fn();
      const spyB = jest.fn();

      sub('a', spyA);
      sub('a', spyB);

      expect(Object.keys(topics())).toHaveLength(1);

      pub('a', 'foo');
      halt('a');

      expect(Object.keys(topics())).toHaveLength(0);
      expect(spyA).toBeCalledWithArgs([ 'foo' ]);
      expect(spyB).toBeCalledWithArgs([ 'foo' ]);
    });
    it('should provide an API for subscribing once', () => {
      expect(Object.keys(topics())).toHaveLength(0);

      const spy = jest.fn();

      sub('a', spy, true);
      pub('a', 'foo');
      pub('a', 'bar');

      expect(spy).toBeCalledWithArgs([ 'foo' ]);
    });
  });
  describe('when we set a custom buffer strategy', () => {
    it('should respect it', () => {
      expect(Object.keys(topics())).toHaveLength(0);

      const spy = jest.fn();

      topic('xxx', buffer.sliding());
      pub('xxx', 'foo');
      pub('xxx', 'bar');
      pub('xxx', 'zar');
      sub('xxx', spy);

      expect(spy).toBeCalledWithArgs([ 'zar' ]);
    });
  });
  describe('when we create a topic and publish to it but there is no subscribers', () => {
    it('should flush all the pending puts into the subscriber callback', () => {
      expect(Object.keys(topics())).toHaveLength(0);

      const spy = jest.fn();

      topic('xxx');
      pub('xxx', 'foo');
      pub('xxx', 'bar');
      pub('xxx', 'zar');
      sub('xxx', spy);

      expect(spy).toBeCalledWithArgs([ 'foo' ], [ 'bar' ], [ 'zar' ]);
    });
  });
  describe('when we want to use pubsub topics as part of routines', () => {
    it(`should be possible to
      * put to the topic's channel
      * take from the topic's channel`, () => {
      expect(Object.keys(topics())).toHaveLength(0);

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
  describe("when we set the topic's initial value", () => {
    it('should resolve the subscriptions with that value at least once', () => {
      expect(Object.keys(topics())).toHaveLength(0);

      const spy1 = jest.fn();
      const spy2 = jest.fn();

      topic('XXX', null, 'foo');
      sub('XXX', spy1);
      sub('XXX', spy1);
      sub('XXX', spy2);
      pub('XXX', 'bar');

      expect(spy1).toBeCalledWithArgs([ 'foo' ], [ 'bar' ]);
      expect(spy2).toBeCalledWithArgs([ 'foo' ], [ 'bar' ]);
    });
  });
  describe('when we check if a topic exists', () => {
    it('should return true or false', () => {
      expect(Object.keys(topics())).toHaveLength(0);

      topic('AAA');
      expect(topicExists('AAA')).toBe(true);
      expect(topicExists('BBB')).toBe(false);
    });
  });
});
