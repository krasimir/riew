import { chan, buffer } from '../channel';
import { delay } from '../../__helpers__';

const createLog = () => {
  let happenings = [];
  let f = (p, value, keepOriginalV) => {
    return p.then(v => {
      if (typeof value !== 'undefined') {
        if (keepOriginalV) {
          happenings.push(value + ' ' + v);
        } else {
          happenings.push(value);
        }
      } else {
        happenings.push(v);
      }
    });
  };

  f.print = () => console.log(JSON.stringify(happenings, null, 2));
  f.dump = () => happenings;
  return f;
};
let log;

describe('Given a CSP channel', () => {
  beforeEach(() => {
    log = createLog();
  });

  // Statuses

  describe('and we have an OPEN state', () => {
    it('should allow writing and reading', async () => {
      const ch = chan();

      expect(ch.state()).toEqual(chan.OPEN);
      log(ch.put('foo'));
      log(ch.take());

      await delay(5);
      expect(log.dump()).toStrictEqual([true, 'foo']);
      expect(ch.state()).toEqual(chan.OPEN);
    });
  });
  describe('and we have a CLOSED state', () => {
    it('should allow only reading otherwise puts resolve to CLOSED', async () => {
      const ch = chan();

      log(ch.put('foo'));
      ch.close();
      log(ch.put('bar'));
      log(ch.put('zar'));
      log(ch.take());

      await delay(5);
      expect(log.dump()).toStrictEqual([chan.CLOSED, chan.CLOSED, true, 'foo']);
      expect(ch.state()).toEqual(chan.ENDED);
    });
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

  // pipe, merge

  describe('when we pipe channels', () => {
    fit('should pipe from one channel to another', async () => {
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
});
