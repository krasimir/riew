import { compose } from '../utils';
import { delay } from '../__helpers__';

describe('Given the compose function', () => {
  it(`should
    * run the passed functions one after each other
    * pass the result of the each one to the next one
    * handle async functions`, async () => {
    const A = jest.fn().mockImplementation(() => 'foo');
    const B = jest.fn().mockImplementation(async (arg) => {
      await delay(5);
      return arg.toUpperCase();
    });
    const C = jest.fn().mockImplementation(async (arg) => {
      return { ops: arg };
    });

    expect(await compose(A, B, C)).toStrictEqual({ ops: 'FOO' });
    expect(A).toBeCalledTimes(1);
    expect(B).toBeCalledTimes(1);
    expect(B.mock.calls[0]).toStrictEqual([ 'foo' ]);
    expect(C).toBeCalledTimes(1);
    expect(C.mock.calls[0]).toStrictEqual([ 'FOO' ]);
  });
  it('should work synchronously if there is no async function', () => {
    const A = jest.fn().mockImplementation(() => 'foo');
    const B = jest.fn().mockImplementation((arg) => arg.toUpperCase());
    const C = jest.fn().mockImplementation((arg) => ({ ops: arg }));

    expect(compose(A, B, C)).toStrictEqual({ ops: 'FOO' });
  });
});
