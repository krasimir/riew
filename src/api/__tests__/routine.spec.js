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
  describe('when we call it', () => {
    it(`should
      * return a React component
      * create a task for unmounting
      * update the props when call render or the outer component is re-rendered
      * triggers rendering on the outer component when called render or outer component is re-rendered
      * removes the instance when the component is unmounted`, () => {
      let spyIn, spyUpdated, spyOut;
      let Component = jest.fn().mockImplementation(() => null);
      const C = routine(
        function ({ render }) {
          render({ a: 'b' });
        },
        Component,
        {
          onInstanceCreated(instance) {
            spyIn = jest.spyOn(instance, 'in');
            spyUpdated = jest.spyOn(instance, 'updated');
            spyOut = jest.spyOn(instance, 'out');
          }
        }
      );

      const { unmount, rerender } = render(<C foo='bar' />);

      expect(System.tasks).toHaveLength(1);
      rerender(<C c='d' />);
      unmount();

      expect(Component.mock.calls).toStrictEqual([
        [ { foo: 'bar', a: 'b' }, {} ],
        [ { foo: 'bar', a: 'b', c: 'd' }, {}]
      ]);

      expect(Component).toBeCalledTimes(2);
      expect(spyIn).toBeCalledTimes(1);
      expect(spyIn).toBeCalledWith({ foo: 'bar' }, expect.any(Function), expect.any(Function));
      expect(spyUpdated).toBeCalledTimes(1);
      expect(spyUpdated).toBeCalledWith({ c: 'd' });
      expect(spyOut).toBeCalledTimes(1);
      expect(System.tasks).toHaveLength(0);
    });
  });
  describe('when we pass a React element to the render method', () => {
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
  describe('when we pass a string or a number', () => {
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
  describe('when we pass null to the render method', () => {
    it('should convert that to "() => null" which means render nothing', () => {
      const C = routine(({ render }) => {
        render(null);
      });
      const { container } = render(<C />);

      exerciseHTML(container, '');
    });
  });
  describe('when we use takeProps', () => {
    it(`should
      * fire the callback at least once
      * fire the callback on every props change`, () => {
      const propsSpy = jest.fn();
      const I = routine(function ({ takeProps }) {
        takeProps(propsSpy);
      });

      const { rerender } = render(<I foo='bar' />);

      rerender(<I foo='moo' />);

      expect(propsSpy).toBeCalledTimes(2);
      expect(propsSpy.mock.calls[0]).toStrictEqual([ { foo: 'bar' } ]);
      expect(propsSpy.mock.calls[1]).toStrictEqual([ { foo: 'moo' } ]);
    });
  });
  describe('when we create routine instance', () => {
    it('should return a routine instance with id and name', () => {
      const c = createRoutineInstance(function foo() {});

      expect(c.id.match(/r[0-9]+/)).not.toBe(null);
      expect(c.name).toBe('foo');
    });
  });
  describe('when we create routine instance and we call the `in` method', () => {
    it(`should
      * set the instance to mounted
      * run the routine function
      * pass render function to the routine function
      * pass util methods to the routine function (isMounted)`, () => {
      const routineSpy = jest.fn().mockImplementation(({ render, isMounted }) => {
        expect(isMounted()).toBe(true);
        render();
      });
      const setContentSpy = jest.fn().mockImplementation((reactElement) => {
        expect(React.isValidElement(reactElement)).toBe(true);
        expect(reactElement.props).toStrictEqual({ foo: 'bar' });
      });
      const c = createRoutineInstance(routineSpy);

      c.in({ foo: 'bar' }, () => null, setContentSpy);
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
    it('should trigger a render with new props', () => {
      const setContentSpy = jest.fn();
      const F = () => {};
      const c = createRoutineInstance(async ({ render }) => {
        render(F);
      });

      c.in({ a: 'b' }, F, setContentSpy);
      c.updated({ c: 'd' });

      expect(setContentSpy).toBeCalledTimes(2);
      expect(setContentSpy.mock.calls[0]).toStrictEqual([ <F a='b' /> ]);
      expect(setContentSpy.mock.calls[1]).toStrictEqual([ <F a='b' c='d' /> ]);
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
});
