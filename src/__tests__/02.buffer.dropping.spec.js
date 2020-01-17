import { buffer, reset } from '../index';

describe('Given we have a dropping buffer', () => {
  beforeEach(() => {
    reset();
  });
  describe('when using it', () => {
    it(`should
      * have at least size of 1
      * drop the not-fit-in-size puts with false`, () => {
      const buf = buffer.dropping();
      const spy = jest.fn();

      buf.put('foo', r => spy('put 1', r));
      buf.put('bar', r => spy('put 2', r));
      buf.take(spy);
      buf.put('zar', r => spy('put 3', r));

      expect(spy).toBeCalledWithArgs(
        ['put 1', true],
        ['put 2', false],
        ['foo'],
        ['put 3', true]
      );
    });
    it('should have same capabilities for reading', () => {
      const buf = buffer.dropping();
      const spy = jest.fn();

      buf.take(v => spy('take', v), { read: true });
      buf.put('foo', r => spy('put 1', r));
      buf.take(v => spy('take', v), { read: true });
      buf.put('bar', r => spy('put 2', r));
      buf.take(v => spy('take', v), { read: true });
      buf.put('zar', r => spy('put 3', r));

      expect(spy).toBeCalledWithArgs(
        ['take', undefined],
        ['put 1', true],
        ['take', 'foo'],
        ['put 2', false],
        ['take', 'foo'],
        ['put 3', false]
      );
    });
    it('should have same capabilities for listening', () => {
      const buf = buffer.dropping();
      const spy = jest.fn();

      buf.take(v => spy('take', v), { listen: true });
      buf.put('foo', r => spy('put 1', r));
      buf.put('bar', r => spy('put 2', r));
      buf.put('zar', r => spy('put 3', r));

      expect(spy).toBeCalledWithArgs(
        ['take', 'foo'],
        ['put 1', true],
        ['take', 'bar'],
        ['put 2', false],
        ['take', 'zar'],
        ['put 3', false]
      );
    });
  });
});
