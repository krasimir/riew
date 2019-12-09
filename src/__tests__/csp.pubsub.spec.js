import { sub, pub, unsub, unsubAll, pubsubReset, deleteTopic } from '../index';

describe('Given a CSP pubsub extension', () => {
  beforeEach(() => {
    pubsubReset();
  });
  describe('when we publish', () => {
    it('should provide an API for subscribing', () => {
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
    it('should provide an API for unsubscribing all subscribed callbacks', () => {
      const spyA = jest.fn();
      const spyB = jest.fn();

      sub('a', spyA);
      sub('a', spyB);

      pub('a', 'foo');
      unsubAll('a');
      pub('a', 'bar');

      expect(spyA).toBeCalledWithArgs([ 'foo' ]);
      expect(spyB).toBeCalledWithArgs([ 'foo' ]);
    });
    it('should provide an API for deleting a topic', () => {
      const spyA = jest.fn();
      const spyB = jest.fn();

      sub('a', spyA);
      sub('a', spyB);

      pub('a', 'foo');
      deleteTopic('a');
      pub('a', 'bar');

      expect(spyA).toBeCalledWithArgs([ 'foo' ]);
      expect(spyB).toBeCalledWithArgs([ 'foo' ]);
    });
  });
});
