/* eslint-disable react/prop-types, max-len */
import React from 'react';
import { render, act } from '@testing-library/react';
import { delay, exerciseHTML } from '../__helpers__';

import rine from '../index';

describe('Given the Rine library', () => {
  describe('when rendering an Rine element', () => {
    it('should call my function', () => {
      const mock = jest.fn();
      const A = rine(mock);

      render(<A />);

      expect(mock).toBeCalledTimes(1);
    });
    it('should render the result of `render` call', () => {
      const mock = jest.fn().mockImplementation(({ render }) => {
        render(<p>Foo</p>);
        render(<p>Bar</p>);
        render(<p>Hello world</p>);
      });
      const A = rine(mock);
      const { getByText } = render(<A />);

      expect(mock).toBeCalledTimes(1);
      expect(getByText('Hello world')).toBeDefined();
    });
    it('should pass down props to our function', () => {
      const mock = jest.fn().mockImplementation(({ message }) => <p>{ message }</p>);
      const A = rine(mock);
      const { container } = render(<A message='foo bar'/>);

      expect(mock).toBeCalledWith(expect.objectContaining({ message: 'foo bar' }));
      exerciseHTML(container, '<p>foo bar</p>');
    });
    describe('when we want to render children', () => {
      it('should pass the `children` prop down to our function', () => {
        const B = ({ children }) => {
          return <p>{ children }</p>;
        };
        const A = rine(({ children, render }) => {
          render(<B>{ children }</B>);
        });
        const { container } = render(<A>Hello world</A>);

        exerciseHTML(container, '<p>Hello world</p>');
      });
    });
  });
  describe('when we use an async function', () => {
    it('should allow us to render multiple times', async () => {
      const A = rine(async ({ render }) => {
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
  });
});
