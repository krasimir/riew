import { chan, buffer } from '../channel';
import { delay } from '../../__helpers__';
import { getFuncName } from '../../utils';

async function Test(...routines) {
  const log = [];
  await Promise.all(
    routines.map(r => {
      return new Promise(async resolve => {
        const rName = getFuncName(r);
        log.push(`>${rName}`);
        await r(str => log.push(str));
        log.push(`<${rName}`);
        resolve(log);
      });
    })
  );
  return log;
}

describe('Given a CSP channel', () => {
  // States

  describe('and we have an the channel OPEN', () => {
    it(`should
      * allow writing and reading
      * should block the put until take
      * should block the take until put`, async () => {
      const ch = chan();
      const result = await Test(
        async function A(log) {
          await ch.put('foo');
          log('put successful');
        },
        async function B(log) {
          log(`take=${await ch.take()}`);
        }
      );
      expect(result).toStrictEqual([
        '>A',
        '>B',
        'put successful',
        'take=foo',
        '<A',
        '<B'
      ]);
    });
  });
  describe('and we close the channel', () => {
    fit(`should
      - resolve the pending puts with CLOSE
      - resolve the future puts with ENDED`, async () => {});
  });
  describe('and we have an ENDED state', () => {
    it('should always resolve to ENDED', async () => {
      const ch = chan();

      log(ch.put('foo'));
      ch.close();
      log(ch.put('bar'));
      log(ch.take());
      log(ch.put('zar'));
      log(ch.take());

      await delay(5);
      expect(log.dump()).toStrictEqual([
        chan.CLOSED,
        true,
        'foo',
        chan.ENDED,
        chan.ENDED
      ]);
      expect(ch.state()).toEqual(chan.ENDED);
    });
  });
  describe('and we wait for taking but close the channel', () => {
    it('should resolve the taker with ENDED', async () => {
      const ch = chan();

      log(ch.take());
      ch.close();
      await delay(5);
      expect(log.dump()).toStrictEqual([chan.CLOSED]);
    });
  });

  // Types of buffers

  describe('when we create a channel with the default buffer (fixed buffer with size 0)', () => {
    it('allow writing and reading', async () => {
      const ch = chan();

      ch.put('foo');
      expect(await ch.take()).toEqual('foo');
    });
    it('should block the channel if there is no puts but we want to take', async () => {
      const ch = chan();

      log(ch.take(), 'a');
      log(ch.take(), 'b');
      log(ch.put('foo'), 'c');
      log(ch.put('bar'), 'd');

      await delay(5);
      expect(log.dump()).toStrictEqual(['a', 'c', 'b', 'd']);
    });
    it('should block the channel if there is no takers but we want to put', async () => {
      const ch = chan();

      log(ch.put('foo'), 'a');
      log(ch.put('bar'), 'b');
      log(ch.take(), 'c');
      log(ch.take(), 'd');

      await delay(5);
      expect(log.dump()).toStrictEqual(['a', 'c', 'b', 'd']);
    });
  });
  describe('when we create a channel with a fixed buffer with size > 0', () => {
    it('should allow as many puts as we have space', async () => {
      const ch = chan(buffer.fixed(2));
      const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      log(ch.put('foo'), 'a');
      log(ch.put('bar'), 'b');
      log(ch.put('zar'), 'c');
      log(ch.put('mar'), 'd');
      expect(ch.__value()).toStrictEqual(['foo', 'bar']);
      log(ch.take(), 'e');
      expect(ch.__value()).toStrictEqual(['bar', 'zar']);
      log(ch.take(), 'f');
      expect(ch.__value()).toStrictEqual(['zar', 'mar']);
      log(ch.take(), 'g');
      expect(ch.__value()).toStrictEqual(['mar']);
      log(ch.take(), 'h');
      expect(ch.__value()).toStrictEqual([]);

      await delay(5);
      expect(log.dump()).toStrictEqual([
        'a',
        'b',
        'c',
        'e',
        'd',
        'f',
        'g',
        'h'
      ]);
      spy.mockRestore();
    });
  });
  describe('when we create a channel with a dropping buffer', () => {
    describe("and the buffer's size is 0", () => {
      it("shouldn't block", async () => {
        const ch = chan(buffer.dropping());

        const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        log(ch.put('foo'), 'a', true);
        log(ch.put('bar'), 'b', true);
        log(ch.put('zar'), 'c', true);
        expect(ch.__value()).toStrictEqual(['foo']);
        log(ch.take(), 'd');
        expect(ch.__value()).toStrictEqual([]);
        log(ch.take(), 'e');
        log(ch.take(), 'g');
        log(ch.take(), 'h');
        log(ch.put('mar'), 'f');

        await delay(5);
        expect(log.dump()).toStrictEqual([
          'a true',
          'b false',
          'c false',
          'd',
          'e',
          'f'
        ]);
        spy.mockRestore();
      });
    });
    describe("and the buffer's size is > 0", () => {
      it("shouldn't block", async () => {
        const ch = chan(buffer.dropping(2));

        const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        log(ch.put('foo'), 'a');
        log(ch.put('bar'), 'b');
        log(ch.put('zar'), 'c');
        log(ch.put('mar'), 'd');
        expect(ch.__value()).toStrictEqual(['foo', 'bar']);
        log(ch.take(), 'e');
        expect(ch.__value()).toStrictEqual(['bar']);
        log(ch.take(), 'f');
        expect(ch.__value()).toStrictEqual([]);
        log(ch.take(), 'g');
        log(ch.put('mar'), 'h');
        expect(ch.__value()).toStrictEqual([]);

        await delay(5);
        expect(log.dump()).toStrictEqual([
          'a',
          'b',
          'c',
          'd',
          'e',
          'f',
          'g',
          'h'
        ]);
        spy.mockRestore();
      });
    });
  });
  describe('when we create a channel with a sliding buffer', () => {
    describe("and the buffer's size is 0", () => {
      it("shouldn't block", async () => {
        const ch = chan(buffer.sliding());
        const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        log(ch.put('foo'), 'a');
        expect(ch.__value()).toStrictEqual(['foo']);
        log(ch.put('bar'), 'b');
        expect(ch.__value()).toStrictEqual(['bar']);
        log(ch.put('zar'), 'c');
        expect(ch.__value()).toStrictEqual(['zar']);
        log(ch.take(), 'd');
        expect(ch.__value()).toStrictEqual([]);
        log(ch.take(), 'e');
        log(ch.take(), 'g');
        log(ch.take(), 'h');
        log(ch.put('mar'), 'f');

        await delay(5);
        expect(log.dump()).toStrictEqual(['a', 'b', 'c', 'd', 'e', 'f']);
        spy.mockRestore();
      });
    });
    describe("and the buffer's size is > 0", () => {
      it("shouldn't block but drop values from the other side", async () => {
        const ch = chan(buffer.sliding(2));
        const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        log(ch.put('foo'), 'a');
        log(ch.put('bar'), 'b');
        log(ch.put('zar'), 'c');
        expect(ch.__value()).toStrictEqual(['bar', 'zar']);
        log(ch.put('mar'), 'd');
        expect(ch.__value()).toStrictEqual(['zar', 'mar']);
        log(ch.take(), 'e');
        expect(ch.__value()).toStrictEqual(['mar']);
        log(ch.take(), 'f');
        expect(ch.__value()).toStrictEqual([]);
        log(ch.take(), 'g');
        log(ch.put('boo'), 'h');
        expect(ch.__value()).toStrictEqual([]);

        await delay(5);
        expect(log.dump()).toStrictEqual([
          'a',
          'b',
          'c',
          'd',
          'e',
          'f',
          'g',
          'h'
        ]);
        spy.mockRestore();
      });
    });
  });
  describe('when we create a channel with a reducer buffer', () => {
    it('should be blocking and should allow us to provide a reducer function', async () => {
      const reducerSpy = jest.fn();
      const ch = chan(
        buffer.reducer((current = 10, data) => {
          reducerSpy(current);
          return current + data;
        })
      );
      const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      log(ch.put(20), 'a');
      log(ch.take(), 'take', true);
      log(ch.take(), 'take', true);
      log(ch.put(5), 'b');
      log(ch.put(3), 'c');

      await delay(5);
      expect(log.dump()).toStrictEqual(['a', 'take 35', 'b', 'take 38', 'c']);
      expect(reducerSpy).toBeCalledWithArgs([10], [30], [35]);
      spy.mockRestore();
    });
  });

  // pipe, merge, alt

  describe('when we pipe channels', () => {
    it('should pipe from one channel to another', async () => {
      const ch1 = chan('ch1');
      const ch2 = chan('ch2');
      const ch3 = chan('ch3');
      const ch4 = chan('ch4');

      ch1
        .pipe(
          ch2,
          ch3
        )
        .pipe(ch4);

      log(ch1.put('foo'), 'put foo');
      log(ch1.put('bar'), 'put bar');
      log(ch1.put('zar'), 'put zar');

      log(ch2.take(), 'take ch2', true);
      log(ch4.take(), 'take ch4', true);
      log(ch4.take(), 'take ch4', true);
      log(ch4.take(), 'take ch4', true);

      await delay(5);
      expect(log.dump()).toStrictEqual([
        'put foo',
        'take ch2 foo',
        'put bar',
        'take ch4 foo',
        'put zar',
        'take ch4 bar',
        'take ch4 zar'
      ]);
    });
  });
  describe('when we merge channels', () => {
    it('should merge two and more into a single channel', async () => {
      const ch1 = chan('ch1');
      const ch2 = chan('ch2');
      const ch3 = chan('ch3');
      const ch4 = chan.merge(ch1, ch2, ch3);

      log(ch1.put('foo'), 'put foo');
      log(ch2.put('bar'), 'put bar');
      log(ch3.put('zar'), 'put zar');
      log(ch2.put('moo'), 'put moo');

      log(ch4.take(), 'take ch4', true);
      log(ch4.take(), 'take ch4', true);
      log(ch4.take(), 'take ch4', true);
      log(ch4.take(), 'take ch4', true);

      await delay(5);
      expect(log.dump()).toStrictEqual([
        'put foo',
        'put bar',
        'put zar',
        'take ch4 foo',
        'take ch4 bar',
        'put moo',
        'take ch4 zar',
        'take ch4 moo'
      ]);
    });
  });
  describe('when we use the alt method', () => {
    xit('should block till one of the operations is resolved', async () => {
      const ch1 = chan();
      const ch2 = chan();

      log(chan.alt(ch1.put('foo')));
    });
  });

  // timeout

  describe('when we use the timeout method', () => {
    it('should create a channel that is self closing after X amount of time', async () => {
      const ch = chan.timeout(30);
      const spy = jest.fn();

      ch.take().then(spy);
      expect(ch.state()).toBe(chan.OPEN);
      await delay(40);
      expect(ch.state()).toBe(chan.ENDED);
      expect(spy).toBeCalledWithArgs([chan.CLOSED]);
    });
  });
});
