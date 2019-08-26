/* eslint-disable react/prop-types, react/jsx-key */
import React from 'react';
import { render, act } from '@testing-library/react';
import { delay, exerciseHTML } from '../../__helpers__';
import routine from '../index';

describe('Given the React routine function', () => {
  describe('when we use the routine Component', () => {
    describe('and we use a state', () => {
      it(`should
        * register the state teardown function
        * teardown the state when the component is unmounted`, () => {
        let ss;
        const R = routine(function ({ render, state }) {
          const s = ss = state('foo');

          s.stream.pipe(() => {});
          render(<p>{ s.map()() }</p>);
        });
        const { container, unmount } = render(<R />);

        exerciseHTML(container, `
          <p>foo</p>
        `);
        expect(ss.__listeners()).toHaveLength(1);
        expect(ss.map()()).toBe('foo');
        unmount();
        expect(ss.__listeners()).toHaveLength(0);
      });
    });
    describe('and we use "props"', () => {
      it(`should
        * fire the callback at least once
        * fire the callback on every props change`, () => {
        const propsSpy = jest.fn();
        const I = routine(function ({ props }) {
          props.stream.pipe(propsSpy)();
          expect(props.get()).toStrictEqual({ foo: 'bar' });
        });

        const { rerender } = render(<I foo='bar' />);

        rerender(<I zoo='mar' />);

        expect(propsSpy).toBeCalledTimes(2);
        expect(propsSpy.mock.calls[0]).toStrictEqual([ { foo: 'bar' } ]);
        expect(propsSpy.mock.calls[1]).toStrictEqual([ { zoo: 'mar' } ]);
      });
    });
    describe('and when we need permanent props', () => {
      it('should preserve a prop for the next render', async () => {
        const compSpy = jest.fn().mockImplementation(() => null);
        const I = routine(async function ({ render }) {
          act(() => {
            render({ foo: 'bar' });
          });
          await delay(10);
          act(() => {
            render();
          });
        }, compSpy);

        render(<I />);

        await delay(11);
        expect(compSpy).toBeCalledTimes(2);
        expect(compSpy.mock.calls[0]).toStrictEqual([ { foo: 'bar' }, {} ]);
        expect(compSpy.mock.calls[1]).toStrictEqual([ { foo: 'bar' }, {} ]);
      });
    });
    it('should render nothing by default', () => {
      const R = routine(() => {}, () => <p>Hello</p>);
      const { container } = render(<R />);

      exerciseHTML(container, '');
    });
    it('should render the component if we call the `render` function', () => {
      const spy = jest.fn().mockImplementation(() => null);
      const R = routine(({ render }) => render({ c: 'd' }), spy);

      render(<R a='b'/>);
      expect(spy).toBeCalledWith({ c: 'd' }, {});
    });
    it('should not re-render the Component if the bridge is re-rendered', () => {
      const spy = jest.fn().mockImplementation(() => null);
      const R = routine(({ render }) => render(), spy);

      const { rerender } = render(<R />);

      rerender(<R />);
      expect(spy).toBeCalledTimes(1);
    });
    describe('and we pass a React element to the render method', () => {
      it(`should
        * trigger a new rendering but with the passed element
        * then later when called again with props should trigger
          rendering of the original outer component`, async () => {
        const Component = jest.fn().mockImplementation(({ answer }) => <div>{ answer }</div>);
        const C = routine(async ({ render }) => {
          render(<p>It works</p>);
          await delay(10);
          act(() => {
            render({ answer: 42 });
          });
        }, Component);
        const { container } = render(<C />);

        exerciseHTML(container, '<p>It works</p>');
        await delay(20);
        exerciseHTML(container, '<div>42</div>');
      });
    });
    describe('and we pass a string or a number', () => {
      it(`should
        * trigger a new rendering but with the passed value
        * then later when called again with props should trigger
          rendering of the original outer component`, async () => {
        const Component = jest.fn().mockImplementation(({ answer }) => <div>{ answer }</div>);
        const C = routine(async ({ render }) => {
          render('Hello world');
          await delay(10);
          act(() => {
            render({ answer: 42 });
          });
        }, Component);
        const { container } = render(<C />);

        exerciseHTML(container, 'Hello world');
        await delay(20);
        exerciseHTML(container, `
          <div>42</div>
        `);
      });
    });
    describe('and we pass null to the render method', () => {
      it('should render nothing', () => {
        const C = routine(({ render }) => {
          render(null);
        });
        const { container } = render(<C />);

        exerciseHTML(container, '');
      });
    });
  });
});
