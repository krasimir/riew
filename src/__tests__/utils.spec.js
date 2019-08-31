import { compose, serial, parallel } from '../utils';
import { delay } from '../__helpers__';

describe('Given the compose function', () => {
  it(`should
    * run the passed functions one after each other
    * pass the result of the each one to the next one
    * handle async functions`, async () => {
    const A = jest.fn().mockImplementation((arg) => arg + 'oo');
    const B = jest.fn().mockImplementation(async (arg) => {
      await delay(5);
      return arg.toUpperCase();
    });
    const C = jest.fn().mockImplementation(async (arg) => {
      return { ops: arg };
    });

    expect(await compose(A, B, C)('f')).toStrictEqual({ ops: 'FOO' });
    expect(A).toBeCalledTimes(1);
    expect(B).toBeCalledTimes(1);
    expect(B.mock.calls[0]).toStrictEqual([ 'foo' ]);
    expect(C).toBeCalledTimes(1);
    expect(C.mock.calls[0]).toStrictEqual([ 'FOO' ]);
  });
  it('should work synchronously if there is no async function', () => {
    const A = jest.fn().mockImplementation((arg) => arg + 'oo');
    const B = jest.fn().mockImplementation((arg) => arg.toUpperCase());
    const C = jest.fn().mockImplementation((arg) => ({ ops: arg }));

    expect(compose(A, B, C)('f')).toStrictEqual({ ops: 'FOO' });
  });
});
describe('Given the serial function', () => {
  it(`should
    * run the passed functions one after each other
    * pass the initial argument to each of the functions
    * handle async functions`, async () => {
    const A = jest.fn().mockImplementation(() => 'A');
    const B = jest.fn().mockImplementation(async () => {
      await delay(10);
      return 'B';
    });
    const C = jest.fn().mockImplementation(async () => {
      await delay(4);
      return 'C';
    });

    expect(await serial(A, B, C)('f')).toStrictEqual(['A', 'B', 'C']);
    expect(A).toBeCalledTimes(1);
    expect(A.mock.calls[0]).toStrictEqual([ 'f' ]);
    expect(B).toBeCalledTimes(1);
    expect(B.mock.calls[0]).toStrictEqual([ 'f' ]);
    expect(C).toBeCalledTimes(1);
    expect(C.mock.calls[0]).toStrictEqual([ 'f' ]);
  });
  it('should work synchronously if there is no async function', () => {
    const A = jest.fn().mockImplementation((arg) => 'A');
    const B = jest.fn().mockImplementation((arg) => 'B');
    const C = jest.fn().mockImplementation((arg) => 'C');

    expect(serial(A, B, C)('f')).toStrictEqual(['A', 'B', 'C']);
    expect(A).toBeCalledTimes(1);
    expect(A.mock.calls[0]).toStrictEqual([ 'f' ]);
    expect(B).toBeCalledTimes(1);
    expect(B.mock.calls[0]).toStrictEqual([ 'f' ]);
    expect(C).toBeCalledTimes(1);
    expect(C.mock.calls[0]).toStrictEqual([ 'f' ]);
  });
});
describe('Given the parallel function', () => {
  it(`should
    * run the passed functions in parallel
    * pass the initial argument to each of the functions
    * handle async functions`, async () => {
    const A = jest.fn().mockImplementation(() => 'A');
    const B = jest.fn().mockImplementation(async () => {
      await delay(10);
      return 'B';
    });
    const C = jest.fn().mockImplementation(async () => {
      await delay(4);
      return 'C';
    });

    expect(await parallel(A, B, C)('f')).toStrictEqual(['A', 'B', 'C']);
    expect(A).toBeCalledTimes(1);
    expect(A.mock.calls[0]).toStrictEqual([ 'f' ]);
    expect(B).toBeCalledTimes(1);
    expect(B.mock.calls[0]).toStrictEqual([ 'f' ]);
    expect(C).toBeCalledTimes(1);
    expect(C.mock.calls[0]).toStrictEqual([ 'f' ]);
  });
  it('should work synchronously if there is no async function', () => {
    const A = jest.fn().mockImplementation((arg) => 'A');
    const B = jest.fn().mockImplementation((arg) => 'B');
    const C = jest.fn().mockImplementation((arg) => 'C');

    expect(parallel(A, B, C)('f')).toStrictEqual(['A', 'B', 'C']);
    expect(A).toBeCalledTimes(1);
    expect(A.mock.calls[0]).toStrictEqual([ 'f' ]);
    expect(B).toBeCalledTimes(1);
    expect(B.mock.calls[0]).toStrictEqual([ 'f' ]);
    expect(C).toBeCalledTimes(1);
    expect(C.mock.calls[0]).toStrictEqual([ 'f' ]);
  });
});
