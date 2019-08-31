import registry from '../registry';

describe('Given the registry', () => {
  describe('when we use the registry', () => {
    it('should store stuff for us and let us free resources', () => {
      registry.add('foo', 10);
      expect(registry.get('foo')).toBe(10);
      registry.free('foo');
      expect(() => registry.get('foo')).toThrowError('"foo" is missing in the registry.');
      expect(() => registry.get('something')).toThrowError('"something" is missing in the registry.');
    });
  });
});
