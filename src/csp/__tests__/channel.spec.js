import { chan } from '../channel';
import { delay } from '../../__helpers__';

describe('Given a CSP channel', () => {
  describe('when we create a channel with a fixed buffer of 0', () => {
    it('allow writing and reading', async () => {
      const ch = chan('myChannel');

      ch.put('foo');
      expect(await ch.take()).toEqual('foo');
    });
    it('should block the channel if there is no puts but we want to take', async () => {
      const ch = chan('myChannel');
      const happening = [];

      ch.take().then(() => happening.push('a'));
      ch.take().then(() => happening.push('b'));
      ch.put('foo').then(() => happening.push('c'));
      ch.put('bar').then(() => happening.push('d'));

      await delay(5);

      expect(happening).toStrictEqual(['a', 'c', 'b', 'd']);
    });
    it('should block the channel if there is no takers but we want to put', async () => {
      const ch = chan('myChannel');
      const happening = [];

      ch.put('foo').then(() => happening.push('a'));
      ch.put('bar').then(() => happening.push('b'));
      ch.take().then(() => happening.push('c'));
      ch.take().then(() => happening.push('d'));

      await delay(5);

      expect(happening).toStrictEqual(['a', 'c', 'b', 'd']);
    });
  });
});
