/* eslint-disable react/prop-types */
import React from 'react';
import { render } from '@testing-library/react';
import System from '../System';
import routine from '../routine';

jest.mock('../RoutineController');

describe('Given the routine method', () => {
  beforeEach(() => {
    System.reset();
  });
  describe('when call it', () => {
    it(`should return a React component that
      * has a controller associated with
      * update the controller when we re-render the component
      * notifies the controller when the component is re-rendered
      * removes the controller when the component is unmounted`, () => {
      const C = routine(function (render) {
        render(<p>Hello world</p>);
      });

      const { unmount, rerender } = render(<C foo='bar' />);

      expect(System.controllers).toHaveLength(1);

      const controller = System.controllers[0];

      rerender(<C moo='zar' />);
      unmount();

      expect(controller.in).toBeCalledTimes(1);
      expect(controller.in).toBeCalledWith(expect.any(Function), { foo: 'bar' });
      expect(controller.rendered).toBeCalledTimes(1);
      expect(controller.updated).toBeCalledTimes(1);
      expect(controller.updated).toBeCalledWith({ moo: 'zar' });
      expect(controller.out).toBeCalledTimes(1);
      expect(System.controllers).toHaveLength(0);
      jest.mock('../RoutineController');
    });
  });
});
