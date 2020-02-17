/* eslint-disable react/prop-types, react/jsx-key, no-shadow */
import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { delay, exerciseHTML } from '../__helpers__';
import riew from '../react/index';
import {
  state,
  reset,
  register,
  listen,
  sput,
  put,
  sleep,
  logger,
} from '../index';

describe('Given the React riew function', () => {
  beforeEach(() => {
    reset();
  });
  describe('when we use the riew Component', () => {
    it('should always render the view at least once', () =>
      act(async () => {
        const R = riew(() => <p>Hello</p>);
        const { container } = render(<R />);

        await delay(10);
        exerciseHTML(container, '<p>Hello</p>');
      }));
    it('should properly set the name of the riew', () =>
      act(async () => {
        const routine = function* RRR() {}; // eslint-disable-line
        const R = riew(function Hi() {
          return <p>Hello</p>;
        }, routine);
        logger.enable();
        render(<R />);

        await delay(10);
        const frame = logger.now();
        const loggedItem = frame.find(({ who }) => who.id.match(/^Hi_riew/));
        expect(loggedItem).toBeDefined();
        expect(
          loggedItem.who.children[2].id.match(/^routine_RRR/)
        ).toBeTruthy();
      }));
    it(`should
      * run the routine function
      * render once by default
      * render every time when we call the "data" method`, () =>
      act(async () => {
        const routine = jest.fn().mockImplementation(function*({ render }) {
          yield sleep(5);
          render({ foo: 'bar' });
        });
        const view = jest.fn().mockImplementation(() => null);
        const R = riew(view, routine);

        render(<R />);
        await delay(10);

        expect(view).toBeCalledWithArgs([{}, {}], [{ foo: 'bar' }, {}]);
      }));
    describe('and we use a state', () => {
      it(`should
        * render with the given state data
        * re-render with a new value when we update the state
        * teardown the state when the component is unmounted`, () =>
        act(async () => {
          const s = state('foo');
          const R = riew(
            ({ state }) => <p>{state}</p>,
            function*() {
              yield sleep(5);
              yield put(s, 'bar');
            }
          ).with({ state: s });
          const { container, unmount } = render(<R />);

          await delay(3);
          exerciseHTML(container, '<p>foo</p>');
          await delay(10);
          exerciseHTML(container, '<p>bar</p>');
          unmount();
        }));
      describe('and we use a state that is exported into the grid', () => {
        it('should receive the state value and subscribe for changes', () =>
          act(async () => {
            const s = state(42);
            const s2 = state('foo');

            register('hello', s);

            const View = ({ state, hello }) => (
              <p>{(state + hello).toString()}</p>
            );
            const R = riew(View).with({ state: s2 }, 'hello');
            const { container } = render(<R />);

            await delay(3);
            exerciseHTML(container, '<p>foo42</p>');
            sput(s, '200');
            await delay(3);
            exerciseHTML(container, '<p>foo200</p>');
          }));
      });
      it('should allow us to use different statesMap', () =>
        act(async () => {
          const spy = jest.fn().mockImplementation(() => null);
          const R = riew(spy);
          const RA = R.with({ state: { foo: 'a' } });
          const RB = R.with({ state: { foo: 'b' } });

          render(<RA />);
          render(<RB />);

          await delay(5);
          expect(spy).toBeCalledWithArgs(
            [{ state: { foo: 'a' } }, {}],
            [{ state: { foo: 'b' } }, {}]
          );
          expect('with' in RA).toBe(true);
        }));
    });
    describe('and we use "props"', () => {
      it(`should
        * have access to the props
        * have to be able to subscribe to props change`, () =>
        act(async () => {
          const propsSpy = jest.fn();
          const view = jest.fn().mockImplementation(() => null);
          const I = riew(view, function*({ props }) {
            listen(props, propsSpy, { initialCall: true });
          });

          const { rerender } = render(<I foo="bar" />);

          await delay(3);
          rerender(<I zoo="mar" />);

          await delay(5);
          expect(view).toBeCalledWithArgs(
            [{ foo: 'bar' }, {}],
            [{ foo: 'bar' }, {}],
            [{ zoo: 'mar', foo: 'bar' }, {}]
          );
          expect(propsSpy).toBeCalledWithArgs(
            [{ foo: 'bar' }],
            [{ zoo: 'mar' }]
          );
        }));
    });
  });
  describe('when we want to use the React children prop', () => {
    it('should work', () =>
      act(async () => {
        const R = riew(({ children }) => children('John'));
        const { container } = render(<R>{name => `Hello ${name}!`}</R>);

        await delay(5);
        exerciseHTML(container, 'Hello John!');
      }));
  });
  describe('when we render a channel and pass a function to update the value of the channel', () => {
    it('when firing the mutation func should re-render with a new value', () =>
      act(async () => {
        const routine = function*({ render }) {
          const s = state([
            { value: 2, selected: true },
            { value: 67, selected: true },
          ]);
          const select = s.mutate((current = [], payload) =>
            current.map(item => ({
              ...item,
              selected: item.value === payload ? false : item.selected,
            }))
          );
          const change = payload => {
            sput(select, payload);
          };

          render({ value: s, change });
        };
        const View = ({ value, change }) => (
          <div>
            <div>
              value:{' '}
              {value
                .filter(({ selected }) => selected)
                .map(({ value }) => value)
                .join(', ')}
            </div>
            <button onClick={() => change(67)} type="button">
              click me
            </button>
          </div>
        );
        const R = riew(View, routine);
        const { container, getByText } = render(<R />);

        await delay(5);
        exerciseHTML(
          container,
          '<div><div>value: 2, 67</div><button type="button">click me</button></div>'
        );

        fireEvent.click(getByText(/click me/));

        await delay(10);
        exerciseHTML(
          container,
          '<div><div>value: 2</div><button type="button">click me</button></div>'
        );
      }));
  });
  describe('when we register a state', () => {
    it('should provide the value to the react component', async () =>
      act(async () => {
        const s = state(true);
        const changeToFalse = () => sput(s, false);
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
        expect(spy).toBeCalledWithArgs([true], [false]);
      }));
  });
});
