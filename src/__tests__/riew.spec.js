/* eslint-disable quotes, max-len */
import riew from '../riew';
import { createState as state } from '../state';
import registry from '../registry';

describe('Given the `riew` function', () => {
  beforeEach(() => registry.reset());
  describe('when we create a riew', () => {
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
      const instance = riew(viewSpy, controllerSpy);

      instance.in({});

      expect(instance.isActive()).toBe(true);
      expect(viewSpy).toBeCalledTimes(1);
      expect(viewSpy.mock.calls[0]).toStrictEqual([{ foo: 'bar' }, expect.any(Function)]);
    });
    it('should allow us to wait till the render is done', (done) => {
      const controller = async ({ render }) => {
        await render({});
        done();
      };
      const c = riew((props, done) => done(), controller);

      c.in({});
    });
    describe('and when we use non object as initial props or for render method', () => {
      it('should throw an error', () => {
        expect(() => riew(() => {}).in('foo')).toThrowError(
          `The riew's "in" method must be called with a key-value object. Instead "foo" passed`
        );
        expect(() => riew(() => {}, ({ render }) => { render('foo'); }, () => {}).in()).toThrowError(
          `The riew's "render" method must be called with a key-value object. Instead "foo" passed`
        );
        expect(() => riew(() => {}, ({ render }) => { render('foo'); }, () => {}).in()).toThrowError(
          `The riew's "render" method must be called with a key-value object. Instead "foo" passed`
        );
      });
    });
    describe('and when we call the out method', () => {
      it('should mark the instance as not active', () => {
        const c = riew(() => {});

        c.in({});
        expect(c.isActive()).toBe(true);
        c.out();
        expect(c.isActive()).toBe(false);
      });
    });
    it('should set view props if we return something from the controller', () => {
      const controller = () => ({ foo: 'bar' });
      const view = jest.fn();
      const r = riew(view, controller);

      r.in({});
      expect(view).toBeCalledTimes(1);
      expect(view.mock.calls[0]).toStrictEqual([ { foo: 'bar' }, expect.any(Function) ]);
    });
    it('should proxy riew props to the view and call the view every time when the riew is updated', () => {
      const view = jest.fn();
      const r = riew(view);

      r.in({ a: 'b' });
      r.update({ a: 'c' });

      expect(view).toBeCalledTimes(2);
      expect(view.mock.calls[0]).toStrictEqual([ { a: 'b' }, expect.any(Function) ]);
      expect(view.mock.calls[1]).toStrictEqual([ { a: 'c' }, expect.any(Function) ]);
    });
    it('should allow us to overwrite props passed from the outside to the riew', () => {
      const view = jest.fn();
      const controller = ({ props }) => {
        props((newProps) => {
          return { a: newProps.a.toUpperCase() };
        });
      };
      const r = riew(view, controller);

      r.in({ a: 'b' });
      r.update({ a: 'c' });

      expect(view).toBeCalledTimes(2);
      expect(view.mock.calls[0]).toStrictEqual([ { a: 'B' }, expect.any(Function) ]);
      expect(view.mock.calls[1]).toStrictEqual([ { a: 'C' }, expect.any(Function) ]);
    });
  });
  describe('when we use props', () => {
    it('should fire our props func initially once and on every update', () => {
      const propsSpy = jest.fn().mockImplementation((props) => props);
      const viewSpy = jest.fn();
      const c = riew(viewSpy, ({ props }) => {
        props(propsSpy);
      });

      c.in({ a: 'b' });
      c.update({ c: 'd' });

      expect(propsSpy).toBeCalledTimes(2);
      expect(propsSpy.mock.calls[0]).toStrictEqual([{ a: 'b' }]);
      expect(propsSpy.mock.calls[1]).toStrictEqual([{ c: 'd' }]);
      expect(viewSpy).toBeCalledTimes(2);
      expect(viewSpy.mock.calls[0]).toStrictEqual([{ a: 'b' }, expect.any(Function)]);
      expect(viewSpy.mock.calls[1]).toStrictEqual([{ c: 'd' }, expect.any(Function)]);
    });
    describe('and we map the props to something else', () => {
      it('should send proper values to the view', () => {
        const view = jest.fn();
        const propsSpy = jest.fn().mockImplementation((props) => ({ value: props.value * 2 }));
        const r = riew(
          view,
          ({ props }) => {
            props(propsSpy);
          }
        );

        r.in({ value: 10 });
        r.update({ value: 3 });

        expect(view).toBeCalledTimes(2);
        expect(view.mock.calls[0]).toStrictEqual([ { value: 20 }, expect.any(Function) ]);
        expect(view.mock.calls[1]).toStrictEqual([ { value: 6 }, expect.any(Function) ]);
        expect(propsSpy).toBeCalledTimes(2);
        expect(propsSpy.mock.calls[0]).toStrictEqual([ { value: 10 } ]);
        expect(propsSpy.mock.calls[1]).toStrictEqual([ { value: 3 } ]);
      });
    });
    it('should proxy whatever props we receive if our callback returns non-object-literal', () => {
      const propsSpy = jest.fn();
      const viewSpy = jest.fn();
      const c = riew(viewSpy, ({ props }) => props(propsSpy));

      c.in({ a: 'b' });
      c.update({ c: 'd' });

      expect(propsSpy).toBeCalledTimes(2);
      expect(propsSpy.mock.calls[0]).toStrictEqual([{ a: 'b' }]);
      expect(propsSpy.mock.calls[1]).toStrictEqual([{ c: 'd' }]);
      expect(viewSpy).toBeCalledTimes(2);
      expect(viewSpy.mock.calls[0]).toStrictEqual([{ a: 'b' }, expect.any(Function)]);
      expect(viewSpy.mock.calls[1]).toStrictEqual([{ c: 'd' }, expect.any(Function)]);
    });
  });
  describe('when we use `with` method', () => {
    describe('and we pass a state', () => {
      it(`should
        * send the state to the controller and its value to the view
        * re-render if we update the states (if any)`, () => {
        const spy = jest.fn();
        const s1 = state('foo');
        const s2 = state('moo');
        const controller = jest.fn().mockImplementation(({ s1, s2 }) => {
          s1.set('bar');
          s2.set('noo');
        });
        const r = riew(spy, controller).with({ s1, s2 });

        r.in({});
        s2.set('hoo');

        expect(spy).toBeCalledTimes(2);
        expect(spy.mock.calls[0]).toStrictEqual([ { s1: 'bar', s2: 'noo' }, expect.any(Function) ]);
        expect(spy.mock.calls[0]).toStrictEqual([ { s1: 'bar', s2: 'noo' }, expect.any(Function) ]);
      });
    });
    describe('and when we pass a trigger', () => {
      it(`should
          * run the trigger and pass down the value to the view
          * subscribe to the state and trigger the view on update`, () => {
        const s = state({ firstName: 'John', lastName: 'Doe' });
        const getFirstName = s.map(({ firstName }) => firstName);
        const spy = jest.fn();
        const r = riew(
          spy,
          ({ firstName }) => {
            expect(firstName).toBeDefined();
          }
        ).with({ firstName: getFirstName });

        r.in({});
        s.set({ firstName: 'Steve', lastName: 'Martin' });

        expect(spy).toBeCalledTimes(2);
        expect(spy.mock.calls[0]).toStrictEqual([ { firstName: 'John' }, expect.any(Function) ]);
        expect(spy.mock.calls[1]).toStrictEqual([ { firstName: 'Steve' }, expect.any(Function) ]);
      });
      it('should not call the view if the riew is not active', () => {
        const s = state({ firstName: 'John', lastName: 'Doe' });
        const getFirstName = s.map(({ firstName }) => firstName);
        const spy = jest.fn();
        const r = riew(spy).with({ getFirstName });

        r.in({});
        r.out();
        s.set({ firstName: 'Steve', lastName: 'Martin' });

        expect(spy).toBeCalledTimes(1);
        expect(spy.mock.calls[0]).toStrictEqual([ { getFirstName: 'John' }, expect.any(Function) ]);
      });
      it('should not subscribe for state changes if we pass a trigger that mutates the state', () => {
        const view = jest.fn();
        const s = state({ firstName: 'John', lastName: 'Doe' });
        const changeFirstName = s.mutate((name, newName) => ({ firstName: newName, lastName: name.lastName }));
        const r = riew(view).with({ changeFirstName });
        const warn = jest.spyOn(global.console, 'warn').mockImplementation(() => {});

        r.in();
        s.set({ firstName: 'Steve', lastName: 'Martin' });

        expect(view).toBeCalledTimes(1);
        expect(view.mock.calls[0]).toStrictEqual([ {}, expect.any(Function) ]);
        expect(warn).toBeCalledTimes(1);
        expect(warn).toBeCalledWith(expect.any(String));
        warn.mockRestore();
      });
    });
    describe('when we want to use an exported into the registry state', () => {
      it('should recognize it and pass it down to the view and controller + subscribe to it', () => {
        const s = state('foo');

        registry.add('xxx', s);

        const view = jest.fn();
        const controller = jest.fn();
        const r = riew(view, controller).with('xxx');

        r.in();
        s.set('bar');

        expect(view).toBeCalledTimes(2);
        expect(view.mock.calls[0]).toStrictEqual([ { xxx: 'foo' }, expect.any(Function) ]);
        expect(view.mock.calls[1]).toStrictEqual([ { xxx: 'bar' }, expect.any(Function) ]);
        expect(controller).toBeCalledTimes(1);
        expect(controller.mock.calls[0]).toStrictEqual([ expect.objectContaining({
          xxx: expect.objectContaining({ __riew: true })
        }) ]);
      });
      describe('and when we have something else exported into the registry', () => {
        it('should pass it down as it is to the view and to the controller', () => {
          const something = { a: 'b' };

          registry.add('something', something);

          const view = jest.fn();
          const controller = jest.fn();
          const r = riew(view, controller).with('something');

          r.in({ foo: 'bar' });
          expect(view).toBeCalledTimes(1);
          expect(view.mock.calls[0]).toStrictEqual([
            { foo: 'bar', something: { a: 'b' } },
            expect.any(Function)
          ]);
          expect(controller).toBeCalledTimes(1);
          expect(controller.mock.calls[0]).toStrictEqual([
            expect.objectContaining({ something: { a: 'b' } })
          ]);
        });
      });
    });
    describe('and when we pass primitive values', () => {
      it('should just proxy them to the controller and view', () => {
        const spy = jest.fn();
        const r = riew(
          ({ foo, bar }) => foo(bar + 10),
          ({ foo, bar }) => foo(bar),
        ).with({ foo: spy, bar: 10 });

        r.in({});

        expect(spy).toBeCalledTimes(2);
        expect(spy.mock.calls[0]).toStrictEqual([ 10 ]);
        expect(spy.mock.calls[1]).toStrictEqual([ 20 ]);
      });
    });
    describe('and when we use same instance with different externals', () => {
      it('should keep the externals and instances different', () => {
        const spy = jest.fn();
        const r = riew(spy);
        const ra = r.with({ foo: 'bar' });
        const rb = r.with({ moo: 'noo' });

        ra.in({});
        rb.in({});

        expect(spy).toBeCalledTimes(2);
        expect(spy.mock.calls[0]).toStrictEqual([ { foo: 'bar' }, expect.any(Function) ]);
        expect(spy.mock.calls[1]).toStrictEqual([ { moo: 'noo' }, expect.any(Function) ]);
      });
    });
  });
  describe('when we call the riew with just one argument', () => {
    it('should work just fine by providing a dummy controller', () => {
      const spy = jest.fn();
      const r = riew(spy);

      r.in({ foo: 'bar' });

      expect(spy).toBeCalledTimes(1);
      expect(spy.mock.calls[0]).toStrictEqual([ { foo: 'bar' }, expect.any(Function) ]);
    });
  });
  describe('when we want to test the riew', () => {
    it('should allow us to pass custom one-shot statesMap and keep the old riew working', () => {
      const s = state('foo');
      const spy = jest.fn();
      const controller = jest.fn().mockImplementation(({ s }) => spy(s.get()));
      const view = jest.fn();
      const r = riew(view, controller).with({ s });
      const rTest = r.test({ s: state('bar') });

      r.in({});
      rTest.in({});

      expect(controller).toBeCalledTimes(2);
      expect(controller.mock.calls[0]).toStrictEqual([
        expect.objectContaining({ s: expect.objectContaining({ __riew: true }) })
      ]);
      expect(controller.mock.calls[1]).toStrictEqual([
        expect.objectContaining({ s: expect.objectContaining({ __riew: true }) })
      ]);
      expect(spy).toBeCalledTimes(2);
      expect(spy.mock.calls[0]).toStrictEqual([ 'foo' ]);
      expect(spy.mock.calls[1]).toStrictEqual([ 'bar' ]);
      expect(view).toBeCalledTimes(2);
      expect(view.mock.calls[0]).toStrictEqual([ { s: 'foo' }, expect.any(Function) ]);
      expect(view.mock.calls[1]).toStrictEqual([ { s: 'bar' }, expect.any(Function) ]);
    });
  });
  describe('when we use the `state` method', () => {
    it('should create a state which gets teardown when the view is unmounted', () => {
      let ss;
      const view = jest.fn();
      const r = riew(view, ({ state, render }) => {
        const s = ss = state('foo');

        return {
          bar: s.get()
        };
      });

      r.in();
      expect(ss.active()).toBe(true);
      r.out();

      expect(view).toBeCalledTimes(1);
      expect(view.mock.calls[0]).toStrictEqual([ { bar: 'foo' }, expect.any(Function) ]);
      expect(ss.active()).toBe(false);
    });
  });
});
