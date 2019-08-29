/* eslint-disable react/prop-types, camelcase */
import React, { useState } from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { delay, exerciseHTML } from '../__helpers__';

import { react } from '../index';

const { routine } = react;
const DummyComponent = ({ text }) => <p>{ text }</p>;

describe('Given the Rine library', () => {
  describe('when we use an async function', () => {
    it('should allow us to render multiple times', async () => {
      const A = routine(async ({ render }) => {
        act(() => { render({ text: 'Hello' }); });
        await delay(20);
        act(() => { render({ text: 'world' }); });
      }, DummyComponent);

      const { queryByText, getByText } = render(<A />);

      expect(getByText('Hello')).toBeDefined();
      await delay(21);
      expect(queryByText('Hello')).toBe(null);
      expect(getByText('world')).toBeDefined();
    });
    it('should not try to re-render if the bridge is unmounted', async () => {
      const spy = jest.spyOn(console, 'error');
      const A = routine(async ({ render }) => {
        await delay(10);
        act(() => { render({ text: 'world' }); });
      }, DummyComponent);

      const { unmount } = render(<A/>);

      unmount();
      await delay(21);
      expect(spy).not.toBeCalled();
      spy.mockRestore();
    });
  });
  describe('when reusing the same routine', () => {
    it('should create a separate instance', () => {
      const R = routine(function ({ render, props }) {
        props.stream.pipe(render);
        render(props.get());
      }, props => <p>{ props.answer }</p>);

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
  describe('when we use the `isActive` method', () => {
    it('should return the value of the `mounted` flag', async () => {
      const spy = jest.fn();
      const A = routine(async ({ isActive }) => {
        spy(isActive());
        await delay(10);
        spy(isActive());
      }, () => null);

      const { unmount } = render(<A />);

      unmount();
      await delay(11);
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy.mock.calls[0]).toStrictEqual([true]);
      expect(spy.mock.calls[1]).toStrictEqual([false]);
    });
  });
  describe('when using routine with a hook', () => {
    it('should keep the hook working', async () => {
      const Input = function () {
        const [ text, setText ] = useState('');

        return (
          <React.Fragment>
            <p>{ text }</p>
            <input onChange={ e => setText(e.target.value) } data-testid='input' />
          </React.Fragment>
        );
      };
      const Form = routine(function () {}, () => (
        <form>
          <Input />
        </form>
      ));

      const { getByTestId, getByText } = render(<Form />);

      fireEvent.change(getByTestId('input'), { target: { value: 'foobar' } });
      expect(getByText('foobar')).toBeDefined();
    });
  });
  describe('when we use useState hook together with props streaming', () => {
    it('should get props stream callback fired every time when we update the state', async () => {
      const FetchTime = routine(async ({ render, props }) => {
        props.stream.pipe(async ({ city }) => {
          render({ location: city });
        });
      }, ({ location }) => location ? <p>{ location }</p> : null);
      const App = function () {
        const [ city, setCity ] = useState('');

        return (
          <React.Fragment>
            <select onChange={ (e) => setCity(e.target.value) } data-testid='select' >
              <option value=''>pick a city</option>
              <option value='London'>London</option>
              <option value='Paris'>Paris</option>
              <option value='Barcelona'>Barcelona</option>
              <option value='Sofia'>Sofia</option>
            </select>
            <div data-testid='text'><FetchTime city={ city } /></div>
          </React.Fragment>
        );
      };

      const { getByTestId } = render(<App />);

      exerciseHTML(getByTestId('text'), '');
      fireEvent.change(getByTestId('select'), { target: { value: 'Paris' } });
      exerciseHTML(getByTestId('text'), '<p>Paris</p>');
      fireEvent.change(getByTestId('select'), { target: { value: 'Sofia' } });
      exerciseHTML(getByTestId('text'), '<p>Sofia</p>');
    });
  });
});
