/* eslint-disable react/jsx-key */
import React from 'react';
import createRoutineController from '../RoutineController';
import System from '../System';

describe('Given the RoutineController', () => {
  beforeEach(() => {
    System.reset();
  });
  describe('when we create the controller', () => {
    it('should return a controller with id and name', () => {
      const c = createRoutineController(function foo() {});

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
      const c = createRoutineController(routineSpy);

      c.in(setContentSpy, { foo: 'bar' });
    });
    it('should allow us to wait till the render is done', (done) => {
      const routine = async (render) => {
        await render();
        done();
      };
      const c = createRoutineController(routine);

      c.in(() => {});
      c.rendered();
    });
    it('should allow us to pass directly a react element to the render', () => {
      const c = createRoutineController(async (render) => {
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
      const c = createRoutineController(async (render) => {
        render(F);
      });

      c.in(setContentSpy, { a: 'b' });
      c.updated({ c: 'd' });

      expect(setContentSpy).toBeCalledTimes(2);
      expect(setContentSpy.mock.calls[0]).toStrictEqual([ <F a='b' /> ]);
      expect(setContentSpy.mock.calls[1]).toStrictEqual([ <F c='d' /> ]);
    });
  });
});
