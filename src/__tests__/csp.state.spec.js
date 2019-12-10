import { state } from '../index';

describe('Given a CSP state extension', () => {
  describe('when we use the built-in get and set', () => {
    it('should retrieve and change the state value', () => {
      const s = state(10);

      expect(s.get(10));
      s.set(20);
      expect(s.get(20));
    });
  });
  describe('when we subscribe for state value changes', () => {
    it('should notify us for state value changes', () => {
      const s = state('foo');
      const spy1 = jest.fn();
      const spy2 = jest.fn();

      s.sub(spy1, true);
      s.sub(spy2);

      s.set('bar');
      s.set('baz');

      expect(spy1).toBeCalledWithArgs([ 'foo' ], [ 'bar' ], [ 'baz' ]);
      expect(spy2).toBeCalledWithArgs([ 'bar' ], [ 'baz' ]);
    });
  });
  describe('when we unsubscribe', () => {
    it('should not call our function anymore', () => {
      const s = state('foo');
      const spy = jest.fn();

      s.sub(spy);
      s.set('bar');
      s.unsub(spy);
      s.set('baz');
      s.set('moo');

      expect(spy).toBeCalledWithArgs([ 'bar' ]);
    });
  });
  describe('when we destroy the state', () => {
    it('should delete pubsub', () => {
      const s = state('foo');
      const spy = jest.fn();

      s.sub(spy);
      s.set('bar');
      s.destroy();
      s.set('baz');
      s.set('moo');

      expect(spy).toBeCalledWithArgs([ 'bar' ]);
    });
  });
});
