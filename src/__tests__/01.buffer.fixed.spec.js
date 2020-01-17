import {
  chan,
  buffer,
  read,
  sread,
  reset,
  take,
  put,
  sput,
  sleep,
  stake,
  ONE_OF,
} from '../index';
import { Test, exercise } from '../__helpers__';

// Fixed buffer

describe('Given the Fixed buffer', () => {
  beforeEach(() => {
    reset();
  });

  // put

  describe('when there are pending takers', () => {
    it(`should
      * register the added value to the buffer
      * consume the first taker from the list
      * resolve the put`, () => {
      const buf = buffer.fixed();
      const spy = jest.fn();

      buf.take(v => spy('take1', v));
      buf.take(v => spy('take2', v));
      buf.put('foo', () => spy('put'));

      expect(spy).toBeCalledWithArgs(['take1', 'foo'], ['put']);
    });
  });
  describe('when we put but there is no pending takers', () => {
    describe('and buffer has empty space', () => {
      it('should fill the buffer with values and resolve the put', () => {
        const buf = buffer.fixed(2);
        const spy = jest.fn();

        buf.put('foo', () => spy('put1'));
        buf.put('bar', () => spy('put2'));
        buf.put('zoo', () => spy('put3'));

        expect(spy).toBeCalledWithArgs(['put1'], ['put2']);
      });
    });
    describe('and buffer has no empty space', () => {
      it('should create a pending put', () => {
        const buf = buffer.fixed();
        const spy = jest.fn();

        buf.put('foo', () => spy('put1'));
        buf.put('bar', () => spy('put2'));

        expect(spy).toBeCalledWithArgs();
        expect(buf.puts).toHaveLength(2);
      });
    });
  });

  // take

  describe('when we take but the buffer is empty', () => {
    describe('and there are pending puts', () => {
      it('should resolve the first pending put and then the take', () => {
        const buf = buffer.fixed();
        const spy = jest.fn();

        buf.put('foo', v => spy('put', v));
        expect(buf.puts).toHaveLength(1);
        buf.take(spy);

        expect(spy).toBeCalledWithArgs(['put', true], ['foo']);
      });
      describe('and we are reading', () => {
        it('should leave the pending put and read undefined', () => {
          const buf = buffer.fixed();
          const spy = jest.fn();

          buf.put('foo', v => spy('put', v));
          expect(buf.puts).toHaveLength(1);
          buf.take(spy, { read: true });
          expect(spy).toBeCalledWithArgs([undefined]);
          expect(buf.puts).toHaveLength(1);
        });
      });
    });
    describe('and there are no pending puts', () => {
      it('should create a pending taker', () => {
        const buf = buffer.fixed();
        const spy = jest.fn();

        buf.take(spy);
        expect(spy).toBeCalledWithArgs();
        expect(buf.takes).toHaveLength(1);
      });
    });
  });
  describe('when we take and the buffer is not empty', () => {
    describe('and we are reading', () => {
      it('should resolve the reader and leave the value in the buffer', () => {
        const buf = buffer.fixed(1);
        const spy = jest.fn();

        buf.put('foo', () => spy('put'));
        buf.take(spy, { read: true });
        expect(spy).toBeCalledWithArgs(['put'], ['foo']);
        expect(buf.getValue()).toStrictEqual(['foo']);
      });
    });
    describe('and we are not reading', () => {
      it('should consume a value of the buffer', () => {
        const buf = buffer.fixed(1);
        const spy = jest.fn();

        buf.put('foo', () => spy('put'));
        buf.take(spy);
        expect(spy).toBeCalledWithArgs(['put'], ['foo']);
        expect(buf.getValue()).toStrictEqual([]);
      });
      describe('and there are pending puts and space in the buffer', () => {
        it('should resolve the next pending put', () => {
          const buf = buffer.fixed(1);
          const spy = jest.fn();

          buf.put('foo', () => spy('put1'));
          buf.put('bar', () => spy('put2'));
          buf.take(spy);
          expect(spy).toBeCalledWithArgs(['put1'], ['foo'], ['put2']);
          expect(buf.getValue()).toStrictEqual(['bar']);
        });
      });
    });
  });

  // Other

  describe('when we listen', () => {
    it('should resolve the take multiple times without consuming the puts', () => {
      const buf = buffer.fixed();
      const spy = jest.fn();

      buf.take(v => spy('take', v), { listen: true });
      spy('waiting');
      buf.put('foo', v => spy('put1', v));
      buf.put('bar', v => spy('put2', v));

      expect(spy).toBeCalledWithArgs(
        ['waiting'],
        ['take', 'foo'],
        ['take', 'bar']
      );
    });
    describe('and we have `initialCall` set to true', () => {
      it('should resolve the take once with the current buffer value', () => {
        const buf = buffer.fixed();
        const spy = jest.fn();

        buf.take(v => spy('take', v), { listen: true, initialCall: true });
        spy('waiting');
        buf.put('foo', v => spy('put1', v));
        buf.put('bar', v => spy('put2', v));

        expect(spy).toBeCalledWithArgs(
          ['take', undefined],
          ['waiting'],
          ['take', 'foo'],
          ['take', 'bar']
        );
      });
    });
  });
  describe('when we read after a put', () => {
    it('should read undefined', () => {
      const buf = buffer.fixed();
      const spy = jest.fn();

      buf.put('foo', v => spy('put1', v));
      spy('waiting');
      buf.take(v => spy('take', v), { read: true });

      expect(spy).toBeCalledWithArgs(['waiting'], ['take', undefined]);
    });
  });
  describe('when we have a mix type of listeners and takers', () => {
    it('should resolve them properly', () => {
      const buf = buffer.fixed();
      const spy = jest.fn();

      buf.take(v => spy('read', v), { listen: true });
      buf.take(v => spy('take', v));
      spy('waiting');
      buf.put('foo', v => spy('put1', v));
      buf.put('bar', v => spy('put2', v));

      expect(spy).toBeCalledWithArgs(
        ['waiting'],
        ['read', 'foo'],
        ['take', 'foo'],
        ['put1', true],
        ['read', 'bar']
      );
    });
  });
  describe('when we have size > 0', () => {
    it('should wait for a put to resolve the take', () => {
      const buf = buffer.fixed(1);
      const spy = jest.fn();

      buf.put('foo', v => spy('put', v));
      buf.put('bar', v => spy('put', v));
      spy('waiting');
      buf.take(v => spy('take', v));

      expect(spy).toBeCalledWithArgs(
        ['put', true],
        ['waiting'],
        ['take', 'foo'],
        ['put', true]
      );
    });
  });
  describe('when using inside a routine', () => {
    it('should block the channel if there is no puts but we want to take', () => {
      const ch = chan();

      exercise(
        Test(
          function* A(log) {
            log(`take1=${(yield take(ch)).toString()}`);
            log(`take2=${(yield take(ch)).toString()}`);
          },
          function* B(log) {
            log(`put1=${(yield put(ch, 'foo')).toString()}`);
            log(`put2=${(yield put(ch, 'bar')).toString()}`);
          }
        ),
        [
          '>A',
          '>B',
          'take1=foo',
          'put1=true',
          'take2=bar',
          '<A',
          'put2=true',
          '<B',
        ]
      );
    });
    it('should block the channel if there is no takers but we want to put', () => {
      const ch = chan();

      exercise(
        Test(
          function* A(log) {
            log(`put1=${(yield put(ch, 'foo')).toString()}`);
            log(`put2=${(yield put(ch, 'bar')).toString()}`);
          },
          function* B(log) {
            log(`take1=${(yield take(ch)).toString()}`);
            log(`take2=${(yield take(ch)).toString()}`);
          }
        ),
        [
          '>A',
          '>B',
          'put1=true',
          'take1=foo',
          'put2=true',
          '<A',
          'take2=bar',
          '<B',
        ]
      );
    });
  });
  describe('when buffer size > 0', () => {
    it('should allow as many puts as we have space', () => {
      const ch = chan(buffer.fixed(2));
      const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      return exercise(
        Test(
          function* A(log) {
            log(`value1=${ch.value().toString()}`);
            log(`put1=${(yield put(ch, 'foo')).toString()}`);
            log(`value2=${ch.value().toString()}`);
            log(`put2=${(yield put(ch, 'bar')).toString()}`);
            log(`value3=${ch.value().toString()}`);
            log(`put3=${(yield put(ch, 'zar')).toString()}`);
            log(`value4=${ch.value().toString()}`);
            log(`put4=${(yield put(ch, 'mar')).toString()}`);
            log(`value5=${ch.value().toString()}`);
          },
          function* B(log) {
            yield sleep(5);
            log('end of waiting');
            log(`take1=${(yield take(ch)).toString()}`);
            log(`take2=${(yield take(ch)).toString()}`);
            log(`take3=${(yield take(ch)).toString()}`);
            log(`take4=${(yield take(ch)).toString()}`);
          }
        ),
        [
          '>A',
          'value1=',
          'put1=true',
          'value2=foo',
          'put2=true',
          'value3=foo,bar',
          '>B',
          'end of waiting',
          'take1=foo',
          'take2=bar',
          'put3=true',
          'value4=zar',
          'put4=true',
          'value5=zar,mar',
          '<A',
          'take3=zar',
          'take4=mar',
          '<B',
        ],
        10,
        () => {
          spy.mockRestore();
        }
      );
    });
  });
});

