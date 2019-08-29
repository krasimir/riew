/* eslint-disable quotes */
import routine from '../routine';
import { delay } from '../__helpers__';
import { createState as state } from '../state';

describe('Given the `routine` function', () => {
  describe('when we create a routine', () => {
    it(`should
      * set the instance to active
      * run the controller function
      * pass render function to the controller function
      * pass util methods to the controller function (isActive)
      * call the view function at least once and on every "render" call`, () => {
      const controllerSpy = jest.fn().mockImplementation(({ render, isActive }) => {
        expect(isActive()).toBe(true);
        render({ foo: 'bar' });
      });
      const viewSpy = jest.fn();
      const instance = routine(controllerSpy, viewSpy);

      instance.in({ not: 'used at all' });

      expect(instance.isActive()).toBe(true);
      expect(viewSpy).toBeCalledTimes(1);
      expect(viewSpy.mock.calls[0]).toStrictEqual([{ foo: 'bar' }, expect.any(Function)]);
    });
    it('should allow us to wait till the render is done', (done) => {
      const controller = async ({ render }) => {
        await render({});
        done();
      };
      const c = routine(controller, (props, done) => done());

      c.in({});
    });
    describe('and when we use non object as initial props or for render method', () => {
      it('should throw an error', () => {
        expect(() => routine(() => {}).in('foo')).toThrowError(
          `The routine's "in" method must be called with a key-value object. Instead "foo" passed`
        );
        expect(() => routine(({ render }) => { render('foo'); }, () => {}).in()).toThrowError(
          `The routine's "render" method must be called with a key-value object. Instead "foo" passed`
        );
        expect(() => routine(({ render }) => { render('foo'); }, () => {}).in()).toThrowError(
          `The routine's "render" method must be called with a key-value object. Instead "foo" passed`
        );
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
    it('should update view props if we return something from the controller', () => {
      const controller = () => ({ foo: 'bar' });
      const view = jest.fn();
      const r = routine(controller, view);

      r.in({});
      expect(view).toBeCalledTimes(1);
      expect(view.mock.calls[0]).toStrictEqual([ { foo: 'bar' }, expect.any(Function) ]);
    });
  });
  describe('when we use props', () => {
    it('should allow us to react on props changes', () => {
      const propsSpy = jest.fn();
      const viewSpy = jest.fn();
      const c = routine(({ props }) => {
        expect(props.get()).toStrictEqual({ a: 'b' });
        props.stream.pipe(propsSpy);
      }, viewSpy);

      c.in({ a: 'b' });
      c.update({ c: 'd' });

      expect(propsSpy).toBeCalledTimes(2);
      expect(propsSpy.mock.calls[0]).toStrictEqual([{ a: 'b' }]);
      expect(propsSpy.mock.calls[1]).toStrictEqual([{ a: 'b', 'c': 'd' }]);
      expect(viewSpy).toBeCalledTimes(1);
      expect(viewSpy.mock.calls[0]).toStrictEqual([{}, expect.any(Function)]);
    });
    describe('and we subscribe for updates and call the render', () => {
      it('should not end up in a endless loop', () => {
        const spy = jest.fn();
        const propsSpy = jest.fn();
        const r = routine(
          ({ props, render }) => {
            props.stream.pipe(({ value }) => {
              propsSpy(value);
              render({ foo: value });
            });
          },
          spy
        );

        r.in({ value: 'bar' });
        r.update({ value: 'moo' });

        expect(spy).toBeCalledTimes(2);
        expect(spy.mock.calls[0]).toStrictEqual([ { foo: 'bar' }, expect.any(Function) ]);
        expect(spy.mock.calls[1]).toStrictEqual([ { foo: 'moo' }, expect.any(Function) ]);
        expect(propsSpy).toBeCalledTimes(2);
        expect(propsSpy.mock.calls[0]).toStrictEqual([ 'bar' ]);
        expect(propsSpy.mock.calls[1]).toStrictEqual([ 'moo' ]);
      });
    });
  });
  describe('when we use `withState` method', () => {
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
      ).withState({ s1: 'foo', s2: 'moo' });

      r.in({});

      let s1 = r.__states().s1;
      let s2 = r.__states().s2;

      expect(spy).toBeCalledTimes(1);
      expect(spy.mock.calls[0]).toStrictEqual([ { s1: 'bar', s2: 'noo' }, expect.any(Function) ]);
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
        ).withState({ s1: 'foo', s2: 'moo' }).in();

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
        }, spy).withState({ s: alreadyCreated }).in();

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
    describe('and when we pass a queue function', () => {
      it(`should
        * pass down the function
        * figure out the state and subscribe to it`, () => {
        const s = state({ firstName: 'John', lastName: 'Doe' });
        const getFirstName = s.map(({ firstName }) => firstName);
        const spy = jest.fn();
        const spy2 = jest.fn();
        const r = routine(
          ({ firstName }) => {
            spy(firstName.map(value => value.toUpperCase())());
          },
          ({ firstName }) => {
            spy2(firstName());
          }
        ).withState({ firstName: getFirstName });

        r.in({});
        s.set({ firstName: 'Steve', lastName: 'Martin' });

        expect(spy).toBeCalledTimes(1);
        expect(spy.mock.calls[0]).toStrictEqual([ 'JOHN' ]);
        expect(spy2).toBeCalledTimes(2);
        expect(spy2.mock.calls[0]).toStrictEqual([ 'John' ]);
        expect(spy2.mock.calls[1]).toStrictEqual([ 'Steve' ]);
      });
      it('should not trigger the view if the routine is not active', () => {
        const s = state({ firstName: 'John', lastName: 'Doe' });
        const getFirstName = s.map(({ firstName }) => firstName);
        const spy = jest.fn();
        const r = routine(spy).withState({ getFirstName });

        r.in({});
        r.out();
        s.set({ firstName: 'Steve', lastName: 'Martin' });

        expect(spy).toBeCalledTimes(1);
        expect(spy.mock.calls[0]).toStrictEqual([ { getFirstName: expect.any(Function) }, expect.any(Function) ]);
      });
    });
  });
  describe('when we call the routine with just one argument', () => {
    it('should assume that this argument is the view function', () => {
      const spy = jest.fn();
      const r = routine(spy).withState({ foo: 'bar' });

      r.in({});

      expect(spy).toBeCalledTimes(1);
      expect(spy.mock.calls[0]).toStrictEqual([ { foo: 'bar' }, expect.any(Function) ]);
    });
  });
});
