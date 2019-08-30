/* eslint-disable react/prop-types, react/jsx-key */
import React from 'react';
import { render, act } from '@testing-library/react';
import { delay, exerciseHTML } from '../../__helpers__';
import riew from '../index';

describe('Given the React riew function', () => {
  describe('when we use the riew Component', () => {
    it('should always render the view at least once', () => {
      const R = riew(() => <p>Hello</p>);
      const { container } = render(<R />);

      exerciseHTML(container, '<p>Hello</p>');
    });
    it(`should
      * run the controller function
      * render once by default
      * render every time when we call the "render" method`, async () => {
      const controller = jest.fn().mockImplementation(async ({ render }) => {
        await delay(5);
        act(() => { render({ foo: 'bar' }); });
      });
      const view = jest.fn().mockImplementation(() => null);
      const R = riew(view, controller);

      render(<R />);
      await delay(7);

      expect(view).toBeCalledTimes(2);
      expect(view.mock.calls[0]).toStrictEqual([ {}, {}]);
      expect(view.mock.calls[1]).toStrictEqual([ { foo: 'bar' }, {}]);
    });
    describe('and we use a state', () => {
      it(`should
        * render with the given state data
        * re-render with a new value when we update the state
        * teardown the state when the component is unmounted`, async () => {
        const R = riew(
          ({ state }) => <p>{ state }</p>,
          async function ({ state }) {
            await delay(5);
            act(() => state.set('bar'));
          }
        ).withState({ state: 'foo' });
        const { container, unmount } = render(<R />);

        exerciseHTML(container, '<p>foo</p>');
        await delay(7);
        exerciseHTML(container, '<p>bar</p>');
        unmount();
      });
      it('should allow us to render same riew multiple times', async () => {
        const spy = jest.fn().mockImplementation(() => null);
        const R = riew(
          spy,
          async function ({ state, props }) {
            state.set({ a: state.get().a + props.get().b });
          }
        ).withState({ state: { a: 10 } });

        render(<R b={ 5 }/>);
        render(<R b={ 10 }/>);

        expect(spy).toBeCalledTimes(2);
        expect(spy.mock.calls[0]).toStrictEqual([ { state: { a: 15 } }, {}]);
        expect(spy.mock.calls[1]).toStrictEqual([ { state: { a: 20 } }, {}]);
      });
      it('should allow us to use different statesMap', () => {
        const spy = jest.fn().mockImplementation(() => null);
        const R = riew(spy);
        const RA = R.with({ state: { foo: 'a' } });
        const RB = R.with({ state: { foo: 'b' } });

        render(<RA />);
        render(<RB />);

        expect(spy).toBeCalledTimes(2);
        expect(spy.mock.calls[0]).toStrictEqual([ { state: { foo: 'a' } }, {}]);
        expect(spy.mock.calls[1]).toStrictEqual([ { state: { foo: 'b' } }, {}]);
        expect('with' in RA).toBe(true);
      });
    });
    describe('and we use "props"', () => {
      it(`should
        * have access to the props
        * have be able to subscribe to props change`, () => {
        const propsSpy = jest.fn();
        const I = riew(() => null, function ({ props }) {
          expect(props.get()).toStrictEqual({ foo: 'bar' });
          props.stream.pipe(propsSpy);
        });

        const { rerender } = render(<I foo='bar' />);

        rerender(<I zoo='mar' />);

        expect(propsSpy).toBeCalledTimes(2);
        expect(propsSpy.mock.calls[0]).toStrictEqual([ { foo: 'bar' } ]);
        expect(propsSpy.mock.calls[1]).toStrictEqual([ { foo: 'bar', zoo: 'mar' } ]);
      });
    });
  });
});
