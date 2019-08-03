/* eslint-disable react/prop-types, camelcase */
import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { delay, exerciseHTML } from '../__helpers__';

import { routine, System, state, connect, put, take, takeEvery } from '../index';

describe('Given the Rine library', () => {
  beforeEach(() => {
    System.reset();
  });
  describe('when using `take` and `put`', () => {
    it(`should
      - pause the routine till the event is fired
      - allow for only one put`, async () => {
      const A = routine(async (render) => {
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
      expect(System.tasks).toHaveLength(0);
    });
  });
  describe('when using `take` in a fork fashion', () => {
    it(`should
      - run the callback after the put call
      - allow for only one put call`, async () => {
      const A = routine(async (render) => {
        act(() => { render(<button onClick={ () => put('foo', 'bar') }>click me</button>); });
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
      expect(System.tasks).toHaveLength(0);
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
      const A = routine(async (render) => {
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
      const A = routine(async (render) => {
        await take('foo');
        act(() => { render(<p>It works</p>); });
      });
      const B = routine(async () => {
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
      const A = routine(async (render, { isMounted }) => {
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
  describe('when we use the `store` and `connect` api', () => {
    it('should properly render the component with the accumulated props', async () => {
      const A = jest.fn().mockImplementation(function ({ foo }) {
        return <p>{ foo }</p>;
      });
      const foo = state('Hello');
      const ConnectedA = connect(A, {
        foo,
        bar() {
          return '42';
        }
      });

      render(<ConnectedA moo={ 'xxx' } />);

      expect(A).toBeCalledWith({ foo: 'Hello', bar: '42', moo: 'xxx' }, {});
    });
    it('should re-render if the state changes value (only the updated state)', async () => {
      let counter = 0;
      const A = jest.fn().mockImplementation(function ({ foo }) {
        return <p>{ foo }</p>;
      });
      const foo = state('Hello');
      const ConnectedA = connect(A, {
        foo,
        bar() {
          return ++counter;
        }
      });

      render(<ConnectedA />);
      act(() => foo.set('World'));
      expect(A.mock.calls[0]).toStrictEqual([{ foo: 'Hello', bar: 1 }, {}]);
      expect(A.mock.calls[1]).toStrictEqual([{ foo: 'World', bar: 1 }, {}]);
    });
    it('should unsubscribe if the component is unmounted', async () => {
      const A = jest.fn().mockImplementation(() => null);
      const foo = state('Hello');
      const ConnectedA = connect(A, { foo });

      const { unmount } = render(<ConnectedA />);

      expect(foo.__subscribers).toHaveLength(1);
      unmount();
      expect(foo.__subscribers).toHaveLength(0);
    });
    it('should use a reducer to update the value', async () => {
      const A = jest.fn().mockImplementation(function ({ foo }) {
        return <p>{ foo }</p>;
      });
      const foo = state('Hello', (oldValue, action) => {
        return `${ oldValue } ${ action.payload }`;
      });
      const ConnectedA = connect(A, {
        foo
      });

      render(<ConnectedA />);
      act(() => put('MY_TYPE', 'World'));

      expect(A.mock.calls[0]).toStrictEqual([{ foo: 'Hello' }, {}]);
      expect(A.mock.calls[1]).toStrictEqual([{ foo: 'Hello World' }, {}]);
    });
    it('should allow us to detach the state from the System', async () => {
      const s = state('foo');

      expect(System.controllers).toHaveLength(1);
      s.destroy();
      expect(System.controllers).toHaveLength(0);
    });
  });
});
