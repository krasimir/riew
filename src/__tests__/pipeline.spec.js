import pipeline from '../csp/pipeline';
import { delay } from '../__helpers__';
import { PARALLEL, ONE_OF } from '../index';

describe('Given the pipeline', () => {
  describe('when we run an empty pipeline', () => {
    it('should fire our callback with the given input', done => {
      const p = pipeline();
      const data = { foo: 'bar' };

      p.run(data, result => {
        expect(result).toStrictEqual(data);
        done();
      });
    });
  });

  // --------------------------------------------------------------- SERIAL
  describe('when we use SERIAL strategy', () => {
    it(`should
        * run all the middlewares one after each other
        * wait if some of the middlewares is async
        * fire the callback only once all the middleware are done`, done => {
      const p = pipeline();
      const A = jest.fn().mockImplementation((a, c) => c(a.toUpperCase()));
      const B = jest.fn().mockImplementation((a, c) => {
        setTimeout(() => {
          c(`${a}foo`);
        }, 20);
      });

      p.append(A);
      p.append(B);
      p.run('zoo', result => {
        expect(result).toStrictEqual(['ZOO', 'zoofoo']);
        expect(A).toBeCalledWithArgs(['zoo', expect.any(Function)]);
        expect(B).toBeCalledWithArgs(['zoo', expect.any(Function)]);
        done();
      });
    });
    describe('when we use prepend', () => {
      it('should add a step in the beginning', done => {
        const p = pipeline();

        p.append((value, cb) => cb(value.toUpperCase()));
        p.prepend((value, cb) => cb('Ops!'));
        p.run('foo', result => {
          expect(result).toStrictEqual(['Ops!', 'FOO']);
          done();
        });
      });
    });
    describe('when we use appendOnce and prependOnce', () => {
      it('should only append and prepend once', () => {
        const spy = jest.fn();
        const p = pipeline();
        p.append((item, callback) => {
          callback(item.toLowerCase());
        });
        p.appendOnce((item, callback) => {
          callback(item.toUpperCase());
        });
        p.prependOnce((item, callback) => {
          callback(`(${item})`);
        });

        p.run('fOObAR', spy);
        p.run('XxXxXx', spy);

        expect(spy).toBeCalledWithArgs(
          [['(fOObAR)', 'foobar', 'FOOBAR']],
          ['xxxxxx']
        );
      });
    });
    describe('when we append as part of another append', () => {
      it('should resolve properly the steps', () => {
        const spy = jest.fn();
        const p = pipeline();

        p.append((item, callback) => {
          p.append((it, cb) => {
            cb(it.toLowerCase());
          });
          callback(item.toUpperCase());
        });

        p.run('FooBar', spy);
        p.run('NoYes', spy);
        expect(spy).toBeCalledWithArgs(['FOOBAR'], [['NOYES', 'noyes']]);
      });
    });
  });

  // --------------------------------------------------------------- SERIAL
  describe('when we use PARALLEL strategy', () => {
    it('should run the steps in parallel', async () => {
      const spy = jest.fn();
      const p = pipeline(PARALLEL);
      const A = jest.fn().mockImplementation((a, c) => {
        setTimeout(() => {
          c(`${a}A`);
        }, 10);
      });
      const B = jest.fn().mockImplementation((a, c) => {
        setTimeout(() => {
          c(`${a}B`);
        }, 10);
      });
      p.append(A);
      p.append(B);
      p.run('foo', spy);

      await delay(15);
      expect(spy).toBeCalledWithArgs([['fooA', 'fooB']]);
    });
    describe('when we use appendOnce and prependOnce', () => {
      it('should only append and prepend once', () => {
        const spy = jest.fn();
        const p = pipeline(PARALLEL);
        p.append((item, callback) => {
          callback(item.toLowerCase());
        });
        p.appendOnce((item, callback) => {
          callback(item.toUpperCase());
        });
        p.prependOnce((item, callback) => {
          callback(`(${item})`);
        });

        p.run('fOObAR', spy);
        p.run('XxXxXx', spy);

        expect(spy).toBeCalledWithArgs(
          [['(fOObAR)', 'foobar', 'FOOBAR']],
          ['xxxxxx']
        );
      });
    });
    describe('when we append as part of another append', () => {
      it('should resolve properly the steps', () => {
        const spy = jest.fn();
        const p = pipeline(PARALLEL);

        p.append((item, callback) => {
          p.append((it, cb) => {
            cb(it.toLowerCase());
          });
          callback(item.toUpperCase());
        });

        p.run('FooBar', spy);
        p.run('NoYes', spy);
        expect(spy).toBeCalledWithArgs(['FOOBAR'], [['NOYES', 'noyes']]);
      });
    });
  });

  // --------------------------------------------------------------- ONE_OF
  describe('when we use ONE_OF strategy', () => {
    it('should fire the callback once some of the steps is finished', async () => {
      const spy = jest.fn();
      const p = pipeline(ONE_OF);
      const A = jest.fn().mockImplementation((a, c) => {
        setTimeout(() => {
          c(`${a}A`);
        }, 5);
      });
      const B = jest.fn().mockImplementation((a, c) => {
        setTimeout(() => {
          c(`${a}B`);
        }, 10);
      });
      p.append(A);
      p.append(B);
      p.run('foo', spy);

      await delay(15);
      expect(spy).toBeCalledWithArgs(['fooA', 0], ['fooB', 1]);
    });
    describe('when we use appendOnce and prependOnce', () => {
      it('should only append and prepend once', () => {
        const spy = jest.fn();
        const p = pipeline(ONE_OF);
        p.append((item, callback) => {
          callback(item.toLowerCase());
        });
        p.appendOnce((item, callback) => {
          callback(item.toUpperCase());
        });
        p.prependOnce((item, callback) => {
          callback(`(${item})`);
        });

        p.run('fOObAR', spy);
        p.run('XxXxXx', spy);

        expect(spy).toBeCalledWithArgs(
          ['(fOObAR)', 0],
          ['foobar', 1],
          ['FOOBAR', 2],
          ['xxxxxx', 0]
        );
      });
    });
    describe('when we append as part of another append', () => {
      it('should resolve properly the steps', () => {
        const spy = jest.fn();
        const p = pipeline(ONE_OF);

        p.append((item, callback) => {
          p.append((it, cb) => {
            cb(it.toLowerCase());
          });
          callback(item.toUpperCase());
        });

        p.run('FooBar', spy);
        p.run('NoYes', spy);
        expect(spy).toBeCalledWithArgs(
          ['FOOBAR', 0],
          ['NOYES', 0],
          ['noyes', 1]
        );
      });
    });
  });

  describe('when we want to remove a step', () => {
    it('should provide us with an API for removing the step', () => {
      const spy = jest.fn();
      const p = pipeline();
      const remove = p.append((item, callback) => {
        callback(item.toUpperCase());
      });
      p.append((item, callback) => {
        callback(item.toLowerCase());
      });
      const remove2 = p.prepend((item, callback) => {
        callback(`(${item})`);
      });

      p.run('fOObAR', result => {
        spy(result);
      });
      remove();
      remove2();
      p.run('XxXxXx', result => {
        spy(result);
      });

      expect(spy).toBeCalledWithArgs(
        [['(fOObAR)', 'FOOBAR', 'foobar']],
        ['xxxxxx']
      );
    });
  });
});
