import { buffer, reset } from '../index';

describe('Given the Fixed buffer', () => {
  beforeEach(() => {
    reset();
  });
  describe('when we put but there is no take', () => {
    it('should wait for a take', () => {
      const buf = buffer.fixed();
      const spy = jest.fn();

      buf.put('foo', v => spy('put', v));
      spy('waiting');
      buf.take(v => spy('take', v));

      expect(spy).toBeCalledWithArgs(
        ['waiting'],
        ['put', true],
        ['take', 'foo']
      );
    });
  });
  describe('when we take but there is no put', () => {
    it('should wait for a put to resolve the take', () => {
      const buf = buffer.fixed();
      const spy = jest.fn();

      buf.take(v => spy('take', v));
      spy('waiting');
      buf.put('foo', v => spy('put', v));

      expect(spy).toBeCalledWithArgs(
        ['waiting'],
        ['take', 'foo'],
        ['put', true]
      );
    });
  });
  describe('when we have size > 0', () => {
    it('should wait for a put to resolve the take', () => {
      const buf = buffer.fixed(1);
      const spy = jest.fn();

      buf.put('foo', v => spy('put', v));
      buf.put('bar', v => spy('put', v));
      spy('waiting');
      buf.take(v => spy('take', v));

      expect(spy).toBeCalledWithArgs(
        ['put', true],
        ['waiting'],
        ['put', true],
        ['take', 'foo']
      );
    });
  });
});
