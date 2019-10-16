/* eslint-disable quotes, max-len */
import { delay } from '../__helpers__';
import { state, register, riew, reset, subscribe } from '../index';

describe('Given the `riew` factory function', () => {
  beforeEach(() => {
    reset();
  });
  describe('when we create and mount riew with a given view and list of side effects', () => {
    it(`should
      * call the view with the initial props
      * call each of the side effects
      * run the clean-up functions of each side effect`, () => {
      const view = jest.fn();
      const se1Cleanup = jest.fn();
      const se1 = jest.fn().mockImplementation(() => se1Cleanup);
      const se2Cleanup = jest.fn();
      const se2 = jest.fn().mockImplementation(() => se2Cleanup);

      const r = riew(view, se1, se2);

      r.mount({ foo: 'bar' });
      r.unmount();

      expect(view).toBeCalledWithArgs(
        [ { foo: 'bar' } ]
      );
      expect(se1).toBeCalledWithArgs(
        [ expect.objectContaining({ render: expect.any(Function) }) ]
      );
      expect(se2).toBeCalledWithArgs(
        [ expect.objectContaining({ render: expect.any(Function) }) ]
      );
    });
  });
  describe('when we have an async side effect', () => {
    it('should render the view without waiting the side effect to finish', async () => {
      const view = jest.fn();
      const se = async function ({ render }) {
        await delay(3);
        render({ hello: 'there' });
      };
      const r = riew(view, se);

      r.mount({ a: 'b' });

      await delay(4);
      expect(view).toBeCalledWithArgs(
        [ { a: 'b' } ],
        [ { a: 'b', hello: 'there' } ]
      );
    });
  });
  describe('when we create a state in the controller', () => {
    it('should teardown the state if the riew is unmounted', () => {
      let ss;
      const view = jest.fn();
      const controller = function ({ state, render }) {
        const [ s, set ] = state('foo');

        render({ s });
        ss = set;
        set('bar');
      };
      const r = riew(view, controller);

      r.mount();
      r.unmount();
      ss('moo');
      ss('boo');
      expect(view).toBeCalledWithArgs([ { s: 'bar' } ]);
    });
    it('should send the state value to the view', () => {
      const view = jest.fn();
      const se = function ({ state, render }) {
        render({ s: state('foo') });
      };
      const r = riew(view, se);

      r.mount();
      expect(view).toBeCalledWithArgs([ { s: 'foo' } ]);
    });
    it('should subscribe (only once) for the changes in the state and re-render the view', async () => {
      const view = jest.fn();
      const se = async function ({ state, render }) {
        const [ s, setState ] = state('foo');

        render({ s });
        render({ s });
        render({ s });
        await delay(3);
        setState('bar');
      };
      const r = riew(view, se);

      r.mount();
      await delay(4);
      expect(view).toBeCalledWithArgs(
        [ { s: 'foo' } ],
        [ { s: 'bar' } ]
      );
    });
    describe('when we have multiple effects produced by the same state', () => {
      it('should still subscribe all of them', async () => {
        const view = jest.fn();
        const controller = async function ({ state, render }) {
          const message = state('Hello World');
          const up = message.map(value => value.toUpperCase());
          const lower = message.map(value => value.toLowerCase());
          const update = message.mutate(() => 'Chao');

          render({ up, lower });
          await delay(3);
          update();
          await delay(1);
          render({ a: 10 });
        };
        const r = riew(view, controller);

        r.mount();
        await delay(10);
        expect(view).toBeCalledWithArgs(
          [ { up: 'HELLO WORLD', lower: 'hello world' } ],
          [ { up: 'CHAO', lower: 'chao' } ],
          [ { up: 'CHAO', lower: 'chao', a: 10 } ]
        );
      });
    });
    it('should unsubscribe the effects if we unmount', async () => {
      const view = jest.fn();
      const spy = jest.fn();
      const controller = async function ({ state, render }) {
        const message = state('Hello World');
        const up = message.map(value => value.toUpperCase()).pipe(spy);
        const lower = message.map(value => value.toLowerCase()).pipe(spy);
        const update = message.mutate(() => 'Chao');

        render({ up, lower });
        await delay(3);
        update();
      };
      const r = riew(view, controller);

      r.mount();
      r.unmount();
      await delay(10);
      expect(view).toBeCalledWithArgs(
        [ { up: 'HELLO WORLD', lower: 'hello world' } ]
      );
      expect(spy).toBeCalledWithArgs(
        [ 'HELLO WORLD' ],
        [ 'hello world' ]
      );
    });
  });
  describe('when we send an external state(effect) to the view and the view is unmounted', () => {
    it(`should
      * initially subscribe and then unsubscribe
      * keep the external subscriptions`, () => {
      const spy = jest.fn();
      const [ s, setState ] = state('foo');
      const external = s.pipe(spy);
      const view = jest.fn();
      const controller = function ({ render }) {
        render({ s });
      };
      const r = riew(view, controller);

      subscribe(external, true);

      r.mount();
      setState('baz');
      r.unmount();
      setState('zoo');
      expect(view).toBeCalledWithArgs(
        [ { s: 'foo' } ],
        [ { s: 'baz' } ]
      );
      expect(spy).toBeCalledWithArgs(
        [ 'foo' ],
        [ 'baz' ],
        [ 'zoo' ]
      );
    });
  });
  describe('when we send a effect to the view', () => {
    it(`should
      * run the effect and pass the value if the effect is not mutating
      * subscribe to state changes if the effect is not mutating`, () => {
      const view = jest.fn().mockImplementation(({ s, change }) => {
        if (s !== 'BAR') {
          change();
        }
      });
      const se = function ({ render, state }) {
        const s = state('foo');
        const up = s.map(value => value.toUpperCase());
        const change = s.mutate(() => 'bar');

        render({ s: up, change });
        render({ s: up, change });
        render({ s: up, change });
      };
      const r = riew(view, se);

      r.mount();
      expect(view).toBeCalledWithArgs(
        [ { s: 'FOO', change: expect.any(Function) } ],
        [ { s: 'BAR', change: expect.any(Function) } ]
      );
    });
  });
  describe('when we send a getter or a setter to the view', () => {
    it(`should
      * run the getter and pass the value + also subscribe to state changes
      * pass down the setter`, () => {
      const view = jest.fn().mockImplementation(({ s, change }) => {
        if (s !== 'bar') {
          change('bar');
        }
      });
      const se = function ({ render, state }) {
        const [ getter, setter ] = state('foo');

        render({ s: getter, change: setter });
        render({ s: getter, change: setter });
        render({ s: getter, change: setter });
      };
      const r = riew(view, se);

      r.mount();
      expect(view).toBeCalledWithArgs(
        [ { s: 'foo', change: expect.any(Function) } ],
        [ { s: 'bar', change: expect.any(Function) } ]
      );
    });
  });
  describe('when we update the riew', () => {
    it('should render the view with accumulated props', () => {
      const view = jest.fn();
      const r = riew(view);

      r.mount({ foo: 'bar' });
      r.update({ baz: 'moo' });
      r.update({ x: 'y' });

      expect(view).toBeCalledWithArgs(
        [{ foo: 'bar' }],
        [{ foo: 'bar', baz: 'moo' }],
        [{ foo: 'bar', baz: 'moo', x: 'y' }]
      );
    });
    it('should deliver the riew input to the controller', () => {
      const spy = jest.fn();
      const controller = function ({ props }) {
        subscribe(props.pipe(spy), true);
      };
      const r = riew(() => {}, controller);

      r.mount({ foo: 'bar' });
      r.update({ baz: 'moo' });
      expect(spy).toBeCalledWithArgs(
        [{ foo: 'bar' }],
        [{ baz: 'moo' }]
      );
    });
  });
  describe('when we depend on the status of the riew', () => {
    it('should provide us with `isActive` function so we know what is the status', async () => {
      const effect = async ({ isActive }) => {
        expect(isActive()).toBe(false);
        await delay(1);
        expect(isActive()).toBe(true);
        await delay(10);
        expect(isActive()).toBe(false);
      };
      const r = riew(() => {}, effect);

      r.mount();
      expect(r.isActive()).toBe(true);
      await delay(5);
      r.unmount();
      await delay(20);
      expect(r.isActive()).toBe(false);
    });
  });
  describe('and when we use non object as initial props or for render method', () => {
    it('should throw an error', () => {
      expect(() => riew(() => {}).mount('foo')).toThrowError(
        'A key-value object expected. Instead "foo" passed'
      );
      expect(() => riew(() => {}, ({ render }) => { render('foo'); }, () => {}).mount()).toThrowError(
        'A key-value object expected. Instead "foo" passed'
      );
    });
  });
  describe('when we use `with` method', () => {
    describe('and we pass a state', () => {
      it(`should send the state to the controller`, () => {
        const view = jest.fn();
        const [ s1, setState1 ] = state('a');
        const [ s2, setState2 ] = state('b');
        const effect = jest.fn();
        const r = riew(view, effect).with({ s1, s2 });

        r.mount();
        setState1('foo');
        setState2('bar');

        expect(view).toBeCalledWithArgs(
          [ { s1: 'a', s2: 'b' } ],
          [ { s1: 'foo', s2: 'b' } ],
          [ { s1: 'foo', s2: 'bar' } ]
        );
        expect(effect).toBeCalledWithArgs(
          [ expect.objectContaining({
            render: expect.any(Function)
          }) ]
        );
      });
    });
    describe('and when we pass something else', () => {
      it(`should pass the thing to the effect and view`, () => {
        const [ s, setState ] = state({ firstName: 'John', lastName: 'Doe' });
        const getFirstName = s.map(({ firstName }) => firstName);
        const view = jest.fn();
        const spy = jest.fn();
        const r = riew(
          view,
          ({ firstName }) => {
            subscribe(firstName.pipe(spy), true);
          }
        ).with({ firstName: getFirstName });

        r.mount();
        setState({ firstName: 'Jon', lastName: 'Snow' });

        expect(view).toBeCalledWithArgs(
          [ { firstName: 'John' } ],
          [ { firstName: 'Jon' } ]
        );
        expect(spy).toBeCalledWithArgs(
          [ 'John' ],
          [ 'Jon' ]
        );
      });
    });
    describe('when we want to an exported state', () => {
      it('should recognize it and pass it down to the controller', () => {
        const [ s, setState ] = state('foo');

        register('xxx', s);

        const view = jest.fn();
        const effect = jest.fn();
        const r = riew(view, effect).with('xxx');

        r.mount();
        setState('bar');

        expect(view).toBeCalledWithArgs(
          [{ xxx: 'foo' }],
          [{ xxx: 'bar' }]
        );
        expect(effect).toBeCalledWithArgs(
          [
            expect.objectContaining({
              xxx: expect.objectContaining({ id: expect.any(String) })
            })
          ]
        );
      });
      describe('and when we have something else exported into the grid', () => {
        it('should pass it down as it is to the view and to the controller', () => {
          const something = { id: 'fff', a: 'b' };

          register('something', something);

          const view = jest.fn();
          const effect = jest.fn();
          const r = riew(view, effect).with('something');

          r.mount();

          expect(view).toBeCalledWithArgs(
            [{ something: expect.objectContaining({ a: 'b' }) } ]
          );
          expect(effect).toBeCalledWithArgs(
            [ expect.objectContaining({
              something: expect.objectContaining({ a: 'b' })
            })]
          );
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

        expect(spy).toBeCalledWithArgs([ 10 ], [ 20 ]);
      });
    });
    describe('and when we use same instance with different externals', () => {
      it('should add externals on top of the existing ones', () => {
        const spy = jest.fn();
        const r = riew(spy);
        const ra = r.with({ foo: 'bar' });
        const rb = r.with({ moo: 'noo' });

        ra.mount({});
        rb.mount({});

        expect(spy).toBeCalledWithArgs(
          [ { foo: 'bar', moo: 'noo' } ],
          [ { foo: 'bar', moo: 'noo' } ]
        );
      });
    });
  });
  describe('when we want to test the riew', () => {
    it('should allow us to pass custom one-shot externals and keep the old riew working', () => {
      const [ s ] = state('foo');
      const spy = jest.fn();
      const effect = jest.fn().mockImplementation(({ s, render }) => (spy(s()), render({ s: s() })));
      const view = jest.fn();
      const r = riew(view, effect).with({ s });
      const rTest = r.test({ s: state('bar') });

      r.mount();
      rTest.mount();

      expect(effect).toBeCalledWithArgs(
        [ expect.objectContaining({ s: expect.any(Function) }) ],
        [ expect.objectContaining({ s: expect.any(Function) }) ]
      );
      expect(spy).toBeCalledWithArgs(
        [ 'foo' ],
        [ 'bar' ]
      );
      expect(view).toBeCalledWithArgs(
        [ { s: 'foo' } ],
        [ { s: 'bar' } ]
      );
    });
  });
});
