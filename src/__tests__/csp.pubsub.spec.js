import { chan, sub, unsub, unsubAll } from '../index';

describe('Given a CSP pubsub extension', () => {
  describe('when we publish to a channel', () => {
    it('should provide an API for subscribing', () => {
      const ch = chan();
      const spyA = jest.fn();
      const spyB = jest.fn();

      sub(ch, spyA);
      sub(ch, spyB);

      ch.put('foo');
      ch.put('bar');

      expect(spyA).toBeCalledWithArgs([ 'foo' ], [ 'bar' ]);
      expect(spyB).toBeCalledWithArgs([ 'foo' ], [ 'bar' ]);
    });
    it('should provide an API for unsubscribing', () => {
      const ch = chan();
      const spyA = jest.fn();
      const spyB = jest.fn();

      sub(ch, spyA);
      sub(ch, spyB);

      ch.put('foo');
      unsub(ch, spyA);
      ch.put('bar');

      expect(spyA).toBeCalledWithArgs([ 'foo' ]);
      expect(spyB).toBeCalledWithArgs([ 'foo' ], [ 'bar' ]);
    });
    it('should provide an API for unsubscribing all subscribed callbacks', () => {
      const ch = chan();
      const spyA = jest.fn();
      const spyB = jest.fn();

      sub(ch, spyA);
      sub(ch, spyB);

      ch.put('foo');
      unsubAll(ch);
      ch.put('bar');

      expect(spyA).toBeCalledWithArgs([ 'foo' ]);
      expect(spyB).toBeCalledWithArgs([ 'foo' ]);
    });
  });
});
