import { chan, buffer } from '../channel';
import { delay } from '../../__helpers__';

describe('Given a CSP channel', () => {
  describe('and we have three channel states', () => {
    describe('and we have an OPEN state', () => {
      it('should allow writing and reading', async () => {
        const ch = chan();
        const happening = [];

        expect(ch.state()).toEqual(chan.OPEN);
        ch.put('foo').then(v => happening.push(v));
        ch.take().then(v => happening.push(v));

        await delay(5);
        expect(happening).toStrictEqual([true, 'foo']);
        expect(ch.state()).toEqual(chan.OPEN);
      });
    });
    describe('and we have a CLOSED state', () => {
      it('should allow only reading otherwise puts resolve to CLOSED', async () => {
        const ch = chan();
        const happening = [];

        ch.put('foo').then(v => happening.push(v));
        ch.close();
        ch.put('bar').then(v => happening.push(v));
        ch.put('zar').then(v => happening.push(v));
        ch.take().then(v => happening.push(v));

        await delay(5);
        expect(happening).toStrictEqual([chan.CLOSED, chan.CLOSED, true, 'foo']);
        expect(ch.state()).toEqual(chan.ENDED);
      });
    });
    describe('and we have an ENDED state', () => {
      it('should always resolve to ENDED', async () => {
        const ch = chan();
        const happening = [];

        ch.put('foo').then(v => happening.push(v));
        ch.close();
        ch.put('bar').then(v => happening.push(v));
        ch.take().then(v => happening.push(v));
        ch.put('zar').then(v => happening.push(v));
        ch.take().then(v => happening.push(v));

        await delay(5);
        expect(happening).toStrictEqual([chan.CLOSED, true, 'foo', chan.ENDED, chan.ENDED]);
        expect(ch.state()).toEqual(chan.ENDED);
      });
    });
    describe('and we wait for taking but close the channel', () => {
      it('should resolve the taker with ENDED', async () => {
        const ch = chan();
        const happening = [];

        ch.take().then(v => happening.push(v));
        ch.close();
        await delay(5);
        expect(happening).toStrictEqual([chan.CLOSED]);
      });
    });
  });
  describe('when we create a channel with the default buffer (fixed buffer with size 0)', () => {
    it('allow writing and reading', async () => {
      const ch = chan();

      ch.put('foo');
      expect(await ch.take()).toEqual('foo');
    });
    it('should block the channel if there is no puts but we want to take', async () => {
      const ch = chan();
      const happening = [];

      ch.take().then(() => happening.push('a'));
      ch.take().then(() => happening.push('b'));
      ch.put('foo').then(() => happening.push('c'));
      ch.put('bar').then(() => happening.push('d'));

      await delay(5);
      expect(happening).toStrictEqual(['a', 'c', 'b', 'd']);
    });
    it('should block the channel if there is no takers but we want to put', async () => {
      const ch = chan();
      const happening = [];

      ch.put('foo').then(() => happening.push('a'));
      ch.put('bar').then(() => happening.push('b'));
      ch.take().then(() => happening.push('c'));
      ch.take().then(() => happening.push('d'));

      await delay(5);
      expect(happening).toStrictEqual(['a', 'c', 'b', 'd']);
    });
  });
  describe('when we create a channel with a fixed buffer with size > 0', () => {
    it('should allow as many puts as we have space', async () => {
      const ch = chan(buffer.fixed(2));
      const happening = [];
      const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      ch.put('foo').then(() => happening.push('a'));
      ch.put('bar').then(() => happening.push('b'));
      ch.put('zar').then(() => happening.push('c'));
      ch.put('mar').then(() => happening.push('d'));
      expect(ch.__value()).toStrictEqual(['foo', 'bar']);
      ch.take().then(() => happening.push('e'));
      expect(ch.__value()).toStrictEqual(['bar', 'zar']);
      ch.take().then(() => happening.push('f'));
      expect(ch.__value()).toStrictEqual(['zar', 'mar']);
      ch.take().then(() => happening.push('g'));
      expect(ch.__value()).toStrictEqual(['mar']);
      ch.take().then(() => happening.push('h'));
      expect(ch.__value()).toStrictEqual([]);

      await delay(5);
      expect(happening).toStrictEqual(['a', 'b', 'c', 'e', 'd', 'f', 'g', 'h']);
      spy.mockRestore();
    });
  });
  describe('when we create a channel with a dropping buffer', () => {
    describe('and the buffer\'s size is 0', () => {
      it('shouldn\'t block', async () => {
        const ch = chan(buffer.dropping());
        const happening = [];
        const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        ch.put('foo').then((r) => happening.push('a', r));
        ch.put('bar').then((r) => happening.push('b', r));
        ch.put('zar').then((r) => happening.push('c', r));
        expect(ch.__value()).toStrictEqual(['foo']);
        ch.take().then(() => happening.push('d'));
        expect(ch.__value()).toStrictEqual([]);
        ch.take().then(() => happening.push('e'));
        ch.take().then(() => happening.push('g'));
        ch.take().then(() => happening.push('h'));
        ch.put('mar').then(() => happening.push('f'));

        await delay(5);
        expect(happening).toStrictEqual(['a', true, 'b', false, 'c', false, 'd', 'e', 'f']);
        spy.mockRestore();
      });
    });
    describe('and the buffer\'s size is > 0', () => {
      it('shouldn\'t block', async () => {
        const ch = chan(buffer.dropping(2));
        const happening = [];
        const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        ch.put('foo').then(() => happening.push('a'));
        ch.put('bar').then(() => happening.push('b'));
        ch.put('zar').then(() => happening.push('c'));
        ch.put('mar').then(() => happening.push('d'));
        expect(ch.__value()).toStrictEqual(['foo', 'bar']);
        ch.take().then(() => happening.push('e'));
        expect(ch.__value()).toStrictEqual(['bar']);
        ch.take().then(() => happening.push('f'));
        expect(ch.__value()).toStrictEqual([]);
        ch.take().then(() => happening.push('g'));
        ch.put('mar').then(() => happening.push('h'));
        expect(ch.__value()).toStrictEqual([]);

        await delay(5);
        expect(happening).toStrictEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']);
        spy.mockRestore();
      });
    });
  });
  describe('when we create a channel with a sliding buffer', () => {
    describe('and the buffer\'s size is 0', () => {
      it('shouldn\'t block', async () => {
        const ch = chan(buffer.sliding());
        const happening = [];
        const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        ch.put('foo').then(() => happening.push('a'));
        expect(ch.__value()).toStrictEqual(['foo']);
        ch.put('bar').then(() => happening.push('b'));
        expect(ch.__value()).toStrictEqual(['bar']);
        ch.put('zar').then(() => happening.push('c'));
        expect(ch.__value()).toStrictEqual(['zar']);
        ch.take().then(() => happening.push('d'));
        expect(ch.__value()).toStrictEqual([]);
        ch.take().then(() => happening.push('e'));
        ch.take().then(() => happening.push('g'));
        ch.take().then(() => happening.push('h'));
        ch.put('mar').then(() => happening.push('f'));

        await delay(5);
        expect(happening).toStrictEqual(['a', 'b', 'c', 'd', 'e', 'f']);
        spy.mockRestore();
      });
    });
    describe('and the buffer\'s size is > 0', () => {
      it('shouldn\'t block but drop values from the other side', async () => {
        const ch = chan(buffer.sliding(2));
        const happening = [];
        const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        ch.put('foo').then(() => happening.push('a'));
        ch.put('bar').then(() => happening.push('b'));
        ch.put('zar').then(() => happening.push('c'));
        expect(ch.__value()).toStrictEqual(['bar', 'zar']);
        ch.put('mar').then(() => happening.push('d'));
        expect(ch.__value()).toStrictEqual(['zar', 'mar']);
        ch.take().then(() => happening.push('e'));
        expect(ch.__value()).toStrictEqual(['mar']);
        ch.take().then(() => happening.push('f'));
        expect(ch.__value()).toStrictEqual([]);
        ch.take().then(() => happening.push('g'));
        ch.put('boo').then(() => happening.push('h'));
        expect(ch.__value()).toStrictEqual([]);

        await delay(5);
        expect(happening).toStrictEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']);
        spy.mockRestore();
      });
    });
  });
});
