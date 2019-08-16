import Registry from '../Registry';

describe('Given the Registry', () => {
  beforeEach(() => {
    Registry.reset();
  });
  describe('when we register something', () => {
    it('should be able to retrieve it', () => {
      const foo = 'bar';

      Registry.set('foo', foo);
      expect(Registry.get('foo')).toBe('bar');
    });
  });
  describe('when we remove something', () => {
    it('should delete the entry', () => {
      const foo = 'bar';

      Registry.set('foo', foo);
      Registry.remove('foo');
      expect(() => Registry.get('foo')).toThrowError();
    });
  });
  describe('when we use custom resolver', () => {
    it('should use it to resolve dependencies', () => {
      const foo = 'bar';

      Registry.set('foo', foo);
      Registry.resolver(() => {
        return 'zoo';
      });
      expect(Registry.get('foo')).toBe('zoo');
    });
  });
  describe('when we use getBulk', () => {
    it('should return all the items in an object', () => {
      const A = 'a';
      const B = 'b';

      Registry.set('A', A);
      Registry.set('B', B);
      expect(Registry.getBulk(['A', 'B'])).toStrictEqual({ A: 'a', B: 'b' });
    });
  });
});
