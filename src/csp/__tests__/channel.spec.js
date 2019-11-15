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
async function exercise(p, expectation) {
  expect(await p).toStrictEqual(expectation);
}

describe('Given a CSP channel', () => {
  // States

  describe('and we have an the channel OPEN', () => {
    it(`should
      * allow writing and reading
      * should block the put until take
      * should block the take until put`, async () => {
      const ch = chan();

      await exercise(
        Test(
          async function A(log) {
            await ch.put('foo');
            log('put successful');
          },
          async function B(log) {
            log(`take=${await ch.take()}`);
          }
        ),
        ['>A', '>B', 'put successful', 'take=foo', '<A', '<B']
      );
    });
  });
  describe('and we close the channel', () => {
    it(`should
      - resolve the pending puts with CLOSE
      - resolve the future puts with CLOSE if the buffer is not empty
      - resolve the future puts with ENDED if the buffer is empty
      - allow takes if the buffer is not empty
      - resolve the future takes with ENDED if the buffer is empty`, async () => {
      const ch = chan();

      await exercise(
        Test(
          async function A(log) {
            log(`p1=${(await ch.put('foo')).toString()}`);
            log(`p2=${(await ch.put('bar')).toString()}`);
            log(`p3=${(await ch.put('zar')).toString()}`);
          },
          async function B(log) {
            log(`take1=${(await ch.take()).toString()}`);
            ch.close();
            log(`take2=${(await ch.take()).toString()}`);
            log(`take3=${(await ch.take()).toString()}`);
          }
        ),
        [
          '>A',
          '>B',
          'p1=true',
          'take1=foo',
          'p2=Symbol(CLOSED)',
          'take2=bar',
          'p3=Symbol(ENDED)',
          'take3=Symbol(ENDED)',
          '<A',
          '<B'
        ]
      );
    });
    it('should resolve the pending takes with ENDED', async () => {
      const ch = chan();

      await exercise(
        Test(
          async function A(log) {
            log(`take1=${(await ch.take()).toString()}`);
          },
          async function B() {
            ch.close();
          }
        ),
        ['>A', '>B', 'take1=Symbol(ENDED)', '<B', '<A']
      );
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

      await exercise(
        Test(
          async function A(log) {
            log(`take1=${(await ch.take()).toString()}`);
            log(`take2=${(await ch.take()).toString()}`);
          },
          async function B(log) {
            log(`put1=${(await ch.put('foo')).toString()}`);
            log(`put2=${(await ch.put('bar')).toString()}`);
          }
        ),
        [
          '>A',
          '>B',
          'take1=foo',
          'put1=true',
          'take2=bar',
          'put2=true',
          '<A',
          '<B'
        ]
      );
    });
    it('should block the channel if there is no takers but we want to put', async () => {
      const ch = chan();

      await exercise(
        Test(
          async function A(log) {
            log(`put1=${(await ch.put('foo')).toString()}`);
            log(`put2=${(await ch.put('bar')).toString()}`);
          },
          async function B(log) {
            log(`take1=${(await ch.take()).toString()}`);
            log(`take2=${(await ch.take()).toString()}`);
          }
        ),
        [
          '>A',
          '>B',
          'put1=true',
          'take1=foo',
          'put2=true',
          'take2=bar',
          '<A',
          '<B'
        ]
      );
    });
  });
  describe('when we create a channel with a fixed buffer with size > 0', () => {
    it('should allow as many puts as we have space', async () => {
      const ch = chan(buffer.fixed(2));
      const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      await exercise(
        Test(
          async function A(log) {
            log(`value1=${ch.__value().toString()}`);
            log(`put1=${(await ch.put('foo')).toString()}`);
            log(`value2=${ch.__value().toString()}`);
            log(`put2=${(await ch.put('bar')).toString()}`);
            log(`value3=${ch.__value().toString()}`);
            log(`put3=${(await ch.put('zar')).toString()}`);
            log(`value4=${ch.__value().toString()}`);
            log(`put4=${(await ch.put('mar')).toString()}`);
            log(`value5=${ch.__value().toString()}`);
          },
          async function B(log) {
            await delay(20);
            log('end of waiting');
            log(`take1=${(await ch.take()).toString()}`);
            log(`take2=${(await ch.take()).toString()}`);
            log(`take3=${(await ch.take()).toString()}`);
            log(`take4=${(await ch.take()).toString()}`);
          }
        ),
        [
          '>A',
          'value1=',
          '>B',
          'put1=true',
          'value2=foo',
          'put2=true',
          'value3=foo,bar',
          'end of waiting',
          'put3=true',
          'value4=bar,zar',
          'take1=foo',
          'put4=true',
          'value5=zar,mar',
          'take2=bar',
          '<A',
          'take3=zar',
          'take4=mar',
          '<B'
        ]
      );
      spy.mockRestore();
    });
  });
  describe('when we create a channel with a dropping buffer', () => {
    describe("and the buffer's size is 0", () => {
      it("shouldn't block the puts but only the takes", async () => {
        const ch = chan(buffer.dropping());
        const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        await exercise(
          Test(
            async function A(log) {
              log(`value=${ch.__value().toString()}`);
              log(`put1=${(await ch.put('foo')).toString()}`);
              log(`value=${ch.__value().toString()}`);
              log(`put2=${(await ch.put('bar')).toString()}`);
              log(`value=${ch.__value().toString()}`);
              log(`put3=${(await ch.put('zar')).toString()}`);
              log(`value=${ch.__value().toString()}`);
              await delay(10);
              log(`put4=${(await ch.put('final')).toString()}`);
              log(`value=${ch.__value().toString()}`);
            },
            async function B(log) {
              await delay(5);
              log('---');
              log(`take1=${(await ch.take()).toString()}`);
              log(`take2=${(await ch.take()).toString()}`);
            }
          ),
          [
            '>A',
            'value=',
            '>B',
            'put1=true',
            'value=foo',
            'put2=false',
            'value=foo',
            'put3=false',
            'value=foo',
            '---',
            'take1=foo',
            'take2=final',
            'put4=true',
            'value=',
            '<B',
            '<A'
          ]
        );
        spy.mockRestore();
      });
    });
    describe("and the buffer's size is > 0", () => {
      it("shouldn't block and it should buffer more values", async () => {
        const ch = chan(buffer.dropping(2));
        const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        await exercise(
          Test(
            async function A(log) {
              log(`value=${ch.__value().toString()}`);
              log(`put1=${(await ch.put('foo')).toString()}`);
              log(`value=${ch.__value().toString()}`);
              log(`put2=${(await ch.put('bar')).toString()}`);
              log(`value=${ch.__value().toString()}`);
              log(`put3=${(await ch.put('zar')).toString()}`);
              log(`value=${ch.__value().toString()}`);
              await delay(10);
              log(`put4=${(await ch.put('final')).toString()}`);
              log(`value=${ch.__value().toString()}`);
            },
            async function B(log) {
              await delay(5);
              log('---');
              log(`take1=${(await ch.take()).toString()}`);
              log(`take2=${(await ch.take()).toString()}`);
              log(`take3=${(await ch.take()).toString()}`);
            }
          ),
          [
            '>A',
            'value=',
            '>B',
            'put1=true',
            'value=foo',
            'put2=true',
            'value=foo,bar',
            'put3=false',
            'value=foo,bar',
            '---',
            'take1=foo',
            'take2=bar',
            'take3=final',
            'put4=true',
            'value=',
            '<B',
            '<A'
          ]
        );
        spy.mockRestore();
      });
    });
  });
  describe('when we create a channel with a sliding buffer', () => {
    describe("and the buffer's size is 0", () => {
      it("shouldn't block but keep the latest pushed value", async () => {
        const ch = chan(buffer.sliding());
        const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        await exercise(
          Test(
            async function A(log) {
              log(`value=${ch.__value().toString()}`);
              log(`put1=${(await ch.put('foo')).toString()}`);
              log(`value=${ch.__value().toString()}`);
              log(`put2=${(await ch.put('bar')).toString()}`);
              log(`value=${ch.__value().toString()}`);
              log(`put3=${(await ch.put('zar')).toString()}`);
              log(`value=${ch.__value().toString()}`);
              await delay(10);
              log(`put4=${(await ch.put('final')).toString()}`);
              log(`value=${ch.__value().toString()}`);
            },
            async function B(log) {
              await delay(5);
              log('---');
              log(`take1=${(await ch.take()).toString()}`);
              log(`take2=${(await ch.take()).toString()}`);
            }
          ),
          [
            '>A',
            'value=',
            '>B',
            'put1=true',
            'value=foo',
            'put2=true',
            'value=bar',
            'put3=true',
            'value=zar',
            '---',
            'take1=zar',
            'take2=final',
            'put4=true',
            'value=',
            '<B',
            '<A'
          ]
        );
        spy.mockRestore();
      });
    });
    describe("and the buffer's size is > 0", () => {
      it("shouldn't block but drop values from the other side", async () => {
        const ch = chan(buffer.sliding(2));
        const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        await exercise(
          Test(
            async function A(log) {
              log(`value=${ch.__value().toString()}`);
              log(`put1=${(await ch.put('foo')).toString()}`);
              log(`value=${ch.__value().toString()}`);
              log(`put2=${(await ch.put('bar')).toString()}`);
              log(`value=${ch.__value().toString()}`);
              log(`put3=${(await ch.put('zar')).toString()}`);
              log(`value=${ch.__value().toString()}`);
              await delay(10);
              log(`put4=${(await ch.put('final')).toString()}`);
              log(`value=${ch.__value().toString()}`);
            },
            async function B(log) {
              await delay(5);
              log('---');
              log(`take1=${(await ch.take()).toString()}`);
              log(`take2=${(await ch.take()).toString()}`);
            }
          ),
          [
            '>A',
            'value=',
            '>B',
            'put1=true',
            'value=foo',
            'put2=true',
            'value=foo,bar',
            'put3=true',
            'value=bar,zar',
            '---',
            'take1=bar',
            'take2=zar',
            '<B',
            'put4=true',
            'value=final',
            '<A'
          ]
        );
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

      await exercise(
        Test(
          async function A(log) {
            log(`put1=${(await ch.put(20)).toString()}`);
            log(`put2=${(await ch.put(5)).toString()}`);
            log(`put3=${(await ch.put(3)).toString()}`);
          },
          async function B(log) {
            await delay(5);
            log(`take1=${(await ch.take()).toString()}`);
            log(`take2=${(await ch.take()).toString()}`);
          }
        ),
        [
          '>A',
          '>B',
          'put1=true',
          'put2=true',
          'put3=true',
          '<A',
          'take1=38',
          'take2=38',
          '<B'
        ]
      );

      expect(reducerSpy).toBeCalledWithArgs([10], [30], [35]);
      spy.mockRestore();
    });
  });

  // merge

  describe('when we merge channels', () => {
    it('should merge two and more into a single channel', async () => {
      const ch1 = chan('ch1');
      const ch2 = chan('ch2');
      const ch3 = chan('ch3');
      const ch4 = chan.merge(ch1, ch2, ch3);

      await exercise(
        Test(
          async function A(log) {
            log(`put1=${(await ch1.put('foo')).toString()}`);
            log(`put2=${(await ch2.put('bar')).toString()}`);
            log(`put3=${(await ch3.put('zar')).toString()}`);
            log(`put4=${(await ch4.put('moo')).toString()}`);
          },
          async function B(log) {
            log(`take1=${(await ch4.take()).toString()}`);
            log(`take2=${(await ch4.take()).toString()}`);
            log(`take3=${(await ch4.take()).toString()}`);
            log(`take4=${(await ch4.take()).toString()}`);
          }
        ),
        [
          '>A',
          '>B',
          'put1=true',
          'take1=foo',
          'put2=true',
          'take2=bar',
          'put3=true',
          'take3=zar',
          'put4=true',
          'take4=moo',
          '<A',
          '<B'
        ]
      );
    });
  });

  // pipe

  describe('when we pipe channels', () => {
    it('should distribute a single value to multiple channels', async () => {
      const ch1 = chan();
      const ch2 = chan();
      const ch3 = chan();

      ch1.pipe(ch2);
      ch2.pipe(ch3);

      await exercise(
        Test(
          async function A(log) {
            ch2.take().then(v => log(`take_ch2=${v}`));
            ch3.take().then(v => log(`take_ch3=${v}`));
            ch3.take().then(v => log(`take_ch3=${v}`));
            await delay(5);
          },
          async function B() {
            ch1.put('foo');
            ch1.put('bar');
            ch1.put('zar');
          }
        ),
        ['>A', '>B', '<B', 'take_ch3=foo', 'take_ch2=bar', 'take_ch3=zar', '<A']
      );
    });
    it('should support nested piping', async () => {
      const ch1 = chan('ch1');
      const ch2 = chan('ch2');
      const ch3 = chan('ch3');
      const ch4 = chan('ch4');

      ch1.pipe(
        ch2,
        ch3
      );
      ch2.pipe(ch4);

      await exercise(
        Test(
          async function A(log) {
            await ch1.put('foo');
            await ch1.put('bar');
            await ch1.put('zar');
          },
          async function B(log) {
            ch1.take().then(v => log(`take_ch1=${v}`));
            ch2.take().then(v => log(`take_ch2=${v}`));
            ch3.take().then(v => log(`take_ch3=${v}`));
            ch4.take().then(v => log(`take_ch4=${v}`));
            await delay(10);
          }
        ),
        [
          '>A',
          '>B',
          'take_ch3=foo',
          'take_ch1=bar',
          'take_ch4=foo',
          'take_ch2=zar',
          '<A',
          '<B'
        ]
      );
    });
  });

  // timeout

  describe('when we use the timeout method', () => {
    it('should create a channel that is self closing after X amount of time', async () => {
      const ch = chan.timeout(10);

      await exercise(
        Test(
          async function A(log) {
            log(`put1=${(await ch.put('foo')).toString()}`);
            await delay(20);
            log(`put2=${(await ch.put('bar')).toString()}`);
          },
          async function B(log) {
            await delay(20);
            log(`take1=${(await ch.take()).toString()}`);
            log(`take2=${(await ch.take()).toString()}`);
          }
        ),
        [
          '>A',
          '>B',
          'put1=Symbol(CLOSED)',
          'take1=foo',
          'take2=Symbol(ENDED)',
          '<B',
          'put2=Symbol(ENDED)',
          '<A'
        ]
      );
    });
  });

  // reset

  describe('when we use the reset method', () => {
    it('should put the channel in its initial state', async () => {
      const ch = chan(buffer.sliding(2));
      const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      await exercise(
        Test(
          async function A(log) {
            log(`put1=${(await ch.put('foo')).toString()}`);
            log(`value=${ch.__value().toString()}`);
            log(`put2=${(await ch.put('bar')).toString()}`);
            log(`value=${ch.__value().toString()}`);
            log(`put3=${(await ch.put('zar')).toString()}`);
            log(`value=${ch.__value().toString()}`);
            await delay(10);
            log(`put4=${(await ch.put('mar')).toString()}`);
            log(`value=${ch.__value().toString()}`);
          },
          async function B(log) {
            await delay(5);
            ch.reset();
            log('reset');
          }
        ),
        [
          '>A',
          '>B',
          'put1=true',
          'value=foo',
          'put2=true',
          'value=foo,bar',
          'put3=true',
          'value=bar,zar',
          'reset',
          '<B',
          'put4=true',
          'value=mar',
          '<A'
        ]
      );
      spy.mockReset();
    });
  });

  // withValue

  describe('when we use the withValue method', () => {
    it('should pre-set the value of the channel', async () => {
      const ch = chan(buffer.fixed(2)).withValue('foo', 'bar');

      await exercise(
        Test(
          async function A(log) {
            log(`take1=${(await ch.take()).toString()}`);
            log(`take2=${(await ch.take()).toString()}`);
            log(`take3=${(await ch.take()).toString()}`);
          },
          async function B(log) {
            await delay(5);
            log('B put');
            log(`put=${(await ch.put('zar')).toString()}`);
          }
        ),
        [
          '>A',
          '>B',
          'take1=foo',
          'take2=bar',
          'B put',
          'take3=zar',
          'put=true',
          '<A',
          '<B'
        ]
      );
    });
  });

  // filter

  describe('when we use the filter method', () => {
    it('should return a new channel that only receives the filtered data', async () => {
      const ch1 = chan();
      const ch2 = ch1.filter(v => v > 10);

      await exercise(
        Test(
          async function A(log) {
            log(`put1=${(await ch1.put(5)).toString()}`);
            log(`put2=${(await ch1.put(12)).toString()}`);
            log(`put3=${(await ch1.put(20)).toString()}`);
            log(`put4=${(await ch1.put(4)).toString()}`);
          },
          async function B(log) {
            ch2.take().then(v => log(`take1=${v}`));
            ch2.take().then(v => log(`take2=${v}`));
            ch2.take().then(v => log(`take3=${v}`)); // not happening
            ch2.take().then(v => log(`take4=${v}`)); // not happening
            await delay(5);
          }
        ),
        [
          '>A',
          '>B',
          'put1=true',
          'put2=true',
          'take1=12',
          'put3=true',
          'take2=20',
          'put4=true',
          '<A',
          '<B'
        ]
      );
    });
  });

  // map

  describe('when we use the map method', () => {
    it('should return a new channel that only receives the filtered data', async () => {
      const ch1 = chan();
      const ch2 = ch1.map(v => v * 2);

      await exercise(
        Test(
          async function A(log) {
            log(`put1=${(await ch1.put(5)).toString()}`);
            log(`put2=${(await ch1.put(12)).toString()}`);
            log(`put3=${(await ch1.put(20)).toString()}`);
            log(`put4=${(await ch1.put(4)).toString()}`);
          },
          async function B(log) {
            ch2.take().then(v => log(`take1=${v}`));
            ch2.take().then(v => log(`take2=${v}`));
            ch2.take().then(v => log(`take3=${v}`));
            ch2.take().then(v => log(`take4=${v}`));
            await delay(5);
          }
        ),
        [
          '>A',
          '>B',
          'put1=true',
          'take1=10',
          'put2=true',
          'take2=24',
          'put3=true',
          'take3=40',
          'put4=true',
          'take4=8',
          '<A',
          '<B'
        ]
      );
    });
  });
});
