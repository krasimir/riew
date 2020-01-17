import { buffer } from '../index';

describe('Given the memory buffer', () => {
  describe('when we put', () => {
    it(`should have non-blocking puts`, () => {
      const buf = buffer.memory();
      const spy = jest.fn();

      buf.put('foo', v => spy('put1', v));
      buf.put('bar', v => spy('put2', v));
      buf.put('zar', v => spy('put3', v));
      expect(buf.getValue()).toStrictEqual(['zar']);
      expect(spy).toBeCalledWithArgs(
        ['put1', true],
        ['put2', true],
        ['put3', true]
      );
    });
  });
  describe('when we take', () => {
    it(`should have non blocking takes (basically take === read)`, () => {
      const buf = buffer.memory();
      const spy = jest.fn();

      buf.take(v => spy('take1', v));
      buf.put('foo', v => spy('put', v));
      buf.take(v => spy('take2', v));
      buf.take(v => spy('take3', v));

      expect(buf.getValue()).toStrictEqual(['foo']);
      expect(spy).toBeCalledWithArgs(
        ['take1', undefined],
        ['put', true],
        ['take2', 'foo'],
        ['take3', 'foo']
      );
    });
    it(`should remember the last put value`, () => {
      const buf = buffer.memory();
      const spy = jest.fn();

      buf.put('foo', v => spy('put1', v));
      buf.take(v => spy('take1', v));
      buf.put('bar', v => spy('put2', v));
      buf.take(v => spy('take2', v));
      buf.take(v => spy('take3', v));

      expect(buf.getValue()).toStrictEqual(['bar']);
      expect(spy).toBeCalledWithArgs(
        ['put1', true],
        ['take1', 'foo'],
        ['put2', true],
        ['take2', 'bar'],
        ['take3', 'bar']
      );
    });
  });
  describe('when we listen', () => {
    it('should trigger the callback every time when there is a new value', () => {
      const buf = buffer.memory();
      const spy = jest.fn();

      buf.take(spy, { listen: true });
      buf.put('foo', v => spy('put1', v));
      buf.put('bar', v => spy('put2', v));

      expect(spy).toBeCalledWithArgs(
        ['foo'],
        ['put1', true],
        ['bar'],
        ['put2', true]
      );
    });
    describe('and there is already a value in the channel and we use initialCall set to true', () => {
      it('should fire the callback with the proper values', () => {
        const buf = buffer.memory();
        const spy = jest.fn();

        buf.put('foo', v => spy('put1', v));
        buf.take(spy, { listen: true, initialCall: true });
        buf.put('bar', v => spy('put2', v));

        expect(spy).toBeCalledWithArgs(
          ['put1', true],
          ['foo'],
          ['bar'],
          ['put2', true]
        );
      });
    });
  });
});
