import { use, register, reset } from '../index';

describe('Given the harvester', () => {
  beforeEach(() => {
    reset();
  });
  describe('when we register something in there', () => {
    it('should let us use it later', () => {
      const myFunc = () => 42;

      register('foo', myFunc);
      expect(use('foo')()).toBe(42);
      expect(() => register('foo', 'bar')).toThrowError('A product with type "foo" already exists.');
    });
  });
});
