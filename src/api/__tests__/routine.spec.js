/* eslint-disable react/prop-types, react/jsx-key */
import React from 'react';
import { render, act } from '@testing-library/react';
import System from '../System';
import routine, { createRoutineInstance } from '../routine';
import { delay, exerciseHTML } from '../../__helpers__';

describe('Given the `routine` function', () => {
  beforeEach(() => {
    System.reset();
  });

  // testing `routine`
  describe('when we have a routine bridge component', () => {
    it(`should
      * create an instance on mount
      * should call the "in" method on mount
      * should call "update" when the props change (re-render)
      * should call "rendered" when we render
      * should call "out" when we unmount`, () => {
      const instance = {
        in: jest.fn().mockImplementation((x, y, setContent) => setContent(<p>Hello</p>)),
        updated: jest.fn(),
        rendered: jest.fn(),
        out: jest.fn()
      };
      const createRoutineInstance = jest.fn().mockImplementation(() => instance);
      const Component = jest.fn().mockImplementation(() => null);
      const R = routine(() => {}, Component, { createRoutineInstance });
      const { rerender, unmount } = render(<R foo='bar' />);

      rerender(<R moo='zar' />);
      unmount();

      expect(createRoutineInstance).toBeCalledTimes(1);
      expect(instance.in).toBeCalledTimes(1);
      expect(instance.in).toBeCalledWith({ foo: 'bar' }, Component, expect.any(Function));
      expect(instance.updated).toBeCalledTimes(1);
      expect(instance.updated).toBeCalledWith({ moo: 'zar' });
      expect(instance.rendered).toBeCalledTimes(1);
      expect(instance.out).toBeCalledTimes(1);
    });
  });

  // testing `createRoutineInstance`
  describe('when we create a routine instance', () => {
    describe('and we call the `in` method', () => {
      it(`should
        * set the instance to mounted
        * run the routine function
        * pass render function to the routine function
        * pass util methods to the routine function (isMounted)`, () => {
        const routineSpy = jest.fn().mockImplementation(({ render, isMounted }) => {
          expect(isMounted()).toBe(true);
          render({ foo: 'bar' });
        });
        const setContentSpy = jest.fn().mockImplementation((reactElement) => {
          expect(React.isValidElement(reactElement)).toBe(true);
          expect(reactElement.props).toStrictEqual({ foo: 'bar' });
        });
        const c = createRoutineInstance(routineSpy);

        c.in({}, () => null, setContentSpy);
      });
      it('should allow us to wait till the render is done', (done) => {
        const routine = async ({ render }) => {
          await render(null);
          done();
        };
        const c = createRoutineInstance(routine);

        c.in({}, () => null, () => {});
        c.rendered();
      });
      it('should allow us to pass directly a react element to the render', () => {
        const c = createRoutineInstance(async ({ render }) => {
          render(<p foo='bar'>Hello</p>);
        });

        c.in({}, () => null, (reactElement) => {
          expect(React.isValidElement(reactElement)).toBe(true);
        });
      });
    });
    describe('when we call the update method', () => {
      it('should fire any props callbacks', () => {
        const propsSpy = jest.fn();
        const F = () => {};
        const c = createRoutineInstance(({ useProps }) => {
          useProps(propsSpy);
        });

        c.in({ a: 'b' }, F, () => {});
        c.updated({ c: 'd' });

        expect(propsSpy).toBeCalledTimes(2);
        expect(propsSpy.mock.calls[0]).toStrictEqual([{ a: 'b' }]);
        expect(propsSpy.mock.calls[1]).toStrictEqual([{ c: 'd' }]);
      });
    });
    describe('when we use take', () => {
      it(`should
        * wait for the task done promise to be resolved
        * should clean up the tasks when unmount`, async () => {
        const spy = jest.fn();
        const C = routine(async function ({ take }) {
          const result = await take('foo');

          spy(result);
        });
        const { unmount } = render(<C />);

        System.put('foo', 42);
        await delay(1); // because of the promise
        expect(spy).toBeCalledWith(42);
        unmount();
        expect(System.tasks).toHaveLength(0);
      });
    });
    describe('and we use take in a fork fashion', () => {
      it('should continue with the routine execution', async () => {
        const spy = jest.fn();
        const spy2 = jest.fn();
        const c = createRoutineInstance(function ({ take }) {
          take('foo', spy);
          spy2();
        });

        c.in(() => {});

        expect(spy2).toBeCalled();
        System.put('foo', 42);
        expect(spy).toBeCalledWith(42);
      });
    });
  });

  // integration tests
  describe('when we use the routine bridge and the instance together', () => {
    describe('and we use takeEvery', () => {
      it(`should
        * wait for the task done promise to be resolved
        * should clean up the tasks when unmount`, async () => {
        const spy = jest.fn();
        const spy2 = jest.fn();
        const C = routine(async function ({ takeEvery }) {
          takeEvery('foo', spy2);
          spy();
        });
        const { unmount } = render(<C />);

        System.put('foo');
        System.put('foo');
        unmount();

        expect(spy).toBeCalled();
        expect(spy2).toBeCalledTimes(2);
        expect(System.tasks).toHaveLength(0);
      });
    });
    describe('and we use a state', () => {
      it(`should
        * register the state teardown task in the routine
        * teardown the state when the component is unmounted`, () => {
        let ss;
        const R = routine(function ({ render, state }) {
          const s = ss = state('foo');

          s.subscribe(() => {});
          render(<p>{ s.get() }</p>);
        });
        const { container, unmount } = render(<R />);

        exerciseHTML(container, `
          <p>foo</p>
        `);
        expect(ss.__subscribers()).toHaveLength(1);
        expect(ss.get()).toBe('foo');
        unmount();
        expect(System.tasks).toHaveLength(0);
        expect(ss.__subscribers()).toHaveLength(0);
        expect(ss.get()).toBe(undefined);
      });
    });
    describe('and we use "useProps"', () => {
      it(`should
        * fire the callback at least once
        * fire the callback on every props change`, () => {
        const propsSpy = jest.fn();
        const I = routine(function ({ useProps }) {
          useProps(propsSpy);
        });

        const { rerender } = render(<I foo='bar' />);

        rerender(<I zoo='mar' />);

        expect(propsSpy).toBeCalledTimes(2);
        expect(propsSpy.mock.calls[0]).toStrictEqual([ { foo: 'bar' } ]);
        expect(propsSpy.mock.calls[1]).toStrictEqual([ { zoo: 'mar' } ]);
      });
    });
    describe('and when we need permanent props', () => {
      it('should preserve a prop for the next render', async () => {
        const compSpy = jest.fn().mockImplementation(() => null);
        const I = routine(async function ({ render }) {
          act(() => {
            render({ foo: 'bar' });
          });
          await delay(10);
          act(() => {
            render();
          });
        }, compSpy);

        render(<I />);

        await delay(11);
        expect(compSpy).toBeCalledTimes(2);
        expect(compSpy.mock.calls[0]).toStrictEqual([ { foo: 'bar' }, {} ]);
        expect(compSpy.mock.calls[1]).toStrictEqual([ { foo: 'bar' }, {} ]);
      });
    });
    it('should render nothing by default', () => {
      const R = routine(() => {}, () => <p>Hello</p>);
      const { container } = render(<R />);

      exerciseHTML(container, '');
    });
    it('should render the component if we call the `render` function', () => {
      const spy = jest.fn().mockImplementation(() => null);
      const R = routine(({ render }) => render({ c: 'd' }), spy);

      render(<R a='b'/>);
      expect(spy).toBeCalledWith({ c: 'd' }, {});
    });
    it('should not re-render the Component if the bridge is re-rendered', () => {
      const spy = jest.fn().mockImplementation(() => null);
      const R = routine(({ render }) => render(), spy);

      const { rerender } = render(<R />);

      rerender(<R />);
      expect(spy).toBeCalledTimes(1);
    });
    describe('and we pass a React element to the render method', () => {
      it(`should
        * trigger a new rendering but with the passed element
        * then later when called again with props should trigger
          rendering of the original outer component`, async () => {
        const Component = jest.fn().mockImplementation(({ answer }) => <div>{ answer }</div>);
        const C = routine(async ({ render }) => {
          render(<p>It works</p>);
          await delay(10);
          act(() => {
            render({ answer: 42 });
          });
        }, Component);
        const { container } = render(<C />);

        exerciseHTML(container, '<p>It works</p>');
        await delay(20);
        exerciseHTML(container, '<div>42</div>');
      });
    });
    describe('and we pass a string or a number', () => {
      it(`should
        * trigger a new rendering but with the passed value
        * then later when called again with props should trigger
          rendering of the original outer component`, async () => {
        const Component = jest.fn().mockImplementation(({ answer }) => <div>{ answer }</div>);
        const C = routine(async ({ render }) => {
          render('Hello world');
          await delay(10);
          act(() => {
            render({ answer: 42 });
          });
        }, Component);
        const { container } = render(<C />);

        exerciseHTML(container, 'Hello world');
        await delay(20);
        exerciseHTML(container, `
          <div>42</div>
        `);
      });
    });
    describe('and we pass null to the render method', () => {
      it('should convert that to "() => null" which means render nothing', () => {
        const C = routine(({ render }) => {
          render(null);
        });
        const { container } = render(<C />);

        exerciseHTML(container, '');
      });
    });
  });
});
