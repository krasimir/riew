/* eslint-disable quotes, max-len */
import { delay } from '../__helpers__';
import { state, register, riew, reset, subscribe, grid } from '../index';
import { chan } from '../csp';

describe('Given the `riew` factory function', () => {
  beforeEach(() => {
    reset();
  });
  describe('when we create and mount riew with a given view and list of controllers', () => {
    it(`should
      * call the view with the initial props
      * call each of the controller
      * run the clean-up functions of each controller`, async () => {
      const view = jest.fn();
      const se1Cleanup = jest.fn();
      const se1 = jest.fn().mockImplementation(() => se1Cleanup);
      const se2Cleanup = jest.fn();
      const se2 = jest.fn().mockImplementation(() => se2Cleanup);

      const r = riew(view, se1, se2);

      r.mount({ foo: 'bar' });
      await delay(); // because the reading of a channel is a microtask
      r.unmount();

      expect(view).toBeCalledWithArgs([ { foo: 'bar' } ]);
      expect(se1).toBeCalledWithArgs([
        expect.objectContaining({
          props: expect.objectContaining({ id: expect.any(String) })
        })
      ]);
      expect(se2).toBeCalledWithArgs([
        expect.objectContaining({
          props: expect.objectContaining({ id: expect.any(String) })
        })
      ]);
      expect(se1Cleanup).toBeCalledTimes(1);
      expect(se2Cleanup).toBeCalledTimes(1);
    });
  });
  describe('when we have an async controller', () => {
    it('should render the view without waiting the controller to finish', async () => {
      const view = jest.fn();
      const controller = async function ({ data }) {
        await delay(3);
        data({ hello: 'there' });
      };
      const r = riew(view, controller);

      r.mount({ a: 'b' });

      await delay(4);
      expect(view).toBeCalledWithArgs([ { a: 'b' } ], [ { a: 'b', hello: 'there' } ]);
    });
  });
  describe('when we create a state in the controller', () => {
    it(`should close the channel of the state if the riew is unmounted
      and should remove the state from the grid`, async () => {
      let sp;
      const view = jest.fn();
      const controller = function ({ state, data }) {
        const [ take, put ] = state('foo');
        data({ s: take });
        sp = put;
        put('bar');
      };
      const r = riew(view, controller);

      r.mount();

      await delay(4);

      expect(grid.getNodeById(sp.ch.id)).toBeDefined();
      r.unmount();
      expect(grid.getNodeById(sp.ch.id)).not.toBeDefined();
      await sp('moo');
      await sp('boo');
      expect(view).toBeCalledWithArgs(
        [ {} ],
        [
          {
            s: 'foo'
          }
        ],
        [
          {
            s: 'bar'
          }
        ]
      );
    });
    it('should send the state value to the view', async () => {
      const view = jest.fn();
      const se = function ({ state, data }) {
        data({ s: state('foo') });
      };
      const r = riew(view, se);

      r.mount();
      await delay();
      expect(view).toBeCalledWithArgs([ {} ], [ { s: 'foo' } ]);
    });
    it('should subscribe (only once) for the changes in the state and re-render the view', async () => {
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
      it('should still subscribe all of them', async () => {
        const view = jest.fn();
        const controller = async function ({ state, data }) {
          const message = state('Hello World');
          const up = message.map(value => value.toUpperCase());
          const lower = message.map(value => value.toLowerCase());
          const update = () => message.put('chao');

          data({ up, lower });
          await delay(1);
          update();
          await delay(1);
          data({ a: 10 });
        };
        const r = riew(view, controller);

        r.mount();
        await delay(4);
        expect(view).toBeCalledWithArgs(
          [ {} ],
          [ { up: 'HELLO WORLD', lower: 'hello world' } ],
          [ { up: 'CHAO', lower: 'chao' } ],
          [ { up: 'CHAO', lower: 'chao', a: 10 } ]
        );
      });
    });
    it('should unsubscribe the channels if we unmount', async () => {
      const view = jest.fn();
      const controller = async function ({ state, data }) {
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
      const r = riew(view, controller);

      r.mount();
      await delay();
      r.unmount();
      await delay(10);
      expect(view).toBeCalledWithArgs([ {} ], [ { up: 'HELLO WORLD', lower: 'hello world' } ]);
    });
  });
  describe('when we send an external channel to the view and the view is unmounted', () => {
    it(`should
      * initially subscribe and then unsubscribe
      * keep the external subscriptions`, async () => {
      const spy = jest.fn();
      const ch = chan().from('foo');
      const [ s, setState ] = ch;
      const view = jest.fn();
      const controller = function ({ data }) {
        data({ s });
      };
      const r = riew(view, controller);

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
    it(`should
      * pass the values from the channel to the view
      * subscribe to the channel's values`, async () => {
      const view = jest.fn().mockImplementation(async ({ s, change }) => {
        setTimeout(() => change(), 10);
      });
      const controller = function ({ data, state }) {
        const s = state('foo');
        const up = s.map(value => value.toUpperCase());
        const change = () => s.put('bar');

        data({ s: up, change });
        data({ s: up, change });
        data({ s: up, change });
      };
      const r = riew(view, controller);

      r.mount();
      await delay(20);
      expect(view).toBeCalledWithArgs([ { s: 'FOO', change: expect.any(Function) } ], [ { s: 'BAR', change: expect.any(Function) } ]);
    });
  });
  describe('when we send a putter or a taker to the view', () => {
    it(`should
      * run the taker and pass the value + also subscribe to channel values
      * pass down the putter`, async () => {
      const view = jest.fn().mockImplementation(async ({ s, change }) => {
        setTimeout(() => change('bar'), 10);
      });
      const controller = function ({ data, state }) {
        const [ getter, setter ] = state('foo');

        data({ s: getter, change: setter });
        data({ s: getter, change: setter });
        data({ s: getter, change: setter });
      };
      const r = riew(view, controller);

      r.mount();
      await delay(20);
      expect(view).toBeCalledWithArgs([ { s: 'foo', change: expect.any(Function) } ], [ { s: 'bar', change: expect.any(Function) } ]);
    });
  });
  describe('when we update the riew', () => {
    it('should render the view with accumulated props', async () => {
      const view = jest.fn();
      const r = riew(view);

      r.mount({ foo: 'bar' });
      r.update({ baz: 'moo' });
      r.update({ x: 'y' });
      await delay();

      expect(view).toBeCalledWithArgs([ { foo: 'bar' } ], [ { foo: 'bar', baz: 'moo' } ], [ { foo: 'bar', baz: 'moo', x: 'y' } ]);
    });
    it('should deliver the riew input to the controller', async () => {
      const spy = jest.fn();
      const controller = function ({ props }) {
        props.takeEvery(spy);
      };
      const r = riew(() => {}, controller);

      r.mount({ foo: 'bar' });
      r.update({ baz: 'moo' });
      await delay();
      expect(spy).toBeCalledWithArgs([ { foo: 'bar' } ], [ { baz: 'moo' } ]);
    });
    describe('and we update the data as a result of props change', () => {
      it('should NOT end up in a maximum call stack exceeded', async () => {
        const spy = jest.fn();
        const controller = function ({ props, data }) {
          props.map(({ n }) => n + 5).takeEvery(n => data({ n }));
        };
        const r = riew(spy, controller);

        r.mount({ n: 10 });
        r.update({ n: 20 });
        await delay();
        expect(spy).toBeCalledWithArgs([ { n: 10 } ], [ { n: 20 } ], [ { n: 15 } ], [ { n: 25 } ]);
      });
    });
  });
  describe('and when we use non object as initial props or for data method', () => {
    it('should throw an error', () => {
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
      fit(`should send the state to the controller`, () => {
        const view = jest.fn();
        const [ s1, setState1 ] = state('a');
        const [ s2, setState2 ] = state('b');
        const controller = jest.fn();
        const r = riew(view, controller).with({ s1, s2 });

        r.mount();
        setState1('foo');
        setState2('bar');

        expect(view).toBeCalledWithArgs([ { s1: 'a', s2: 'b' } ], [ { s1: 'foo', s2: 'b' } ], [ { s1: 'foo', s2: 'bar' } ]);
        expect(controller).toBeCalledWithArgs([
          expect.objectContaining({
            data: expect.any(Function)
          })
        ]);
      });
    });
    describe('and when we pass something else', () => {
      xit(`should pass the thing to the controller and view`, () => {
        const [ s, setState ] = state({ firstName: 'John', lastName: 'Doe' });
        const getFirstName = s.map(({ firstName }) => firstName);
        const view = jest.fn();
        const spy = jest.fn();
        const r = riew(view, ({ firstName }) => {
          subscribe(firstName.pipe(spy), true);
        }).with({ firstName: getFirstName });

        r.mount();
        setState({ firstName: 'Jon', lastName: 'Snow' });

        expect(view).toBeCalledWithArgs([ { firstName: 'John' } ], [ { firstName: 'Jon' } ]);
        expect(spy).toBeCalledWithArgs([ 'John' ], [ 'Jon' ]);
      });
    });
    describe('when we want to use an exported state', () => {
      xit('should recognize it and pass it down to the controller', () => {
        const [ s, setState ] = state('foo');

        register('xxx', s);

        const view = jest.fn();
        const controller = jest.fn();
        const r = riew(view, controller).with('xxx');

        r.mount();
        setState('bar');

        expect(view).toBeCalledWithArgs([ { xxx: 'foo' } ], [ { xxx: 'bar' } ]);
        expect(controller).toBeCalledWithArgs([
          expect.objectContaining({
            xxx: expect.objectContaining({ id: expect.any(String) })
          })
        ]);
      });
      describe('and when we have something else exported into the grid', () => {
        xit('should pass it down as it is to the view and to the controller', () => {
          const something = { id: 'fff', a: 'b' };

          register('something', something);

          const view = jest.fn();
          const effect = jest.fn();
          const r = riew(view, effect).with('something');

          r.mount();

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
      xit('should just proxy them to the controller and view', () => {
        const spy = jest.fn();
        const r = riew(({ foo, bar }) => foo(bar + 10), ({ foo, bar, data }) => (foo(bar), data())).with({ foo: spy, bar: 10 });

        r.mount({});

        expect(spy).toBeCalledWithArgs([ 10 ], [ 20 ]);
      });
    });
    describe('and when we use same instance with different externals', () => {
      xit('should add externals on top of the existing ones', () => {
        const spy = jest.fn();
        const r = riew(spy);

        r.with({ foo: 'bar' });
        r.with({ moo: 'noo' });

        r.mount({});

        expect(spy).toBeCalledWithArgs([ { foo: 'bar', moo: 'noo' } ]);
      });
    });
  });
  describe('when we want to test the riew', () => {
    xit('should allow us to pass custom one-shot externals and keep the old riew working', () => {
      const [ s ] = state('foo');
      const spy = jest.fn();
      const effect = jest.fn().mockImplementation(({ s, data }) => (spy(s()), data({ s: s() })));
      const view = jest.fn();
      const r = riew(view, effect).with({ s });
      const rTest = r.test({ s: state('bar') });

      r.mount();
      rTest.mount();

      expect(effect).toBeCalledWithArgs(
        [ expect.objectContaining({ s: expect.any(Function) }) ],
        [ expect.objectContaining({ s: expect.any(Function) }) ]
      );
      expect(spy).toBeCalledWithArgs([ 'foo' ], [ 'bar' ]);
      expect(view).toBeCalledWithArgs([ { s: 'foo' } ], [ { s: 'bar' } ]);
    });
  });
  describe('when we send the same controller to different views', () => {
    xit('should re-render them if the state changes', () => {
      const [ s, update ] = state('foo');
      const controller = function ({ data }) {
        data({ s });
      };
      const view1 = jest.fn();
      const view2 = jest.fn();

      riew(view1, controller).mount();
      riew(view2, controller).mount();

      update('bar');

      expect(view1).toBeCalledWithArgs([ { s: 'foo' } ], [ { s: 'bar' } ]);
      expect(view2).toBeCalledWithArgs([ { s: 'foo' } ], [ { s: 'bar' } ]);
    });
  });
});
