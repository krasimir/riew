/* eslint-disable quotes, max-len */
import { delay } from '../__helpers__';
import { register, riew, reset, grid } from '../index';
import { chan, state, sleep, put, take } from '../csp';

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
      const se1 = jest.fn().mockImplementation(() => se1Cleanup);
      const se2Cleanup = jest.fn();
      const se2 = jest.fn().mockImplementation(() => se2Cleanup);

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
      const routine1 = function ({ render }) {
        render({ r1: 'r1' });
      };
      const routine2 = function ({ render }) {
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
  describe('when we have an async routine', () => {
    it('should render the view without waiting the routine to finish', async () => {
      const view = jest.fn();
      const routine = async function ({ render }) {
        await delay(3);
        render({ hello: 'there' });
      };
      const r = riew(view, routine);

      r.mount({ a: 'b' });
      await delay(4);
      expect(view).toBeCalledWithArgs([ { a: 'b' } ], [ { a: 'b', hello: 'there' } ]);
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
  describe('when we create a channel in the routine', () => {
    it(`should close the channel if the riew is unmounted
      and should remove the channel from the grid`, async () => {
      let sp;
      const view = jest.fn();
      const routine = function ({ state }) {
        sp = state('foo');
      };
      const r = riew(view, routine);

      r.mount();

      await delay(4);

      expect(grid.getNodeById(sp.id)).toBeDefined();
      r.unmount();
      expect(grid.getNodeById(sp.id)).not.toBeDefined();
      expect(view).toBeCalledWithArgs([ {} ]);
    });
    xit('should send the state value to the view', async () => {
      const view = jest.fn();
      const se = function ({ state, data }) {
        data({ s: state('foo') });
      };
      const r = riew(view, se);

      r.mount();
      await delay();
      expect(view).toBeCalledWithArgs([ {} ], [ { s: 'foo' } ]);
    });
    xit('should subscribe (only once) for the changes in the state and re-render the view', async () => {
      const view = jest.fn();
      const se = async function ({ state, data }) {
        const [ s, setState ] = state('foo');

        data({ s });
        data({ s });
        data({ s });
        data({ s });
        await delay(4);
        setState('bar');
      };
      const r = riew(view, se);

      r.mount();
      await delay(10);
      expect(view).toBeCalledWithArgs([ {} ], [ { s: 'foo' } ], [ { s: 'bar' } ]);
    });
    describe('when we have multiple channels produced', () => {
      xit('should still subscribe all of them', () => {
        const view = jest.fn();
        const routine = function ({ state, data }) {
          const message = state('Hello World');
          const up = message.map(value => value.toUpperCase());
          const lower = message.map(value => value.toLowerCase());
          const update = () => message.put('chao');

          data({ up, lower });
          update();
          data({ a: 10 });
        };
        const r = riew(view, routine);

        r.mount();
        expect(view).toBeCalledWithArgs(
          [ {} ],
          [ { up: 'HELLO WORLD', lower: 'hello world' } ],
          [ { up: 'CHAO', lower: 'chao' } ],
          [ { up: 'CHAO', lower: 'chao', a: 10 } ]
        );
      });
    });
    xit('should unsubscribe the channels if we unmount', async () => {
      const view = jest.fn();
      const routine = async function ({ state, data }) {
        const message = state('Hello World');
        const up = message.map(value => value.toUpperCase());
        const lower = message.map(value => value.toLowerCase());
        const update = () => message.put('Chao');
        const update2 = () => message.put('Foo');

        data({ up, lower });
        await delay(3);
        update();
        update2();
      };
      const r = riew(view, routine);

      r.mount();
      await delay();
      r.unmount();
      await delay(10);
      expect(view).toBeCalledWithArgs([ {} ], [ { up: 'HELLO WORLD', lower: 'hello world' } ]);
    });
  });
  describe('when we send an external channel to the view and the view is unmounted', () => {
    xit(`should
      * initially subscribe and then unsubscribe
      * keep the external subscriptions`, async () => {
      const spy = jest.fn();
      const ch = chan().from([ 'foo' ]);
      const [ s, setState ] = ch;
      const view = jest.fn();
      const routine = function ({ data }) {
        data({ s });
      };
      const r = riew(view, routine);

      ch.takeEvery(spy);

      r.mount();
      setState('baz');
      await delay();
      r.unmount();
      setState('zoo');
      await delay();
      expect(ch.state()).toBe(chan.OPEN);
      expect(view).toBeCalledWithArgs([ { s: 'baz' } ]);
      expect(spy).toBeCalledWithArgs([ 'foo' ], [ 'baz' ], [ 'zoo' ]);
    });
  });
  describe('when we send a channel to the view', () => {
    xit(`should
      * pass the values from the channel to the view
      * subscribe to the channel's values`, async () => {
      const view = jest.fn().mockImplementation(async ({ s, change }) => {
        setTimeout(() => change(), 10);
      });
      const routine = function ({ data, state }) {
        const s = state('foo');
        const up = s.map(value => value.toUpperCase());
        const change = () => s.put('bar');

        data({ s: up, change });
        data({ s: up, change });
        data({ s: up, change });
      };
      const r = riew(view, routine);

      r.mount();
      await delay(20);
      expect(view).toBeCalledWithArgs([ { s: 'FOO', change: expect.any(Function) } ], [ { s: 'BAR', change: expect.any(Function) } ]);
    });
  });
  describe('when we send a putter or a taker to the view', () => {
    xit(`should
      * run the taker and pass the value + also subscribe to channel values
      * pass down the putter`, async () => {
      const view = jest.fn().mockImplementation(async ({ s, change }) => {
        setTimeout(() => change('bar'), 10);
      });
      const routine = function ({ data, state }) {
        const [ getter, setter ] = state('foo');

        data({ s: getter, change: setter });
        data({ s: getter, change: setter });
        data({ s: getter, change: setter });
      };
      const r = riew(view, routine);

      r.mount();
      await delay(20);
      expect(view).toBeCalledWithArgs([ { s: 'foo', change: expect.any(Function) } ], [ { s: 'bar', change: expect.any(Function) } ]);
    });
  });
  describe('when we update the riew', () => {
    xit('should render the view with accumulated props', async () => {
      const view = jest.fn();
      const r = riew(view);

      r.mount({ foo: 'bar' });
      r.update({ baz: 'moo' });
      r.update({ x: 'y' });
      await delay();

      expect(view).toBeCalledWithArgs([ { foo: 'bar' } ], [ { foo: 'bar', baz: 'moo' } ], [ { foo: 'bar', baz: 'moo', x: 'y' } ]);
    });
    xit('should deliver the riew input to the routine', async () => {
      const spy = jest.fn();
      const routine = function ({ props }) {
        props.takeEvery(spy);
      };
      const r = riew(() => {}, routine);

      r.mount({ foo: 'bar' });
      r.update({ baz: 'moo' });
      await delay();
      expect(spy).toBeCalledWithArgs([ { foo: 'bar' } ], [ { baz: 'moo' } ]);
    });
    describe('and we update the data as a result of props change', () => {
      xit('should NOT end up in a maximum call stack exceeded', async () => {
        const spy = jest.fn();
        const routine = function ({ props, data }) {
          props.map(({ n }) => n + 5).takeEvery(n => data({ n }));
        };
        const r = riew(spy, routine);

        r.mount({ n: 10 });
        r.update({ n: 20 });
        await delay();
        expect(spy).toBeCalledWithArgs([ { n: 10 } ], [ { n: 20 } ], [ { n: 15 } ], [ { n: 25 } ]);
      });
    });
  });
  describe('and when we use non object as initial props or for data method', () => {
    xit('should throw an error', () => {
      expect(() => riew(() => {}).mount('foo')).toThrowError('A key-value object expected. Instead "foo" passed');
      expect(() =>
        riew(
          () => {},
          ({ data }) => {
            data('foo');
          },
          () => {}
        ).mount()
      ).toThrowError('A key-value object expected. Instead "foo" passed');
    });
  });
  describe('when we use `with` method', () => {
    describe('and we pass a channel', () => {
      xit(`should send the state to the routine`, async () => {
        const view = jest.fn();
        const [ s1, setState1 ] = chan().from([ 'a' ]);
        const [ s2, setState2 ] = chan().from([ 'b' ]);
        const routine = jest.fn();
        const r = riew(view, routine).with({ s1, s2 });

        r.mount();
        await delay(5);
        setState1('foo');
        setState2('bar');
        await delay();

        expect(view).toBeCalledWithArgs([ {} ], [ { s1: 'a', s2: 'b' } ], [ { s1: 'foo', s2: 'bar' } ]);
        expect(routine).toBeCalledWithArgs([
          expect.objectContaining({
            data: expect.any(Function)
          })
        ]);
      });
    });
    describe('and when we pass something else', () => {
      xit(`should pass the thing to the routine and view`, async () => {
        const ch = chan().from([ { firstName: 'John', lastName: 'Doe' } ]);
        const [ , setState ] = ch;
        const getFirstName = ch.map(({ firstName }) => firstName);
        const view = jest.fn();
        const spy = jest.fn();
        const r = riew(view, ({ firstName }) => {
          firstName.takeEvery(spy);
        }).with({ firstName: getFirstName });

        r.mount();
        await delay(5);
        setState({ firstName: 'Jon', lastName: 'Snow' });
        await delay(5);

        expect(view).toBeCalledWithArgs([ {} ], [ { firstName: 'John' } ], [ { firstName: 'Jon' } ]);
        expect(spy).toBeCalledWithArgs([ 'John' ], [ 'Jon' ]);
      });
    });
    describe('when we want to use an exported state', () => {
      xit('should recognize it and pass it down to the routine', async () => {
        const [ s, setState ] = state('foo');

        register('xxx', s);

        const view = jest.fn();
        const routine = jest.fn();
        const r = riew(view, routine).with('xxx');

        r.mount();
        setState('bar');
        await delay();

        expect(view).toBeCalledWithArgs([ {} ], [ { xxx: 'foo' } ], [ { xxx: 'bar' } ]);
        expect(routine).toBeCalledWithArgs([
          expect.objectContaining({
            xxx: expect.any(Function)
          })
        ]);
      });
      describe('and when we have something else exported into the grid', () => {
        xit('should pass it down as it is to the view and to the routine', async () => {
          const something = { id: 'fff', a: 'b' };

          register('something', something);

          const view = jest.fn();
          const effect = jest.fn();
          const r = riew(view, effect).with('something');

          r.mount();
          await delay();

          expect(view).toBeCalledWithArgs([ { something: expect.objectContaining({ a: 'b' }) } ]);
          expect(effect).toBeCalledWithArgs([
            expect.objectContaining({
              something: expect.objectContaining({ a: 'b' })
            })
          ]);
        });
      });
    });
    describe('and when we pass primitive values', () => {
      xit('should just proxy them to the routine and view', async () => {
        const spy = jest.fn();
        const r = riew(({ foo, bar }) => foo(bar + 10), ({ foo, bar }) => foo(bar)).with({
          foo: spy,
          bar: 10
        });

        r.mount({});
        await delay();

        expect(spy).toBeCalledWithArgs([ 10 ], [ 20 ]);
      });
    });
    describe('and when we use same instance with different externals', () => {
      xit('should add externals on top of the existing ones', async () => {
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
    xit('should allow us to pass custom one-shot externals and keep the old riew working', async () => {
      const s = state('foo');
      const s2 = state('bar');
      const spy = jest.fn();
      const routine = jest.fn().mockImplementation(({ s }) => {
        s.takeEvery(spy);
      });
      const view = jest.fn();
      const r = riew(view, routine).with({ s });
      const rTest = r.test({ s: s2 });

      r.mount();
      rTest.mount();
      await delay();

      expect(routine).toBeCalledWithArgs(
        [ expect.objectContaining({ s: expect.any(Object) }) ],
        [ expect.objectContaining({ s: expect.any(Object) }) ]
      );
      expect(spy).toBeCalledWithArgs([ 'foo' ], [ 'bar' ]);
      expect(view).toBeCalledWithArgs([ {} ], [ {} ], [ { s: 'foo' } ], [ { s: 'bar' } ]);
    });
  });
  describe('when we send the same routine to different views', () => {
    xit('should re-render them if the state changes', async () => {
      const [ s, update ] = state();
      const routine = function ({ data }) {
        data({ s });
      };
      const view1 = jest.fn();
      const view2 = jest.fn();
      const r1 = riew(view1, routine);
      const r2 = riew(view2, routine);

      r1.mount();
      r2.mount();

      update('foo');
      update('bar');
      await delay(5);

      expect(view1).toBeCalledWithArgs([ {} ], [ { s: 'foo' } ], [ { s: 'bar' } ]);
      expect(view2).toBeCalledWithArgs([ {} ], [ { s: 'foo' } ], [ { s: 'bar' } ]);
    });
  });
});
