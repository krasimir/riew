/* eslint-disable react/prop-types, camelcase */
import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { delay, exerciseHTML } from '../__helpers__';

import Rine from '../index';

describe('Given the Rine library', () => {
  describe('when using `take` and `put`', () => {
    it(`should
      - pause the routine till the event is fired
      - allow for only one put`, async () => {
      const A = Rine(async ({ render, take, put, _rine_pending }) => {
        act(() => render(<button onClick={ () => put('xxx', 'bar') }>click me</button>));
        const r = await take('xxx');

        expect(r).toEqual('bar');
        act(() => render(<p>Yeah</p>));
        expect(_rine_pending()).toHaveLength(0);
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
      const A = Rine(async ({ render, take, put, _rine_pending }) => {
        act(() => render(<button onClick={ () => put('foo', 'bar') }>click me</button>));
        take('foo', async (r) => {
          expect(r).toEqual('bar');
          act(() => render(<p>Yeah</p>));
          expect(_rine_pending()).toHaveLength(0);
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
      const A = Rine(async ({ render, takeEvery, put }) => {
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
      const A = Rine(async ({ take, render }) => {
        await take('foo');
        act(() => render(<p>It works</p>));
      });
      const B = Rine(async ({ put }) => {
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
});
