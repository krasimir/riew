import { sub, pub, unsub, haltAll, halt, topic, topicChannels, buffer, go, take, put } from '../index';

describe('Given a CSP pubsub extension', () => {
  beforeEach(() => {
    haltAll();
  });
  describe('when we publish', () => {
    it('should provide an API for subscribing', () => {
      expect(Object.keys(topicChannels())).toHaveLength(0);

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
      expect(Object.keys(topicChannels())).toHaveLength(0);

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
      expect(Object.keys(topicChannels())).toHaveLength(0);

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
      expect(Object.keys(topicChannels())).toHaveLength(0);

      const spyA = jest.fn();
      const spyB = jest.fn();

      sub('a', spyA);
      sub('a', spyB);

      expect(Object.keys(topicChannels())).toHaveLength(1);

      pub('a', 'foo');
      halt('a');

      expect(Object.keys(topicChannels())).toHaveLength(0);
      expect(spyA).toBeCalledWithArgs([ 'foo' ]);
      expect(spyB).toBeCalledWithArgs([ 'foo' ]);
    });
    it('should provide an API for subscribing once', () => {
      expect(Object.keys(topicChannels())).toHaveLength(0);

      const spy = jest.fn();

      sub('a', spy, true);
      pub('a', 'foo');
      pub('a', 'bar');

      expect(spy).toBeCalledWithArgs([ 'foo' ]);
    });
  });
  describe('when we set a custom buffer strategy', () => {
    it('should respect it', () => {
      expect(Object.keys(topicChannels())).toHaveLength(0);

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
      expect(Object.keys(topicChannels())).toHaveLength(0);

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
      expect(Object.keys(topicChannels())).toHaveLength(0);

      const spy = jest.fn();

      go(function * () {
        spy(`value is ${yield take('yyy')}`);
      });
      go(function * () {
        spy(`(1) ${yield put('yyy', 42)}`);
        spy(`(2) ${yield put('yyy', 100)}`);
        spy(`(3) ${yield put('yyy', 200)}`);
      });

      expect(spy).toBeCalledWithArgs([ 'value is 42' ], [ '(1) true' ]);
    });
  });
});