// reading

describe('Given we use take with options and a fixed buffer', () => {
  beforeEach(() => {
    reset();
  });
  describe.each([
    [
      'buffer size = 0',
      chan(),
      ['>B', '<B', '>A', 'read1=undefined', 'read2=undefined', '<A'],
    ],
    [
      'buffer size > 0',
      chan(buffer.fixed(2)),
      ['>B', true, true, '<B', '>A', 'read1=foo', 'read2=foo', '<A'],
    ],
  ])('when we _read_ from a channel via routine (%s)', (_, ch, expected) => {
    it('should just resolve the read but not consume the value and not resolve puts', () => {
      exercise(
        Test(
          function* B(log) {
            sput(ch, 'foo', log);
            sput(ch, 'bar', log);
            sput(ch, 'zar', log); // <- never resolve
          },
          function* A(log) {
            log(`read1=${yield read(ch)}`);
            log(`read2=${yield read(ch)}`);
          }
        ),
        expected
      );
    });
  });
  describe.each([
    ['buffer size = 0', chan(), [[undefined]]],
    ['buffer size > 0', chan(buffer.fixed(2)), [[true], [true], ['foo']]],
  ])(
    'when we _read_ from a channel outside a routine (%s)',
    (_, ch, expected) => {
      it('should just resolve the read but not consume the value and not resolve puts', () => {
        const spy = jest.fn();

        sput(ch, 'foo', spy);
        sput(ch, 'bar', spy);
        sread(ch, spy);

        expect(spy).toBeCalledWithArgs(...expected);
      });
    }
  );
  describe('when we _read_ from multiple channels via routine', () => {
    it('should get the values of both channels', () => {
      const ch1 = chan(buffer.fixed(1));
      const ch2 = chan(buffer.fixed(1));

      exercise(
        Test(
          function* A(log) {
            sput(ch1, 'foo', log);
            sput(ch2, 'bar', log);
          },
          function* B(log) {
            log(`read=${(yield read([ch1, ch2])).toString()}`);
          }
        ),
        ['>A', true, true, '<A', '>B', 'read=foo,bar', '<B']
      );
    });
  });
  describe('when we _read_ from multiple channels outside a routine', () => {
    it('should wait till both channels have something', () => {
      const ch1 = chan(buffer.fixed(1));
      const ch2 = chan(buffer.fixed(1));
      const spy = jest.fn();

      sput(ch1, 'foo', spy);
      sput(ch2, 'bar', spy);
      stake([ch1, ch2], spy);

      expect(spy).toBeCalledWithArgs([true], [true], [['foo', 'bar']]);
    });
  });
  describe.each([
    ['buffer size = 0', chan(), [['foo'], ['bar']]],
    [
      'buffer size > 0',
      chan(buffer.fixed(2)),
      [['foo'], [true], ['bar'], [true]],
    ],
  ])('when we listen (%s)', (_, ch, expected) => {
    it('should wait till the channel has something', () => {
      const spy = jest.fn();

      stake(ch, spy, { listen: true });
      sput(ch, 'foo', spy);
      sput(ch, 'bar', spy);

      expect(spy).toBeCalledWithArgs(...expected);
    });
  });
  describe('when we listen from multiple channels', () => {
    it('should wait till both channels have something', () => {
      const ch1 = chan();
      const ch2 = chan();
      const spy = jest.fn();

      stake([ch1, ch2], spy, { listen: true });
      sput(ch1, 'foo', spy);
      sput(ch2, 'bar', spy);
      sput(ch2, 'xxx', spy);

      expect(spy).toBeCalledWithArgs([['foo', 'bar']], [['foo', 'xxx']]);
    });
  });
  describe('when we listen from multiple channels using the ONE_OF strategy', () => {
    it('should fire the callback as soon as there is a value', () => {
      const ch1 = chan();
      const ch2 = chan();
      const spy = jest.fn();

      stake([ch1, ch2], spy, { listen: true, strategy: ONE_OF });
      sput(ch1, 'foo', spy);
      sput(ch2, 'bar', spy);
      sput(ch2, 'xxx', spy);

      expect(spy).toBeCalledWithArgs(['foo', 0], ['bar', 1], ['xxx', 1]);
    });
  });
});
