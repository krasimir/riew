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
  ONE_OF,
} from '../index';
import { Test, exercise } from '../__helpers__';

describe('Given we have a dropping buffer', () => {
  beforeEach(() => {
    reset();
  });
  describe("when the buffer's size is 0", () => {
    it("shouldn't block the puts but only the takes", () => {
      const ch = chan(buffer.dropping());
      const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      return exercise(
        Test(
          function* A(log) {
            log(`value=${ch.value().toString()}`);
            log(`put1=${(yield put(ch, 'foo')).toString()}`);
            log(`value=${ch.value().toString()}`);
            log(`put2=${(yield put(ch, 'bar')).toString()}`);
            log(`value=${ch.value().toString()}`);
            log(`put3=${(yield put(ch, 'zar')).toString()}`);
            log(`value=${ch.value().toString()}`);
            yield sleep(10);
            log(`put4=${(yield put(ch, 'final')).toString()}`);
            log(`value=${ch.value().toString()}`);
          },
          function* B(log) {
            yield sleep(5);
            log('---');
            log(`take1=${(yield take(ch)).toString()}`);
            log(`take2=${(yield take(ch)).toString()}`);
          }
        ),
        [
          '>A',
          'value=',
          'put1=true',
          'value=foo',
          'put2=false',
          'value=foo',
          'put3=false',
          'value=foo',
          '>B',
          '---',
          'take1=foo',
          'take2=final',
          '<B',
          'put4=true',
          'value=',
          '<A',
        ],
        15,
        () => {
          spy.mockRestore();
        }
      );
    });
  });
  describe("when the buffer's size is > 0", () => {
    it("shouldn't block and it should buffer more values", () => {
      const ch = chan(buffer.dropping(2));
      const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      return exercise(
        Test(
          function* A(log) {
            log(`value=${ch.value().toString()}`);
            log(`put1=${(yield put(ch, 'foo')).toString()}`);
            log(`value=${ch.value().toString()}`);
            log(`put2=${(yield put(ch, 'bar')).toString()}`);
            log(`value=${ch.value().toString()}`);
            log(`put3=${(yield put(ch, 'zar')).toString()}`);
            log(`value=${ch.value().toString()}`);
            yield sleep(10);
            log(`put4=${(yield put(ch, 'final')).toString()}`);
            log(`value=${ch.value().toString()}`);
          },
          function* B(log) {
            yield sleep(5);
            log('---');
            log(`take1=${(yield take(ch)).toString()}`);
            log(`take2=${(yield take(ch)).toString()}`);
            log(`take3=${(yield take(ch)).toString()}`);
          }
        ),
        [
          '>A',
          'value=',
          'put1=true',
          'value=foo',
          'put2=true',
          'value=foo,bar',
          'put3=false',
          'value=foo,bar',
          '>B',
          '---',
          'take1=foo',
          'take2=bar',
          'take3=final',
          '<B',
          'put4=true',
          'value=',
          '<A',
        ],
        15,
        () => {
          spy.mockRestore();
        }
      );
    });
  });
  describe('when we have a pre-set value', () => {
    it('should allow a non-blocking take', () => {
      const ch = chan(buffer.dropping(2));
      sput(ch, 'a');
      sput(ch, 'b');
      const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      exercise(
        Test(function* A(log) {
          log(`take1=${(yield take(ch)).toString()}`);
          log(`take2=${(yield take(ch)).toString()}`);
        }),
        ['>A', 'take1=a', 'take2=b', '<A']
      );
      spy.mockRestore();
    });
  });
});

// reading

