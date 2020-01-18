import { use, register, reset } from '../index';

describe('Given the registry', () => {
  beforeEach(() => {
    reset();
  });
  describe('when we register something in there', () => {
    it('should let us use it later', () => {
      const myFunc = () => 42;
      const fff = register('foo', myFunc);

      expect(use('foo')()).toBe(42);
      expect(() => register('foo', 'bar')).toThrowError(
        'A resource with type "foo" already exists.'
      );
      expect(fff()).toBe(42);
    });
  });
});
