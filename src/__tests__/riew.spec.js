/* eslint-disable quotes, max-len */
import riew from '../riew';
import { createState as state } from '../state';
import registry from '../registry';
import { delay } from '../__helpers__';

describe('Given the `riew` function', () => {
  beforeEach(() => registry.reset());
  describe('when we use a controller', () => {
    fit(`should
      * not run the view by default
      * run the controller once when the riew is mounted`, () => {
      const view = jest.fn();
      const controller = jest.fn();
      const r = riew(view, controller);

      r.mount();
      r.update({});
      r.update({});
      r.update({});

      expect(view).toBeCalledTimes(0);
      expect(controller).toBeCalledTimes(1);
    });
    it(`should
      * run the view every time when we call the render method
      * accumulate the props to the view`, () => {
      const view = jest.fn();
      const controller = ({ render }) => {
        render({ c: 'd' });
        render({ e: 'f' });
      };
      const r = riew(view, controller);

      r.mount({ a: 'b' });
      r.update({ g: 'h' }); // ignored at this point

      expect(view).toBeCalledTimes(2);
      expect(view.mock.calls[0]).toStrictEqual([ { a: 'b', c: 'd' } ]);
      expect(view.mock.calls[1]).toStrictEqual([ { a: 'b', c: 'd', e: 'f' } ]);
    });
    describe('and we want to handle the update of the riew (via the `input` prop)', () => {
      it(`should allow us to use all the riew state methods`, () => {
        const view = jest.fn();
        const controller = ({ input, render }) => {
          expect(input.get()).toStrictEqual({ x: 'y' });
          input.filter(props => 'stop' in props).pipe(input.teardown);
          input.filter(props => 'a' in props).map(({ a }) => ({ a: a.toUpperCase() })).pipe(render);
          input.filter(props => !('a' in props)).pipe(render);
        };
        const r = riew(view, controller);

        r.mount({ x: 'y' });
        r.update({ a: 'b' });
        r.update({ c: 'd' });
        r.update({ stop: true });
        r.update({ not: 'reachable' });

        expect(view).toBeCalledTimes(2);
        expect(view.mock.calls[0]).toStrictEqual([ { a: 'B', x: 'y' } ]);
        expect(view.mock.calls[1]).toStrictEqual([ { a: 'B', c: 'd', x: 'y' } ]);
      });
    });
    describe('and we want to run a clean up logic', () => {
      it('should run the result of the controller', () => {
        const cleanup = jest.fn();
        const controller = () => {
          return cleanup;
        };
        const r = riew(() => {}, controller);

        r.mount();
        r.unmount();

        expect(cleanup).toBeCalledTimes(1);
      });
      it('should run the result of the async controller', async () => {
        const cleanup = jest.fn();
        const controller = async () => {
          return cleanup;
        };
        const r = riew(() => {}, controller);

        r.mount();
        await delay(1);
        r.unmount();

        expect(cleanup).toBeCalledTimes(1);
      });
    });
  });
  describe('when we depend on the status of the riew', () => {
    it('should provide us with `isActive` function so we know what is the status', async () => {
      const controller = async ({ isActive }) => {
        expect(isActive()).toBe(true);
        await delay(5);
        expect(isActive()).toBe(false);
      };
      const r = riew(() => {}, controller);

      r.mount();
      expect(r.isActive()).toBe(true);
      r.unmount();
      await delay(7);
      expect(r.isActive()).toBe(false);
    });
  });
  describe('and when we use non object as initial props or for render method', () => {
    it('should throw an error', () => {
      expect(() => riew(() => {}).mount('foo')).toThrowError(
        `The riew's "in" method must be called with a key-value object. Instead "foo" passed`
      );
      expect(() => riew(() => {}, ({ render }) => { render('foo'); }, () => {}).mount()).toThrowError(
        `The riew's "render" method must be called with a key-value object. Instead "foo" passed`
      );
      expect(() => riew(() => {}, ({ render }) => { render('foo'); }, () => {}).mount()).toThrowError(
        `The riew's "render" method must be called with a key-value object. Instead "foo" passed`
      );
    });
  });
  describe('when we use `with` method', () => {
    describe('and we pass a state', () => {
      it(`should send the state to the controller`, () => {
        const spy = jest.fn();
        const s1 = state('a');
        const s2 = state('b');
        const controller = jest.fn().mockImplementation(({ s1, s2, render }) => {
          s1.mapToKey('s1').pipe(render);
          s2.mapToKey('s2').pipe(render);
          render({ s1: s1.get(), s2: s2.get() });
        });
        const r = riew(spy, controller).with({ s1, s2 });

        r.mount();
        s1.set('foo');
        s2.set('bar');

        expect(spy).toBeCalledTimes(3);
        expect(spy.mock.calls[0]).toStrictEqual([ { s1: 'a', s2: 'b' } ]);
        expect(spy.mock.calls[1]).toStrictEqual([ { s1: 'foo', s2: 'b' } ]);
        expect(spy.mock.calls[2]).toStrictEqual([ { s1: 'foo', s2: 'bar' } ]);
      });
    });
    describe('and when we pass something else', () => {
      it(`should pass the thing to the controller and view`, () => {
        const s = state({ firstName: 'John', lastName: 'Doe' });
        const getFirstName = s.map(({ firstName }) => firstName);
        const spy = jest.fn();
        const r = riew(
          spy,
          ({ getFirstName, render }) => {
            expect(getFirstName()).toBe('John');
            render();
          }
        ).with({ getFirstName });

        r.mount();

        expect(spy).toBeCalledTimes(1);
        expect(spy.mock.calls[0]).toStrictEqual([ { getFirstName: expect.any(Function) } ]);
      });
    });
    describe('when we want to use an exported into the registry state', () => {
      it('should recognize it and pass it down to the controller', () => {
        const s = state('foo');

        registry.add('xxx', s);

        const view = jest.fn();
        const controller = jest.fn().mockImplementation(({ render, xxx }) => {
          render({ value: xxx.get() });
        });
        const r = riew(view, controller).with('xxx');

        r.mount();

        expect(view).toBeCalledTimes(1);
        expect(view.mock.calls[0]).toStrictEqual([ { value: 'foo' } ]);
        expect(controller).toBeCalledTimes(1);
        expect(controller.mock.calls[0]).toStrictEqual([ expect.objectContaining({
          xxx: expect.objectContaining({ get: expect.any(Function) })
        }) ]);
      });
      describe('and when we have something else exported into the registry', () => {
        it('should pass it down as it is to the view and to the controller', () => {
          const something = { a: 'b' };

          registry.add('something', something);

          const view = jest.fn();
          const controller = jest.fn().mockImplementation(({ render }) => render());
          const r = riew(view, controller).with('something');

          r.mount();
          expect(view).toBeCalledTimes(1);
          expect(view.mock.calls[0]).toStrictEqual([ { something: { a: 'b' } } ]);
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
          ({ foo, bar, render }) => (foo(bar), render()),
        ).with({ foo: spy, bar: 10 });

        r.mount({});

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

        ra.mount({});
        rb.mount({});

        expect(spy).toBeCalledTimes(2);
        expect(spy.mock.calls[0]).toStrictEqual([ { foo: 'bar' } ]);
        expect(spy.mock.calls[1]).toStrictEqual([ { moo: 'noo' } ]);
      });
    });
  });
  describe('when we call the riew with just one argument', () => {
    it('should work just fine by providing a dummy controller', () => {
      const spy = jest.fn();
      const r = riew(spy);

      r.mount({ foo: 'bar' });

      expect(spy).toBeCalledTimes(1);
      expect(spy.mock.calls[0]).toStrictEqual([ { foo: 'bar' } ]);
    });
  });
  describe('when we want to test the riew', () => {
    it('should allow us to pass custom one-shot statesMap and keep the old riew working', () => {
      const s = state('foo');
      const spy = jest.fn();
      const controller = jest.fn().mockImplementation(({ s, render }) => (spy(s.get()), render({ s: s.get() })));
      const view = jest.fn();
      const r = riew(view, controller).with({ s });
      const rTest = r.test({ s: state('bar') });

      r.mount();
      rTest.mount();

      expect(controller).toBeCalledTimes(2);
      expect(controller.mock.calls[0]).toStrictEqual([
        expect.objectContaining({ s: expect.objectContaining({ get: expect.any(Function) }) })
      ]);
      expect(controller.mock.calls[1]).toStrictEqual([
        expect.objectContaining({ s: expect.objectContaining({ get: expect.any(Function) }) })
      ]);
      expect(spy).toBeCalledTimes(2);
      expect(spy.mock.calls[0]).toStrictEqual([ 'foo' ]);
      expect(spy.mock.calls[1]).toStrictEqual([ 'bar' ]);
      expect(view).toBeCalledTimes(2);
      expect(view.mock.calls[0]).toStrictEqual([ { s: 'foo' } ]);
      expect(view.mock.calls[1]).toStrictEqual([ { s: 'bar' } ]);
    });
  });
  describe('when we use the `state` method', () => {
    it(`should
      * teardown the state when the riew is unmounted
      * subscribe for state changes and re-render the view`, async () => {
      let ss;
      const externalState = state('boo');
      const view = jest.fn();
      const r = riew(view, async ({ state, render }) => {
        const s = ss = state('foo');

        s.stream.map(value => ({ bar: value })).pipe(render);
        setTimeout(() => {
          s.set('xxx');
        }, 5);
        render({ bar: s, boo: externalState });
      });

      r.mount();
      expect(ss.active()).toBe(true);
      await delay(7);
      r.unmount();

      expect(view).toBeCalledTimes(2);
      expect(view.mock.calls[0]).toStrictEqual([ { bar: 'foo', boo: 'boo' } ]);
      expect(view.mock.calls[1]).toStrictEqual([ { bar: 'xxx', boo: 'boo' } ]);
      expect(ss.active()).toBe(false);
    });
  });
});
