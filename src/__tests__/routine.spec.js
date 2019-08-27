import routine from '../routine';
import { delay } from '../__helpers__';
import { createState as state } from '../state';

describe('Given the `routine` function', () => {
  describe('when we create a routine instance', () => {
    it(`should
      * set the instance to active
      * run the controller function
      * pass render function to the controller function
      * pass util methods to the controller function (isActive)
      * call the view function at least once and on every render call`, () => {
      const controllerSpy = jest.fn().mockImplementation(({ render, isActive }) => {
        expect(isActive()).toBe(true);
        render({ foo: 'bar' });
      });
      const viewSpy = jest.fn();
      const instance = routine(controllerSpy, viewSpy);

      instance.in({ moo: 'noo' });

      expect(instance.isActive()).toBe(true);
      expect(viewSpy).toBeCalledTimes(2);
      expect(viewSpy.mock.calls[0]).toStrictEqual([{ moo: 'noo' }, expect.any(Function)]);
      expect(viewSpy.mock.calls[1]).toStrictEqual([{ foo: 'bar' }, expect.any(Function)]);
    });
    it('should allow us to wait till the render is done', (done) => {
      const controller = async ({ render }) => {
        await render(null);
        done();
      };
      const c = routine(controller, (props, done) => done());

      c.in({});
    });
    it('should be transparent about what we are passing to the view function', () => {
      const spy = jest.fn();
      const c = routine(async ({ render }) => {
        render('banana');
      }, spy);

      c.in('lemon');

      expect(spy).toBeCalledTimes(2);
      expect(spy.mock.calls[0]).toStrictEqual(['lemon', expect.any(Function)]);
      expect(spy.mock.calls[1]).toStrictEqual(['banana', expect.any(Function)]);
    });
    describe('when we update the routine from the outside', () => {
      it('should allow us to react on those changes', () => {
        const propsSpy = jest.fn();
        const c = routine(({ props }) => {
          props.stream.pipe(propsSpy);
          propsSpy(props.get());
        });

        c.in({ a: 'b' });
        c.set({ c: 'd' });

        expect(propsSpy).toBeCalledTimes(2);
        expect(propsSpy.mock.calls[0]).toStrictEqual([{ a: 'b' }]);
        expect(propsSpy.mock.calls[1]).toStrictEqual([{ c: 'd' }]);
      });
    });
    describe('and when we call the out method', () => {
      it('should mark the instance as not active', () => {
        const c = routine(() => {});

        c.in({});
        expect(c.isActive()).toBe(true);
        c.out();
        expect(c.isActive()).toBe(false);
      });
    });
    describe('and we use non object as initial props', () => {
      xit('should throw an error', () => {

      });
    });
  });
  describe.only('when we use `withProps` method', () => {
    it(`should
      * create a states from the given object
      * render with the created states as props
      * re-render if we update the states
      * teardown the created states when we call "out" method`, () => {
      const spy = jest.fn();
      const r = routine(
        ({ s1, s2 }) => {
          s1.set('bar');
          s2.set('noo');
        },
        spy
      ).withProps({ s1: 'foo', s2: 'moo' });

      r.in({ a: 'b' });

      let s1 = r.__states().s1;
      let s2 = r.__states().s2;

      expect(spy).toBeCalledTimes(1);
      expect(spy.mock.calls[0]).toStrictEqual([ { a: 'b', s1: 'bar', s2: 'noo' }, expect.any(Function) ]);
      expect(s1.active()).toBe(true);
      expect(s2.active()).toBe(true);
      r.out();
      expect(r.__states()).toBe(null);
      expect(s1.active()).toBe(false);
      expect(s2.active()).toBe(false);
    });
    describe('and when we update the created states async', () => {
      it('should trigger re-render', async () => {
        const spy = jest.fn();

        routine(
          async ({ s1, s2 }) => {
            await delay(5);
            s1.set('bar');
            s2.set('noo');
          },
          spy
        ).withProps({ s1: 'foo', s2: 'moo' }).in();

        await delay(7);

        expect(spy).toBeCalledTimes(3);
        expect(spy.mock.calls[0]).toStrictEqual([ { s1: 'foo', s2: 'moo' }, expect.any(Function) ]);
        expect(spy.mock.calls[1]).toStrictEqual([ { s1: 'bar', s2: 'moo' }, expect.any(Function) ]);
        expect(spy.mock.calls[2]).toStrictEqual([ { s1: 'bar', s2: 'noo' }, expect.any(Function) ]);
      });
    });
    describe('and when we pass an already created state', () => {
      it(`should 
        * use the already created one
        * should NOT teardown the already created one`, async () => {
        const spy = jest.fn();
        const alreadyCreated = state('foo');
        const r = routine(async ({ s }) => {
          await delay(5);
          s.set('bar');
        }, spy).withProps({ s: alreadyCreated }).in();

        expect(r.__states().s).toBe(alreadyCreated);

        await delay(7);
        r.out();

        expect(spy).toBeCalledTimes(2);
        expect(spy.mock.calls[0]).toStrictEqual([ { s: 'foo' }, expect.any(Function) ]);
        expect(spy.mock.calls[1]).toStrictEqual([ { s: 'bar' }, expect.any(Function) ]);
        expect(alreadyCreated.active()).toBe(true);
        expect(r.__states()).toBe(null);
      });
    });
  });
});
