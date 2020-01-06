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
  describe('when we add middlewares', () => {
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
  });
  describe('when we use prepend', () => {
    it('should add a middleware in the beginning', done => {
      const p = pipeline();

      p.append((value, cb) => cb(value.toUpperCase()));
      p.prepend((value, cb) => cb('Ops!'));
      p.run('foo', result => {
        expect(result).toStrictEqual(['Ops!', 'FOO']);
        done();
      });
    });
  });
  describe('when we use PARALLEL strategy', () => {
    it('should run the middlewares in parallel', async () => {
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
  });
  describe('when we use ONE_OF strategy', () => {
    it('should fire the callback once some of the middleware is finished', async () => {
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
  });
});
