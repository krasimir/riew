/* eslint-disable react/prop-types, max-len */
import React from 'react';
import { render, act } from '@testing-library/react';
import { delay, exerciseHTML } from '../__helpers__';

import { routine, System } from '../index';

describe('Given the Rine library', () => {
  describe('when we want to render children', () => {
    it('should pass the `children` prop down to our function', () => {
      const B = ({ children }) => {
        return <p>{ children }</p>;
      };
      const A = routine(render => {
        render(({ children }) => <B>{ children }</B>);
      });
      const { container } = render(<A>Hello world</A>);

      exerciseHTML(container, '<p>Hello world</p>');
    });
  });
  describe('when we use an async function', () => {
    it('should allow us to render multiple times', async () => {
      const A = routine(async (render) => {
        act(() => { render('Hello'); });
        await delay(20);
        act(() => { render('world'); });
      });

      const { queryByText, getByText } = render(<A />);

      expect(getByText('Hello')).toBeDefined();
      await delay(21);
      expect(queryByText('Hello')).toBe(null);
      expect(getByText('world')).toBeDefined();
    });
    it('should not try to re-render if the bridge is unmounted', async () => {
      const spy = jest.spyOn(console, 'error');
      const A = routine(async (render) => {
        await delay(20);
        act(() => { render('world'); });
      });

      const { unmount } = render(<A/>);

      unmount();
      await delay(21);
      expect(spy).not.toBeCalled();
      spy.mockRestore();
    });
  });
  describe('when reusing the same routine', () => {
    it('should create a separate controller', () => {
      const R = routine(function (render) {
        render(props => <p>{ props.answer }</p>);
      });

      const { container } = render(<R answer='foo' />);
      const { container: container2, rerender: rerender2 } = render(<R answer='bar' />);

      exerciseHTML(container, `
        <p>foo</p>
      `);
      exerciseHTML(container2, `
        <p>bar</p>
      `);
      rerender2(<R answer='zoo' />);
      exerciseHTML(container, `
        <p>foo</p>
      `);
      exerciseHTML(container2, `
        <p>zoo</p>
      `);
    });
  });
});
