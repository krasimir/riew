/* eslint-disable react/prop-types, camelcase */
import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { delay, exerciseHTML } from '../__helpers__';

import { Routine, System, Partial } from '../index';

describe('Given the Routine library', () => {
  describe('when using `take` and `put`', () => {
    it(`should
      - pause the routine till the event is fired
      - allow for only one put`, async () => {
      const A = Routine(async ({ render, take, put }) => {
        act(() => render(<button onClick={ () => put('xxx', 'bar') }>click me</button>));
        const r = await take('xxx');

        expect(r).toEqual('bar');
        act(() => render(<p>Yeah</p>));
      });

      const { container, getByText } = render(<A />);

      fireEvent.click(getByText('click me'));

      await delay(1);
      exerciseHTML(container, `
        <p>Yeah</p>
      `);
      expect(System.debug().pending).toHaveLength(0);
    });
  });
  describe('when using `take` in a fork fashion', () => {
    it(`should
      - run the callback after the put call
      - allow for only one put call`, async () => {
      const A = Routine(async ({ render, take, put }) => {
        act(() => render(<button onClick={ () => put('foo', 'bar') }>click me</button>));
        take('foo', async (r) => {
          expect(r).toEqual('bar');
          act(() => render(<p>Yeah</p>));
        });
      });

      const { container, getByText } = render(<A />);

      fireEvent.click(getByText('click me'));

      exerciseHTML(container, `
        <p>Yeah</p>
      `);
      expect(System.debug().pending).toHaveLength(0);
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
      const A = Routine(async ({ render, takeEvery, put }) => {
        let counter = 0;
        let renderCounter = () => act(() => render(<Counter value={ counter } onClick={ () => put('foo', 2) } />));

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
      const A = Routine(async ({ take, render }) => {
        await take('foo');
        act(() => render(<p>It works</p>));
      });
      const B = Routine(async ({ put }) => {
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
  describe('when using a Partial', () => {
    it('should re-render when the value is updated', async () => {
      const A = Routine(async ({ render }) => {
        const Error = Partial((error) => {
          return error ? <div>{ error }</div> : <span>No error</span>;
        });

        Error.set('Foo');

        render(
          <React.Fragment>
            <Error />
            <h1>Hey</h1>
          </React.Fragment>
        );

        await delay(20);
        act(() => Error.set('Bar'));
        expect(Error.get()).toEqual('Bar');
      });

      const { container } = render(<A />);

      exerciseHTML(container, `
        <div>Foo</div>
        <h1>Hey</h1>
      `);
      await delay(21);
      exerciseHTML(container, `
        <div>Bar</div>
        <h1>Hey</h1>
      `);
    });
  });
});
