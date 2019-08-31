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
  describe('when we set custom resolver and dissolver', () => {
    it('should call those custom functions with the given key', () => {
      const resolver = jest.fn();
      const dissolver = jest.fn();

      registry.custom({ resolver, dissolver });
      registry.get('foo');
      registry.free('foo');

      expect(resolver).toBeCalledTimes(1);
      expect(resolver.mock.calls[0]).toStrictEqual([ 'foo' ]);
      expect(dissolver).toBeCalledTimes(1);
      expect(dissolver.mock.calls[0]).toStrictEqual([ 'foo' ]);
    });
  });
});
