/* eslint-disable react/prop-types, max-len */
import React from 'react';
import { render, act } from '@testing-library/react';
import { delay, exerciseHTML } from '../__helpers__';

import { Routine } from '../index';

describe('Given the Routine library', () => {
  describe('when rendering an Routine element', () => {
    it('should call my function', () => {
      const mock = jest.fn();
      const A = Routine(mock);

      render(<A />);

      expect(mock).toBeCalledTimes(1);
    });
    it('should render the result of `render` call', () => {
      const mock = jest.fn().mockImplementation(({ render }) => {
        render(<p>Foo</p>);
        render(<p>Bar</p>);
        render(<p>Hello world</p>);
      });
      const A = Routine(mock);
      const { getByText } = render(<A />);

      expect(mock).toBeCalledTimes(1);
      expect(getByText('Hello world')).toBeDefined();
    });
    it('should pass down props to our render function', () => {
      const mock = jest.fn().mockImplementation(({ message }) => <p>{ message }</p>);
      const A = Routine(({ render }) => render(mock));
      const { container } = render(<A message='foo bar'/>);

      expect(mock).toBeCalledWith(expect.objectContaining({ message: 'foo bar' }));
      exerciseHTML(container, '<p>foo bar</p>');
    });
    describe('when we want to render children', () => {
      it('should pass the `children` prop down to our function', () => {
        const B = ({ children }) => {
          return <p>{ children }</p>;
        };
        const A = Routine(({ render }) => {
          render(({ children }) => <B>{ children }</B>);
        });
        const { container } = render(<A>Hello world</A>);

        exerciseHTML(container, '<p>Hello world</p>');
      });
    });
    it('should re-render the RineBridge component if the props change', () => {
      const A = Routine(({ render }) => {
        render(props => <p>The answer is { props.answer }</p>);
      });

      const { container, rerender } = render(<A answer={ 42 }/>);

      exerciseHTML(container, '<p>The answer is 42</p>');
      rerender(<A answer={ 10 } />);
      exerciseHTML(container, '<p>The answer is 10</p>');
    });
  });
  describe('when we use an async function', () => {
    it('should allow us to render multiple times', async () => {
      const A = Routine(async ({ render }) => {
        act(() => render('Hello'));
        await delay(20);
        act(() => render('world'));
      });

      const { queryByText, getByText } = render(<A />);

      expect(getByText('Hello')).toBeDefined();
      await delay(21);
      expect(queryByText('Hello')).toBe(null);
      expect(getByText('world')).toBeDefined();
    });
    it('should not try to re-render if the bridge is unmounted', async () => {
      const spy = jest.spyOn(console, 'error');
      const A = Routine(async ({ render }) => {
        await delay(20);
        act(() => render('world'));
      });

      const { unmount } = render(<A/>);

      unmount();
      await delay(21);
      expect(spy).not.toBeCalled();
      spy.mockRestore();
    });
  });
});
