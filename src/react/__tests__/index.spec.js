/* eslint-disable react/prop-types, react/jsx-key */
import React from 'react';
import { render, act } from '@testing-library/react';
import { delay, exerciseHTML } from '../../__helpers__';
import riew from '../index';
import { createState as state } from '../../state';

describe('Given the React riew function', () => {
  describe('when we use the riew Component', () => {
    it('should always render the view at least once', () => {
      const R = riew(() => <p>Hello</p>);
      const { container } = render(<R />);

      exerciseHTML(container, '<p>Hello</p>');
    });
    it(`should
      * run the effect function
      * render once by default
      * render every time when we call the "render" method`, async () => {
      const effect = jest.fn().mockImplementation(async ({ render }) => {
        await delay(5);
        act(() => { render({ foo: 'bar' }); });
      });
      const view = jest.fn().mockImplementation(() => null);
      const R = riew(view, effect);

      render(<R />);
      await delay(7);

      expect(view).toBeCalledWithArgs(
        [ {}, {}],
        [ { foo: 'bar' }, {}]
      );
    });
    describe('and we use a state', () => {
      it(`should
        * render with the given state data
        * re-render with a new value when we update the state
        * teardown the state when the component is unmounted`, async () => {
        const [ s, setState ] = state('foo');
        const R = riew(
          ({ state }) => <p>{ state }</p>,
          async function ({ state }) {
            await delay(5);
            act(() => { setState('bar'); });
          }
        ).with({ state: s });
        const { container, unmount } = render(<R />);

        expect(s.__listeners()).toHaveLength(1);
        exerciseHTML(container, '<p>foo</p>');
        await delay(7);
        exerciseHTML(container, '<p>bar</p>');
        unmount();
        expect(s.__listeners()).toHaveLength(0);
      });
      describe('and we use a state that is exported into the registry', () => {
        it('should receive the state value and subscribe for changes', async () => {
          const [ , setState ] = state(42).export('hello');
          const View = ({ state, hello }) => {
            return <p>{ state + hello }</p>;
          };
          const R = riew(View).with({ state: state('foo') }, 'hello');
          const { container } = render(<R />);

          exerciseHTML(container, '<p>foo42</p>');
          act(() => { setState('200'); });
          exerciseHTML(container, '<p>foo200</p>');
        });
      });
      it('should allow us to use different statesMap', () => {
        const spy = jest.fn().mockImplementation(() => null);
        const R = riew(spy);
        const RA = R.with({ state: { foo: 'a' } });
        const RB = R.with({ state: { foo: 'b' } });

        render(<RA />);
        render(<RB />);

        expect(spy).toBeCalledWithArgs(
          [ { state: { foo: 'a' } }, {}],
          [ { state: { foo: 'b' } }, {}]
        );
        expect('with' in RA).toBe(true);
      });
    });
    describe('and we use "props"', () => {
      it(`should
        * have access to the props
        * have be able to subscribe to props change`, () => {
        const propsSpy = jest.fn();
        const I = riew(() => null, function ({ props }) {
          props.pipe(propsSpy).subscribe(true);
        });

        const { rerender } = render(<I foo='bar' />);

        rerender(<I zoo='mar' />);

        expect(propsSpy).toBeCalledWithArgs(
          [ { foo: 'bar' } ],
          [ { foo: 'bar', zoo: 'mar' } ]
        );
      });
    });
  });
  describe('when we want to use the React children prop', () => {
    it('should work', () => {
      const R = riew(({ children }) => children('John'));
      const { container } = render(
        <R>
          {
            (name) => `Hello ${ name }!`
          }
        </R>
      );

      exerciseHTML(container, 'Hello John!');
    });
  });
});
