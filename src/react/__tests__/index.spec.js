/* eslint-disable react/prop-types, react/jsx-key */
import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { delay, exerciseHTML } from '../../__helpers__';
import riew from '../index';
import { state, reset, register, chan, buffer } from '../../index';

describe('Given the React riew function', () => {
  beforeEach(() => {
    reset();
  });
  describe('when we use the riew Component', () => {
    it('should always render the view at least once', () => {
      return act(async () => {
        const R = riew(() => <p>Hello</p>);
        const { container } = render(<R />);

        await delay(10);
        exerciseHTML(container, '<p>Hello</p>');
      });
    });
    it(`should
      * run the routine function
      * render once by default
      * render every time when we call the "data" method`, () => {
      return act(async () => {
        const routine = jest.fn().mockImplementation(async ({ render }) => {
          await delay(5);
          render({ foo: 'bar' });
        });
        const view = jest.fn().mockImplementation(() => null);
        const R = riew(view, routine);

        render(<R />);
        await delay(10);

        expect(view).toBeCalledWithArgs([ {}, {} ], [ { foo: 'bar' }, {} ]);
      });
    });
    describe('and we use a state', () => {
      it(`should
        * render with the given state data
        * re-render with a new value when we update the state
        * teardown the state when the component is unmounted`, () => {
        return act(async () => {
          const s = chan();
          s.put('foo');
          const R = riew(({ state }) => <p>{ state }</p>, async function () {
            await delay(5);
            s.put('bar');
          }).with({ state: s });
          const { container, unmount } = render(<R />);

          await delay(3);
          exerciseHTML(container, '<p>foo</p>');
          await delay(10);
          exerciseHTML(container, '<p>bar</p>');
          unmount();
        });
      });
      describe('and we use a state that is exported into the grid', () => {
        it('should receive the state value and subscribe for changes', () => {
          return act(async () => {
            const s = chan();
            s.put(42);
            const s2 = chan();
            s2.put('foo');

            register('hello', s);

            const View = ({ state, hello }) => {
              return <p>{ (state + hello).toString() }</p>;
            };
            const R = riew(View).with({ state: s2 }, 'hello');
            const { container } = render(<R />);

            await delay(3);
            exerciseHTML(container, '<p>foo42</p>');
            s.put('200');
            await delay(3);
            exerciseHTML(container, '<p>foo200</p>');
          });
        });
      });
      it('should allow us to use different statesMap', () => {
        return act(async () => {
          const spy = jest.fn().mockImplementation(() => null);
          const R = riew(spy);
          const RA = R.with({ state: { foo: 'a' } });
          const RB = R.with({ state: { foo: 'b' } });

          render(<RA />);
          render(<RB />);

          await delay(5);
          expect(spy).toBeCalledWithArgs([ { state: { foo: 'a' } }, {} ], [ { state: { foo: 'b' } }, {} ]);
          expect('with' in RA).toBe(true);
        });
      });
    });
    describe('and we use "props"', () => {
      it(`should
        * have access to the props
        * have be able to subscribe to props change`, () => {
        return act(async () => {
          const propsSpy = jest.fn();
          const view = jest.fn().mockImplementation(() => null);
          const I = riew(view, function ({ props }) {
            props.subscribe(propsSpy);
          });

          const { rerender } = render(<I foo='bar' />);

          await delay(3);
          rerender(<I zoo='mar' />);

          await delay(5);
          expect(view).toBeCalledWithArgs([ { foo: 'bar' }, {} ], [ { foo: 'bar' }, {} ], [ { zoo: 'mar', foo: 'bar' }, {} ]);
          expect(propsSpy).toBeCalledWithArgs([ { foo: 'bar' } ], [ { zoo: 'mar' } ]);
        });
      });
    });
  });
  describe('when we want to use the React children prop', () => {
    it('should work', () => {
      return act(async () => {
        const R = riew(({ children }) => children('John'));
        const { container } = render(<R>{ name => `Hello ${name}!` }</R>);

        await delay(5);
        exerciseHTML(container, 'Hello John!');
      });
    });
  });
  describe('when we render a channel and pass a function to update the value of the channel', () => {
    it('when firing the mutation func should re-render with a new value', () => {
      return act(async () => {
        const routine = ({ render }) => {
          const value = chan(
            buffer.reducer((current = [], payload) => {
              if (typeof payload === 'number') {
                return current.map(item => {
                  return {
                    ...item,
                    selected: item.value === payload ? false : item.selected
                  };
                });
              }
              return [ ...current, payload ];
            })
          );
          value.put({ value: 2, selected: true });
          value.put({ value: 67, selected: true });
          const change = payload => value.put(payload);

          render({ value, change });
        };
        const View = ({ value, change }) => {
          return (
            <div>
              <div>
                value:{ ' ' }
                { value
                  .filter(({ selected }) => selected)
                  .map(({ value }) => value)
                  .join(', ') }
              </div>
              <button onClick={ () => change(67) }>click me</button>
            </div>
          );
        };
        const R = riew(View, routine);
        const { container, getByText } = render(<R />);

        await delay(5);
        exerciseHTML(container, '<div><div>value: 2, 67</div><button>click me</button></div>');

        fireEvent.click(getByText(/click me/));

        await delay(10);
        exerciseHTML(container, '<div><div>value: 2</div><button>click me</button></div>');
      });
    });
  });
  describe('when we register a channel', () => {
    it('should provide the value to the react component', async () => {
      return act(async () => {
        const s = chan();
        s.put(true);
        const changeToFalse = () => s.put(false);
        const spy = jest.fn();

        register('whee', s);

        const Component = riew(function ParentParentParent({ whee }) {
          spy(whee);
          return whee ? 'foo' : 'bar';
        }).with('whee');

        const { container } = render(<Component />);

        await delay();
        exerciseHTML(container, 'foo');
        changeToFalse();
        await delay();
        exerciseHTML(container, 'bar');
        expect(spy).toBeCalledWithArgs([ true ], [ false ]);
      });
    });
  });
});
