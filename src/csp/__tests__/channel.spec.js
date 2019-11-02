import { chan } from '../channel';
import { delay } from '../../__helpers__';

describe('Given a CSP channel', () => {
  describe('when we create a channel with a fixed buffer of 1', () => {
    it('allow writing and reading', async () => {
      const ch = chan('myChannel');

      ch.put('foo');
      expect(await ch.take()).toEqual('foo');
    });
    it('should block the channel if there is no push but we want to take', async () => {
      const ch = chan('myChannel');
      const f1 = jest.fn();
      const f2 = jest.fn();

      ch.take().then(f1);
      ch.take().then(f2);
      ch.put('foo');
      ch.put('bar');

      await delay(5);

      expect(f1).toBeCalledWithArgs([ 'foo' ]);
      expect(f2).toBeCalledWithArgs([ 'bar' ]);
    });
  });
});
