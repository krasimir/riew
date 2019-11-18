/* eslint-disable react/prop-types, camelcase */
import React, { useState } from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { delay, exerciseHTML } from '../__helpers__';
import { reset, register, chan, buffer } from '../index';

import { react, state } from '../index';

const { riew } = react;
const DummyComponent = ({ text }) => <p>{ text }</p>;

describe('Given the Riew library', () => {
  beforeEach(() => {
    reset();
  });
  describe('when we use an async effect', () => {
    it('should allow us to render multiple times', () => {
      return act(async () => {
        const A = riew(DummyComponent, async ({ data }) => {
          data({ text: 'Hello' });
          await delay(20);
          data({ text: 'world' });
        });

        const { queryByText, getByText } = render(<A />);

        await delay(3);
        expect(getByText('Hello')).toBeDefined();
        await delay(21);
        expect(queryByText('Hello')).toBe(null);
        expect(getByText('world')).toBeDefined();
      });
    });
    it('should not try to re-render if the bridge is unmounted', () => {
      return act(async () => {
        const spy = jest.spyOn(console, 'error');
        const A = riew(DummyComponent, async ({ data }) => {
          await delay(10);
          data({ text: 'world' });
        });

        const { unmount } = render(<A />);
        await delay(3);
        unmount();
        await delay(21);
        expect(spy).not.toBeCalled();
        spy.mockRestore();
      });
    });
  });
  describe('when reusing the same riew', () => {
    it('should create a separate instance', () => {
      return act(async () => {
        const R = riew(props => <p>{ props.answer }</p>);

        const { container } = render(<R answer='foo' />);
        const { container: container2, rerender: rerender2 } = render(<R answer='bar' />);

        await delay(3);

        exerciseHTML(container, `<p>foo</p>`);
        exerciseHTML(container2, `<p>bar</p>`);
        rerender2(<R answer='zoo' />);
        await delay(3);
        exerciseHTML(container, `<p>foo</p>`);
        exerciseHTML(container2, `<p>zoo</p>`);
      });
    });
  });
  describe('when using riew with a hook', () => {
    it('should keep the hook working', () => {
      return act(async () => {
        const Input = function () {
          const [ text, setText ] = useState('');

          return (
            <React.Fragment>
              <p>{ text }</p>
              <input onChange={ e => setText(e.target.value) } data-testid='input' />
            </React.Fragment>
          );
        };
        const Form = riew(() => (
          <form>
            <Input />
          </form>
        ));

        const { getByTestId, getByText } = render(<Form />);
        await delay(2);
        fireEvent.change(getByTestId('input'), { target: { value: 'foobar' } });
        await delay(2);
        expect(getByText('foobar')).toBeDefined();
      });
    });
  });
  describe('when we use useState hook together with props', () => {
    it('should get props callback fired every time when we update the state', () => {
      return act(async () => {
        const FetchTime = riew(
          ({ location }) => (location ? <p>{ location }</p> : null),
          async ({ data, props }) => {
            props.takeEvery(({ city }) => data({ location: city }));
          }
        );
        const App = function () {
          const [ city, setCity ] = useState('');

          return (
            <React.Fragment>
              <select onChange={ e => setCity(e.target.value) } data-testid='select'>
                <option value=''>pick a city</option>
                <option value='London'>London</option>
                <option value='Paris'>Paris</option>
                <option value='Barcelona'>Barcelona</option>
                <option value='Sofia'>Sofia</option>
              </select>
              <div data-testid='text'>
                <FetchTime city={ city } />
              </div>
            </React.Fragment>
          );
        };

        const { getByTestId } = render(<App />);

        await delay(2);
        exerciseHTML(getByTestId('text'), '');
        fireEvent.change(getByTestId('select'), { target: { value: 'Paris' } });
        await delay(2);
        exerciseHTML(getByTestId('text'), '<p>Paris</p>');
        fireEvent.change(getByTestId('select'), { target: { value: 'Sofia' } });
        await delay(2);
        exerciseHTML(getByTestId('text'), '<p>Sofia</p>');
      });
    });
  });
  describe('when we mutate the state and have a selector subscribed to it', () => {
    it('should re-render the view with the new data', () => {
      return act(async () => {
        const repos = chan(
          buffer.reducer((list, id) => {
            return list.map(repo => {
              if (repo.id === id) {
                return {
                  ...repo,
                  prs: [ 'foo', 'bar' ]
                };
              }
              return repo;
            });
          })
        ).from([ { id: 'a', selected: false }, { id: 'b', selected: true } ]);
        const selector = repos.map(list => list.filter(({ selected }) => selected));
        const change = id => repos.put(id);
        const View = ({ selector }) => {
          return (
            <div>
              { selector.map(({ id, prs }) => (
                <p key={ id }>
                  { id }: { prs ? prs.join(',') : 'nope' }
                </p>
              )) }
            </div>
          );
        };
        const controller = async ({ change }) => {
          await delay(2);
          change('b');
        };
        const R = riew(View, controller).with({ selector, change });
        const { container } = render(<R />);

        await delay(3);
        exerciseHTML(
          container,
          `
        <div>
          <p>b: nope</p>
        </div>
      `
        );
        await delay(10);
        exerciseHTML(
          container,
          `
        <div>
          <p>b: foo,bar</p>
        </div>
      `
        );
      });
    });
  });
  describe('when we have a forked effect passed to a React component', () => {
    describe('and we update the main effect', () => {
      it('should re-render the react component with the forked effect data', () => {
        return act(async () => {
          const ch = state([ 15, 4, 12 ]);
          const [ , setRepos ] = ch;
          const moreThen10 = ch.map(nums => nums.filter(n => n > 10));
          const Component = jest.fn().mockImplementation(() => null);
          const R = riew(Component).with({ moreThen10 });

          render(<R />);
          await delay(3);
          setRepos([ 5, 6, 7, 120 ]);
          await delay(3);
          expect(Component).toBeCalledWithArgs([ {}, {} ], [ { moreThen10: [ 15, 12 ] }, {} ], [ { moreThen10: [ 120 ] }, {} ]);
        });
      });
    });
  });
  describe('when we have a an effect passed to two React component', () => {
    describe('and unmount then update the state', () => {
      xit('should not produce an error', () => {
        return act(async () => {
          const s = state(true);
          const changeToFalse = () => s.put(false);

          register('whee', s);

          const ParentParentParent = riew(function ParentParentParent({ whee }) {
            console.log('1', whee);
            return whee ? <ParentParent /> : 'boo';
          }).with('whee');
          const ParentParent = riew(function ParentParent({ whee }) {
            console.log('2', whee);
            return whee ? <Parent /> : 'boo';
          }).with('whee');
          const Parent = riew(function Parent() {
            return <Component />;
          });
          const Component = riew(function Component({ whee }) {
            return `Whee is ${whee}`;
          }).with('whee');

          const { container } = render(<ParentParentParent />);

          await delay(10);
          exerciseHTML(container, 'Whee is true');
          changeToFalse();
          changeToFalse();
          await delay(3);
          exerciseHTML(container, 'boo');
        });
      });
    });
  });
});
