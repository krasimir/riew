import { buffer, reset } from '../index';

describe('Given we have a sliding buffer', () => {
  beforeEach(() => {
    reset();
  });
  describe('when using it', () => {
    it(`should
      * have at least size of 1
      * side the not-fit-in-size puts in and move the current out`, () => {
      const buf = buffer.sliding();
      const spy = jest.fn();

      buf.put('foo', r => spy('put 1', r));
      buf.put('bar', r => spy('put 2', r));
      buf.take(spy);
      buf.put('zar', r => spy('put 3', r));
      buf.take(spy);

      expect(spy).toBeCalledWithArgs(
        ['put 1', true],
        ['put 2', true],
        ['bar'],
        ['put 3', true],
        ['zar']
      );
      expect(buf.getValue()).toStrictEqual([]);
    });
    it('should have same capabilities for reading and listening as the fixed buffer', () => {
      const buf = buffer.sliding(2);
      const spy = jest.fn();

      buf.take(v => spy('take', v), { read: true, listen: true });
      buf.put('foo', r => spy('put 1', r));
      buf.put('bar', r => spy('put 2', r));
      buf.put('zar', r => spy('put 3', r));

      expect(spy).toBeCalledWithArgs(
        ['take', 'foo'],
        ['put 1', true],
        ['take', 'bar'],
        ['put 2', true],
        ['take', 'zar'],
        ['put 3', true]
      );
      expect(buf.getValue()).toStrictEqual(['bar', 'zar']);
    });
  });
});
