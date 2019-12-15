/* eslint-disable quotes, max-len */
import { delay } from '../__helpers__';
import { register, riew, reset, grid, state, sub, topic, channelExists, sleep, take, put, sput, chan } from '../index';

function expectRiew(callback, delay = 0) {
  return new Promise(resolve => {
    setTimeout(() => {
      callback();
      resolve();
    }, delay);
  });
}

describe('Given the `riew` factory function', () => {
  beforeEach(() => {
    reset();
  });
  describe('when we create and mount riew with a given view and list of routines', () => {
    it(`should
      * call the view with the initial props
      * call each of the routine
      * run the clean-up functions of each routine`, async () => {
      const view = jest.fn();
      const se1Cleanup = jest.fn();
      const se1 = jest.fn().mockImplementation(function * () {
        return se1Cleanup;
      });
      const se2Cleanup = jest.fn();
      const se2 = jest.fn().mockImplementation(function * () {
        return se2Cleanup;
      });

      const r = riew(view, se1, se2);

      r.mount({ foo: 'bar' });
      await delay();
      r.unmount();

      expect(view).toBeCalledWithArgs([ { foo: 'bar' } ]);
      expect(se1).toBeCalledWithArgs([
        expect.objectContaining({
          render: expect.any(Function)
        })
      ]);
      expect(se2).toBeCalledWithArgs([
        expect.objectContaining({
          render: expect.any(Function)
        })
      ]);
      expect(se1Cleanup).toBeCalledTimes(1);
      expect(se2Cleanup).toBeCalledTimes(1);
    });
  });
  describe('when mounting and we `put` to the view channel', () => {
    it('should aggregate the view props', () => {
      const viewFunc = jest.fn();
      const routine1 = function * ({ render }) {
        render({ r1: 'r1' });
      };
      const routine2 = function * ({ render }) {
        render({ r2: 'r2' });
      };
      const r = riew(viewFunc, routine1, routine2);

      r.mount({ props: 'props' });

      return expectRiew(() => {
        expect(viewFunc).toBeCalledWithArgs([
          {
            props: 'props',
            r1: 'r1',
            r2: 'r2'
          }
        ]);
      });
    });
  });
  describe('when we unmount', () => {
    it('should not continue the routine', async () => {
      const view = jest.fn();
      const spy = jest.fn();
      const routine = function * () {
        yield sleep(4);
        spy('ops');
      };
      const r = riew(view, routine);

      r.mount();
      await delay(2);
      r.unmount();
      await delay(4);
      expect(spy).not.toBeCalled();
    });
  });
  describe('when we create a state in the routine', () => {
    it(`should destroy the state if the riew is unmounted
      and should remove the channel from the grid`, async () => {
      let s;
      const view = jest.fn();
      const routine = function * ({ state }) {
        s = state('XXX');
      };
      const r = riew(view, routine);

      r.mount();

      await delay(4);

      expect(grid.getNodeById(s.id)).toBeDefined();
      r.unmount();
      expect(grid.getNodeById(s.id)).not.toBeDefined();
      expect(view).toBeCalledWithArgs([ {} ]);
    });
    it('should send the state value to the view', async () => {
      const view = jest.fn();
      const routine = function * ({ state, render }) {
        const s = state('foo');
        render({ s });
        yield sleep(2);
        s.set('bar');
      };
      const r = riew(view, routine);

      r.mount();
      await delay(4);
      expect(view).toBeCalledWithArgs([ { s: 'foo' } ], [ { s: 'bar' } ]);
    });
    it('should subscribe (only once) for the changes in the state and re-render the view', async () => {
      const view = jest.fn();
      const se = function * ({ state, render }) {
        const s = state('foo');

        render({ s });
        render({ s });
        render({ s });
        render({ s });
        yield sleep(4);
        yield put(s.WRITE, 'bar');
        expect(chan(s.READ).subscribers).toHaveLength(1);
      };
      const r = riew(view, se);

      r.mount();
      await delay(10);
      expect(view).toBeCalledWithArgs([ { s: 'foo' } ], [ { s: 'bar' } ]);
    });
    describe('when we have multiple states produced', () => {
      it('should still subscribe to all of them', async () => {
        const view = jest.fn();
        const routine = function * ({ state, render }) {
          const message = state('foo');
          message.select('up', v => v.toUpperCase());
          message.select('lower', v => v.toLowerCase());

          render({ $up: 'up', $lower: 'lower' });
          yield sleep(2);
          yield put(message.WRITE, 'Hello World');
          yield sleep(2);
          yield put(message.WRITE, 'cHao');
          yield sleep(2);
          render({ a: 10 });
        };
        const r = riew(view, routine);

        r.mount();
        await delay(10);
        expect(view).toBeCalledWithArgs(
          [ { up: 'FOO', lower: 'foo' } ],
          [ { up: 'HELLO WORLD', lower: 'hello world' } ],
          [ { up: 'CHAO', lower: 'chao' } ],
          [ { up: 'CHAO', lower: 'chao', a: 10 } ]
        );
      });
    });
    it('should unsubscribe the channels and not render if we unmount', async () => {
      const view = jest.fn();
      const routine = function * ({ state, render }) {
        const message = state('Hello World');

        render({ message });
        yield sleep(3);
        yield put(message.WRITE, 'foo');
      };
      const r = riew(view, routine);

      r.mount();
      await delay();
      r.unmount();
      await delay(5);
      expect(view).toBeCalledWithArgs([ { message: 'Hello World' } ]);
    });
  });
  describe('when we send an external state to the view and the view is unmounted', () => {
    it(`should
      * initially subscribe and then unsubscribe
      * keep the external subscriptions`, async () => {
      const spy = jest.fn();
      const s = state('foo');
      const view = jest.fn();
      const routine = function * ({ render }) {
        render({ s });
      };
      const r = riew(view, routine);

      sub(s.READ, spy);

      r.mount();
      sput(s.WRITE, 'baz');
      await delay();
      r.unmount();
      sput(s.WRITE, 'zoo');
      await delay();
      expect(channelExists(s.WRITE)).toBeDefined();
      expect(view).toBeCalledWithArgs([ { s: 'baz' } ]);
      expect(spy).toBeCalledWithArgs([ 'baz' ], [ 'zoo' ]);
    });
  });
  describe('when we send a state to the view', () => {
    it(`should
      * pass the values from the state to the view
      * subscribe to the state's updates`, async () => {
      const view = jest.fn().mockImplementation(({ change }) => {
        setTimeout(() => change(), 10);
      });
      const routine = function * ({ render, state }) {
        const s = state('foo');
        s.select('up', v => v.toUpperCase());
        const change = () => sput(s.WRITE, 'bar');

        render({ $s: 'up', change });
        render({ $s: 'up', change });
        render({ $s: 'up', change });
      };
      const r = riew(view, routine);

      r.mount();
      await delay(20);
      expect(view).toBeCalledWithArgs([ { s: 'FOO', change: expect.any(Function) } ], [ { s: 'BAR', change: expect.any(Function) } ]);
    });
  });
  describe('when we update the riew', () => {
    it('should render the view with accumulated props', async () => {
      const view = jest.fn();
      const r = riew(view);

      r.mount({ foo: 'bar' });
      await delay();
      r.update({ baz: 'moo' });
      await delay();
      r.update({ x: 'y' });
      await delay();

      expect(view).toBeCalledWithArgs([ { foo: 'bar' } ], [ { foo: 'bar', baz: 'moo' } ], [ { foo: 'bar', baz: 'moo', x: 'y' } ]);
    });
    it('should deliver the riew input to the routine', async () => {
      const spy = jest.fn();
      const routine = function * ({ props }) {
        sub(props, spy);
      };
      const r = riew(() => {}, routine);

      r.mount({ foo: 'bar' });
      await delay();
      r.update({ baz: 'moo' });
      await delay();
      expect(spy).toBeCalledWithArgs([ { foo: 'bar' } ], [ { baz: 'moo' } ]);
    });
    describe('and we update the data as a result of props change', () => {
      it('should NOT end up in a maximum call stack exceeded', async () => {
        const spy = jest.fn();
        const propsSpy = jest.fn();
        const routine = function * ({ props, render }) {
          sub(props, ({ n }) => {
            render({ n: n + 5 });
            propsSpy(n);
          });
          propsSpy('initial=' + (yield take(props)).n);
        };
        const r = riew(spy, routine);

        r.mount({ n: 10 });
        await delay();
        r.update({ n: 20 });
        await delay();
        expect(spy).toBeCalledWithArgs([ { n: 15 } ], [ { n: 25 } ]);
        expect(propsSpy).toBeCalledWithArgs([ 10 ], [ 'initial=10' ], [ 20 ]);
      });
    });
  });
  describe('and when we use non object as initial props or for data method', () => {
    it('should throw an error', () => {
      expect(() => riew(() => {}).mount('foo')).toThrowError('A key-value object expected. Instead "foo" passed');
      expect(() =>
        riew(
          () => {},
          ({ render }) => {
            render('foo');
          },
          () => {}
        ).mount()
      ).toThrowError('A key-value object expected. Instead "foo" passed');
    });
  });
  describe('when we use `with` method', () => {
    describe('and we pass a channel', () => {
      it(`should send the state to the routine`, async () => {
        const view = jest.fn();
        const s1 = state('a');
        const s2 = state('b');
        const routine = jest.fn().mockImplementation(function * () {});
        const r = riew(view, routine).with({ s1, s2 });

        r.mount();
        await delay(5);
        sput(s1.WRITE, 'foo');
        sput(s2.WRITE, 'bar');
        await delay();

        expect(view).toBeCalledWithArgs([ { s1: 'a', s2: 'b' } ], [ { s1: 'foo', s2: 'bar' } ]);
        expect(routine).toBeCalledWithArgs([
          expect.objectContaining({
            render: expect.any(Function)
          })
        ]);
      });
    });
    describe('and when we pass something else', () => {
      it(`should pass the thing to the routine and view`, async () => {
        const s = state();
        s.select('firstName', ({ firstName }) => firstName);
        const view = jest.fn();
        const spy = jest.fn();
        const r = riew(view, function * () {
          sub('firstName', spy);
        }).with({ $firstName: 'firstName' });

        r.mount();
        sput(s.WRITE, { firstName: 'John', lastName: 'Doe' });
        await delay(5);
        sput(s.WRITE, { firstName: 'Jon', lastName: 'Snow' });
        await delay(5);

        expect(view).toBeCalledWithArgs([ { firstName: 'John' } ], [ { firstName: 'Jon' } ]);
        expect(spy).toBeCalledWithArgs([ 'John' ], [ 'Jon' ]);
      });
    });
    describe('when we want to use an exported state', () => {
      it('should recognize it and pass it down to the routine', async () => {
        const s = state('foo');

        register('xxx', s);

        const view = jest.fn();
        const routine = jest.fn().mockImplementation(function * () {});
        const r = riew(view, routine).with('xxx');

        r.mount();
        await delay();
        sput(s.WRITE, 'bar');
        await delay();

        expect(view).toBeCalledWithArgs([ { xxx: 'foo' } ], [ { xxx: 'bar' } ]);
        expect(routine).toBeCalledWithArgs([
          expect.objectContaining({
            xxx: s
          })
        ]);
      });
      describe('and when we have something else exported into the grid', () => {
        it('should pass it down as it is to the view and to the routine', async () => {
          const something = { id: 'fff', a: 'b' };

          register('something', something);

          const view = jest.fn();
          const routine = jest.fn().mockImplementation(function * () {});
          const r = riew(view, routine).with('something');

          r.mount();
          await delay();

          expect(view).toBeCalledWithArgs([ { something: expect.objectContaining({ a: 'b' }) } ]);
          expect(routine).toBeCalledWithArgs([
            expect.objectContaining({
              something: expect.objectContaining({ a: 'b' })
            })
          ]);
        });
      });
    });
    describe('and when we pass primitive values', () => {
      it('should just proxy them to the routine and view', async () => {
        const spy = jest.fn();
        const r = riew(({ foo, bar }) => foo(bar + 10), function * ({ foo, bar }) {
          foo(bar);
        }).with({
          foo: spy,
          bar: 10
        });

        r.mount({});
        await delay();

        expect(spy).toBeCalledWithArgs([ 10 ], [ 20 ]);
      });
    });
    describe('and when we use same instance with different externals', () => {
      it('should add externals on top of the existing ones', async () => {
        const spy = jest.fn();
        const r = riew(spy);

        r.with({ foo: 'bar' });
        r.with({ moo: 'noo' });

        r.mount();
        await delay();

        expect(spy).toBeCalledWithArgs([ { foo: 'bar', moo: 'noo' } ]);
      });
    });
  });
  describe('when we want to test the riew', () => {
    it('should allow us to pass custom one-shot externals and keep the old riew working', async () => {
      const s = state('foo');
      const s2 = state('bar');
      const routine = jest.fn().mockImplementation(function * ({ s }) {
        yield sleep();
        yield put(s.WRITE, 'baz');
      });
      const view = jest.fn();
      const r = riew(view, routine).with({ s });
      const rTest = r.test({ s: s2 });

      r.mount();
      rTest.mount();
      await delay(2);

      expect(routine).toBeCalledWithArgs(
        [ expect.objectContaining({ s: expect.any(Object) }) ],
        [ expect.objectContaining({ s: expect.any(Object) }) ]
      );
      expect(view).toBeCalledWithArgs([ { s: 'foo' } ], [ { s: 'bar' } ], [ { s: 'baz' } ], [ { s: 'baz' } ]);
    });
  });
  describe('when we send the same routine to different views', () => {
    it('should re-render them if the state changes', async () => {
      const s = state('xxx');
      const routine = function * ({ render }) {
        render({ s });
      };
      const view1 = jest.fn();
      const view2 = jest.fn();
      const r1 = riew(view1, routine);
      const r2 = riew(view2, routine);

      r1.mount();
      r2.mount();

      await delay();
      sput(s.WRITE, 'foo');
      await delay();
      sput(s.WRITE, 'bar');
      await delay(5);

      expect(view1).toBeCalledWithArgs([ { s: 'xxx' } ], [ { s: 'foo' } ], [ { s: 'bar' } ]);
      expect(view2).toBeCalledWithArgs([ { s: 'xxx' } ], [ { s: 'foo' } ], [ { s: 'bar' } ]);
    });
  });
  describe('when we work with state', () => {
    describe('when we create state from within a routine', () => {
      it(`should
        * still subscribe as usual for the newly created channels
        * destroy the state and its channels if the riew is unmounted`, async () => {
        const states = [];
        const refState = s => {
          states.push(s);
          return s;
        };
        const routine = function * ({ render, state }) {
          render({ s: refState(state('foo')) });
          yield sleep(2);
          render({ s: refState(state('baz')) });
        };
        const view = jest.fn();
        const r = riew(view, routine);

        r.mount();
        await delay(4);
        r.unmount();
        expect(view).toBeCalledWithArgs([ { s: 'foo' } ], [ { s: 'baz' } ]);
        states.forEach(s => expect(channelExists(s.WRITE)).toBe(false));
      });
      it('should accept a state via the `render` method', async () => {
        const routine = function * ({ state, render }) {
          const counter = state(1);
          counter.mutate('increment', current => current + 1);

          render({ counter });
          yield sleep(2);
          yield put('increment');
        };
        const view = jest.fn();
        const r = riew(view, routine);

        r.mount();
        await delay(4);
        expect(view).toBeCalledWithArgs([ { counter: 1 } ], [ { counter: 2 } ]);
      });
      it('should accept a state via the `with` method', async () => {
        const counter = state(12);
        register('counter', counter);
        const routine = function * ({ counter }) {
          counter.mutate('increment', current => current + 1);
          yield sleep(2);
          yield put('increment');
        };
        const view = jest.fn();
        const r = riew(view, routine).with('counter');

        r.mount();
        await delay(4);
        expect(view).toBeCalledWithArgs([ { counter: 12 } ], [ { counter: 13 } ]);
      });
    });
  });
});
