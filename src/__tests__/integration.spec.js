/* eslint-disable react/prop-types, camelcase */
import React, { useState } from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { delay, exerciseHTML } from '../__helpers__';

import { routine, System } from '../index';

describe('Given the Rine library', () => {
  beforeEach(() => {
    System.reset();
  });
  describe('when we use an async function', () => {
    it('should allow us to render multiple times', async () => {
      const A = routine(async ({ render }) => {
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
      const A = routine(async ({ render }) => {
        await delay(10);
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
    it('should create a separate instance', () => {
      const R = routine(function ({ render, useProps }) {
        useProps(render);
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
  describe('when using `take` and `put`', () => {
    it(`should
      - pause the routine till the event is fired
      - allow for only one put`, async () => {
      const A = routine(async ({ render, take, put }) => {
        act(() => {
          render(<button onClick={ () => put('xxx', 'bar') }>click me</button>);
        });
        const r = await take('xxx');

        expect(r).toEqual('bar');
        act(() => { render(<p>Yeah</p>); });
      });

      const { container, getByText } = render(<A />);

      fireEvent.click(getByText('click me'));

      await delay(1);
      exerciseHTML(container, `
        <p>Yeah</p>
      `);
    });
  });
  describe('when using `take` in a fork fashion', () => {
    it(`should
      - run the callback after the put call
      - allow for only one put call`, async () => {
      const A = routine(async ({ render, take, put }) => {
        act(() => {
          render(<button onClick={ () => put('foo', 'bar') }>click me</button>);
        });
        take('foo', async (r) => {
          expect(r).toEqual('bar');
          act(() => { render(<p>Yeah</p>); });
        });
      });

      const { container, getByText } = render(<A />);

      fireEvent.click(getByText('click me'));

      exerciseHTML(container, `
        <p>Yeah</p>
      `);
    });
  });
  describe('when using `takeEvery` and `put`', () => {
    it('should fire the callback on every `put`', async () => {
      const Counter = ({ value, onClick }) => (
        <React.Fragment>
          <p>{ value }</p>
          <button onClick={ onClick }>click me</button>)
        </React.Fragment>
      );
      const A = routine(async ({ render, takeEvery, put }) => {
        let counter = 0;
        let renderCounter = () => act(() => { render(<Counter value={ counter } onClick={ () => put('foo', 2) } />); });

        renderCounter();
        takeEvery('foo', (payload) => {
          counter += payload;
          renderCounter();
        });
      });

      const { container, getByText } = render(<A />);

      fireEvent.click(getByText('click me'));
      exerciseHTML(container.querySelector('p'), '2');
      fireEvent.click(getByText('click me'));
      fireEvent.click(getByText('click me'));
      fireEvent.click(getByText('click me'));
      exerciseHTML(container.querySelector('p'), '8');
    });
  });
  describe('when using `take` and `put` in different routines', () => {
    it('should allow the communication between them', async () => {
      const A = routine(async ({ render, take }) => {
        await take('foo');
        act(() => { render(<p>It works</p>); });
      });
      const B = routine(async ({ put }) => {
        await delay(10);
        put('foo');
      });

      const { container } = render(
        <React.Fragment>
          <A />
          <B />
        </React.Fragment>
      );

      await delay(11);
      exerciseHTML(container, `
        <p>It works</p>
      `);
    });
  });
  describe('when we use the `isMounted` method', () => {
    it('should return the value of the `mounted` flag', async () => {
      const spy = jest.fn();
      const A = routine(async ({ isMounted }) => {
        spy(isMounted());
        await delay(10);
        spy(isMounted());
      });

      const { unmount } = render(<A />);

      unmount();
      await delay(11);
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy.mock.calls[0]).toStrictEqual([true]);
      expect(spy.mock.calls[1]).toStrictEqual([false]);
    });
  });
  describe('when using routine routine with a hook', () => {
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
      const Form = routine(function ({ render }) {
        render(
          <form>
            <Input />
          </form>
        );
      });

      const { getByTestId, getByText } = render(<Form />);

      fireEvent.change(getByTestId('input'), { target: { value: 'foobar' } });
      expect(getByText('foobar')).toBeDefined();
    });
  });
  describe('when we unmount a component', () => {
    it('should clean up the pending tasks', () => {
      const C = routine(function ({ take }) {
        take('foo');
      });

      const { unmount } = render(<C />);

      expect(System.tasks).toHaveLength(3);
      unmount();
      expect(System.tasks).toHaveLength(0);
    });
  });
  describe('when we use useState hook together with useProps', () => {
    it('should get useProps callback fired every time when we update the state', async () => {
      const FetchTime = routine(async ({ render, useProps }) => {
        useProps(async ({ city }) => {
          render(<p>{ city }</p>);
        });
      });
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

      exerciseHTML(getByTestId('text'), '<p></p>');
      fireEvent.change(getByTestId('select'), { target: { value: 'Paris' } });
      exerciseHTML(getByTestId('text'), '<p>Paris</p>');
      fireEvent.change(getByTestId('select'), { target: { value: 'Sofia' } });
      exerciseHTML(getByTestId('text'), '<p>Sofia</p>');
    });
  });
});
