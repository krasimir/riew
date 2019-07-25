import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { delay, exerciseHTML } from '../__helpers__';

import Rine from '../index';

describe('Given the Rine library', () => {
  describe('when using `take`', () => {
    it('should stop the routine till the event is fired', async () => {
      const A = Rine(async ({ render, take, put }) => {
        act(() => render(<button onClick={ () => put('foo', 'bar') }>click me</button>));
        const r = await take('foo');

        expect(r).toEqual('bar');
        act(() => render(<p>Yeah</p>));
      });

      const { container, getByText } = render(<A />);

      fireEvent.click(getByText('click me'));

      await delay(1); // because of the promise that take returns
      exerciseHTML(container, `
        <p>Yeah</p>
      `);
    });
  });
});
