/* eslint-disable react/prop-types, react/jsx-key */
import React from 'react';
import { render } from '@testing-library/react';
import System from '../System';
import routine, { createRoutineInstance } from '../routine';
import { delay } from '../../__helpers__';

describe('Given the routine method', () => {
  beforeEach(() => {
    System.reset();
  });
  describe('when call it', () => {
    it(`should return a React component that
      * has a task associated with it
      * update the instance when we re-render the component
      * notifies the instance when the component is re-rendered
      * removes the instance when the component is unmounted`, () => {
      let spyIn, spyRendered, spyUpdated, spyOut;
      const C = routine(function (render) {
        render(<p>Hello world</p>);
      }, {
        onInstanceCreated(instance) {
          spyIn = jest.spyOn(instance, 'in');
          spyRendered = jest.spyOn(instance, 'rendered');
          spyUpdated = jest.spyOn(instance, 'updated');
          spyOut = jest.spyOn(instance, 'out');
        }
      });

      const { unmount, rerender } = render(<C foo='bar' />);

      expect(System.tasks).toHaveLength(1);
      rerender(<C moo='zar' />);
      unmount();

      expect(spyIn).toBeCalledTimes(1);
      expect(spyIn).toBeCalledWith(expect.any(Function), { foo: 'bar' });
      expect(spyRendered).toBeCalledTimes(2);
      expect(spyUpdated).toBeCalledTimes(1);
      expect(spyUpdated).toBeCalledWith({ moo: 'zar' });
      expect(spyOut).toBeCalledTimes(1);
      expect(System.tasks).toHaveLength(0);
    });
  });
  describe('when we create the controller', () => {
    it('should return a controller with id and name', () => {
      const c = createRoutineInstance(function foo() {});

      expect(c.id.match(/r[0-9]+/)).not.toBe(null);
      expect(c.name).toBe('foo');
    });
  });
  describe('when we call `in` method', () => {
    it(`should
      * set the controller to active
      * run the routine function
      * pass render function to the routine function
      * pass util methods to the routine function (isMounted)`, () => {
      const routineSpy = jest.fn().mockImplementation((render, { isMounted }) => {
        expect(isMounted()).toBe(true);
        render(() => {});
      });
      const setContentSpy = jest.fn().mockImplementation((reactElement) => {
        expect(React.isValidElement(reactElement)).toBe(true);
        expect(reactElement.props).toStrictEqual({ foo: 'bar' });
      });
      const c = createRoutineInstance(routineSpy);

      c.in(setContentSpy, { foo: 'bar' });
    });
    it('should allow us to wait till the render is done', (done) => {
      const routine = async (render) => {
        await render();
        done();
      };
      const c = createRoutineInstance(routine);

      c.in(() => {});
      c.rendered();
    });
    it('should allow us to pass directly a react element to the render', () => {
      const c = createRoutineInstance(async (render) => {
        render(<p foo='bar'>Hello</p>);
      });

      c.in((reactElement) => {
        expect(React.isValidElement(reactElement)).toBe(true);
      });
    });
  });
  describe('when we call the update method', () => {
    it('should trigger a render with new props', () => {
      const setContentSpy = jest.fn();
      const F = () => {};
      const c = createRoutineInstance(async (render) => {
        render(F);
      });

      c.in(setContentSpy, { a: 'b' });
      c.updated({ c: 'd' });

      expect(setContentSpy).toBeCalledTimes(2);
      expect(setContentSpy.mock.calls[0]).toStrictEqual([ <F a='b' /> ]);
      expect(setContentSpy.mock.calls[1]).toStrictEqual([ <F c='d' /> ]);
    });
  });
  describe('when the routine is a generator function', () => {
    it('should process it as it is a normal function', () => {
      const spy = jest.fn();
      const c = createRoutineInstance(function * () {
        spy(yield 'foo');
        spy(yield { a: 'b' });
        return 'end';
      });

      c.in(() => {});

      expect(spy).toBeCalledTimes(2);
      expect(spy.mock.calls[0]).toStrictEqual([ 'foo' ]);
      expect(spy.mock.calls[1]).toStrictEqual([ { a: 'b' } ]);
    });
    describe('and we yield a task with no callback set', () => {
      it('should wait for the task done promise to be resolved', async () => {
        const spy = jest.fn();
        const c = createRoutineInstance(function * () {
          const result = yield System.take('foo');

          spy(result);
        });

        c.in(() => {});

        System.put('foo', 42);
        await delay(1); // because of the promise
        expect(spy).toBeCalledWith(42);
      });
    });
    describe('and we yield a task with callback set', () => {
      it('should continue with the routine execution', async () => {
        const spy = jest.fn();
        const c = createRoutineInstance(function * () {
          yield System.take('foo', spy);
        });

        c.in(() => {});

        System.put('foo', 42);
        expect(spy).toBeCalledWith(42);
      });
    });
  });
});