describe('Given we use take with options and a dropping buffer', () => {
  describe.each([
    [
      'buffer size = 0',
      chan(buffer.dropping),
      ['>A', '>B', 'read1=foo', 'read2=bar', '<A', '<B'],
    ],
    [
      'buffer size > 0',
      chan(buffer.dropping(2)),
      [
        '>A',
        '>B',
        'read1=foo',
        true,
        'read2=bar',
        '<A',
        true,
        true,
        true,
        '<B',
      ],
    ],
  ])('when we _read_ from a channel via routine (%s)', (_, ch, expected) => {
    fit('should just resolve the read but not consume the value and not resolve puts', () => {
      exercise(
        Test(
          function* A(log) {
            log(`read1=${(yield read(ch)).toString()}`);
            log(`read2=${(yield read(ch)).toString()}`);
          },
          function* B(log) {
            sput(ch, 'foo', v => log(`${v} put foo`));
            sput(ch, 'bar', v => log(`${v} put bar`));
            sput(ch, 'zar', v => log(`${v} put zar`));
          }
        ),
        expected
      );
    });
  });
  describe.each([
    ['buffer size = 0', chan(buffer.dropping), [['foo']]],
    ['buffer size > 0', chan(buffer.dropping(2)), [['foo'], [true], [true]]],
  ])(
    'when we _read_ from a channel outside a routine (%s)',
    (_, ch, expected) => {
      it('should just resolve the read but not consume the value and not resolve puts', () => {
        const spy = jest.fn();

        sread(ch, spy);
        sput(ch, 'foo', spy); // <- spy didn't call here
        sput(ch, 'bar', spy); // <- spy didn't call here

        expect(spy).toBeCalledWithArgs(...expected);
      });
    }
  );
  describe('when we _read_ from multiple channels via routine', () => {
    it('should wait till both channels have something', () => {
      const ch1 = chan(buffer.dropping());
      const ch2 = chan(buffer.dropping());

      exercise(
        Test(
          function* A(log) {
            log(`read=${(yield read([ch1, ch2])).toString()}`);
          },
          function* B(log) {
            sput(ch1, 'foo', log);
            sput(ch2, 'bar', log);
          }
        ),
        ['>A', '>B', 'read=foo,bar', '<A', '<B']
      );
    });
  });
  describe('when we _read_ from multiple channels outside a routine', () => {
    it('should wait till both channels have something', () => {
      const ch1 = chan(buffer.dropping());
      const ch2 = chan(buffer.dropping());
      const spy = jest.fn();

      sread([ch1, ch2], spy);
      sput(ch1, 'foo', spy); // <- spy didn't call here
      sput(ch2, 'bar', spy); // <- spy didn't call here

      expect(spy).toBeCalledWithArgs([['foo', 'bar']]);
    });
  });
  describe.each([
    ['buffer size = 0', chan(buffer.dropping()), [['foo'], ['bar']]],
    [
      'buffer size > 0',
      chan(buffer.dropping(2)),
      [['foo'], [true], ['bar'], [true]],
    ],
  ])('when we listen (%s)', (_, ch, expected) => {
    it('should wait till both channels have something', () => {
      const spy = jest.fn();

      sread(ch, spy, { listen: true });
      sput(ch, 'foo', spy);
      sput(ch, 'bar', spy);

      expect(spy).toBeCalledWithArgs(...expected);
    });
  });
  describe('when we listen from multiple channels', () => {
    it('should wait till both channels have something', () => {
      const ch1 = chan(buffer.dropping());
      const ch2 = chan(buffer.dropping());
      const spy = jest.fn();

      sread([ch1, ch2], spy, { listen: true });
      sput(ch1, 'foo', spy); // <- spy didn't call here
      sput(ch2, 'bar', spy); // <- spy didn't call here
      sput(ch2, 'xxx', spy); // <- spy didn't call here

      expect(spy).toBeCalledWithArgs([['foo', 'bar']], [['foo', 'xxx']]);
    });
  });
  describe('when we listen from multiple channels using the ONE_OF strategy', () => {
    it('should fire the callback as soon as there is a value', () => {
      const ch1 = chan(buffer.dropping());
      const ch2 = chan(buffer.dropping());
      const spy = jest.fn();

      sread([ch1, ch2], spy, { listen: true, strategy: ONE_OF });
      sput(ch1, 'foo', spy); // <- spy didn't call here
      sput(ch2, 'bar', spy); // <- spy didn't call here
      sput(ch2, 'xxx', spy); // <- spy didn't call here

      expect(spy).toBeCalledWithArgs(['foo', 0], ['bar', 1], ['xxx', 1]);
    });
  });
  describe('when we read after we have puts to the channel', () => {
    it('should do nothing', () => {
      const ch = chan(buffer.dropping());
      const spy = jest.fn();

      sput(ch, 'foo', () => spy('first put'));
      sput(ch, 'bar', () => spy('second put'));
      sread(ch, spy);

      expect(spy).toBeCalledWithArgs();
    });
  });
  describe('when we read after we have puts to the channel but with a channel with size > 0', () => {
    it('should resolve the read with the first put item', () => {
      const ch = chan(buffer.dropping(2));
      const spy = jest.fn();

      sput(ch, 'foo', () => spy('first put'));
      sput(ch, 'bar', () => spy('second put'));
      sread(ch, spy);

      expect(spy).toBeCalledWithArgs(['first put'], ['second put'], ['foo']);
    });
  });
});
