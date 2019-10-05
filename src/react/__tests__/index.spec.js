/* eslint-disable react/prop-types, react/jsx-key */
import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { delay, exerciseHTML } from '../../__helpers__';
import riew from '../index';
import { state, reset, register, subscribe } from '../../index';

describe('Given the React riew function', () => {
  beforeEach(() => {
    reset();
  });
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

        exerciseHTML(container, '<p>foo</p>');
        await delay(7);
        exerciseHTML(container, '<p>bar</p>');
        unmount();
      });
      describe('and we use a state that is exported into the grid', () => {
        it('should receive the state value and subscribe for changes', async () => {
          const [ s, setState ] = state(42);

          register('hello', s);

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
          subscribe(props.pipe(propsSpy), true);
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
  describe('when we render state and mutation made out of it', () => {
    it('when firing the mutation should re-render with a new value', () => {
      const effect = ({ state, render }) => {
        const [ value ] = state([
          { value: 2, selected: true },
          { value: 67, selected: true }
        ]);

        render({
          value,
          change: value.mutate((current, payload) => {
            return current.map(item => {
              return {
                ...item,
                selected: item.value === payload ? false : item.selected
              };
            });
          })
        });
      };
      const View = ({ value, change }) => {
        return (
          <div>
            <div>value: { value.filter(({ selected }) => selected).map(({ value }) => value).join(', ') }</div>
            <button onClick={ () => change(67) }>click me</button>
          </div>
        );
      };
      const R = riew(View, effect);
      const { container, getByText } = render(<R />);

      exerciseHTML(container, '<div><div>value: 2, 67</div><button>click me</button></div>');

      fireEvent.click(getByText(/click me/));

      exerciseHTML(container, '<div><div>value: 2</div><button>click me</button></div>');
    });
  });
});
