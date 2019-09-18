/* eslint-disable react/prop-types, camelcase */
import React, { useState } from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { delay, exerciseHTML } from '../__helpers__';
import harvester from '../harvester';

import { react, state } from '../index';

const { riew } = react;
const DummyComponent = ({ text }) => <p>{ text }</p>;

describe('Given the Riew library', () => {
  beforeEach(() => {
    harvester.reset();
  });
  describe('when we use an async effect', () => {
    it('should allow us to render multiple times', async () => {
      const A = riew(DummyComponent, async ({ render }) => {
        act(() => { render({ text: 'Hello' }); });
        await delay(20);
        act(() => { render({ text: 'world' }); });
      });

      const { queryByText, getByText } = render(<A />);

      expect(getByText('Hello')).toBeDefined();
      await delay(21);
      expect(queryByText('Hello')).toBe(null);
      expect(getByText('world')).toBeDefined();
    });
    it('should not try to re-render if the bridge is unmounted', async () => {
      const spy = jest.spyOn(console, 'error');
      const A = riew(DummyComponent, async ({ render }) => {
        await delay(10);
        act(() => { render({ text: 'world' }); });
      });

      const { unmount } = render(<A/>);

      unmount();
      await delay(21);
      expect(spy).not.toBeCalled();
      spy.mockRestore();
    });
  });
  describe('when reusing the same riew', () => {
    it('should create a separate instance', () => {
      const R = riew(props => <p>{ props.answer }</p>);

      const { container } = render(<R answer='foo' />);
      const { container: container2, rerender: rerender2 } = render(<R answer='bar' />);

      exerciseHTML(container, `
        <p>foo</p>
      `);
      exerciseHTML(container2, `
        <p>bar</p>
      `);
      rerender2(<R answer='zoo' />);
      exerciseHTML(container, `
        <p>foo</p>
      `);
      exerciseHTML(container2, `
        <p>zoo</p>
      `);
    });
  });
  describe('when we use the `isActive` method', () => {
    it('should say if the view is mounted or not', async () => {
      const spy = jest.fn();
      const A = riew(() => null, async ({ isActive }) => {
        await delay(10);
        spy(isActive());
        await delay(30);
        spy(isActive());
      });

      const { unmount } = render(<A />);

      await delay(12);
      unmount();
      await delay(40);

      expect(spy).toBeCalledWithArgs(
        [true],
        [false]
      );
    });
  });
  describe('when using riew with a hook', () => {
    it('should keep the hook working', async () => {
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

      fireEvent.change(getByTestId('input'), { target: { value: 'foobar' } });
      expect(getByText('foobar')).toBeDefined();
    });
  });
  describe('when we use useState hook together with props', () => {
    it('should get props callback fired every time when we update the state', async () => {
      const FetchTime = riew(
        ({ location }) => location ? <p>{ location }</p> : null,
        async ({ render, props }) => {
          props.map(({ city }) => ({ location: city })).pipe(render).subscribe(true);
        }
      );
      const App = function () {
        const [ city, setCity ] = useState('');

        return (
          <React.Fragment>
            <select onChange={ (e) => setCity(e.target.value) } data-testid='select' >
              <option value=''>pick a city</option>
              <option value='London'>London</option>
              <option value='Paris'>Paris</option>
              <option value='Barcelona'>Barcelona</option>
              <option value='Sofia'>Sofia</option>
            </select>
            <div data-testid='text'><FetchTime city={ city } /></div>
          </React.Fragment>
        );
      };

      const { getByTestId } = render(<App />);

      exerciseHTML(getByTestId('text'), '');
      fireEvent.change(getByTestId('select'), { target: { value: 'Paris' } });
      exerciseHTML(getByTestId('text'), '<p>Paris</p>');
      fireEvent.change(getByTestId('select'), { target: { value: 'Sofia' } });
      exerciseHTML(getByTestId('text'), '<p>Sofia</p>');
    });
  });
  describe('when we mutate the state and have a selector subscribed to it', () => {
    it('should re-render the view with the new data', async () => {
      const repos = state([ { id: 'a', selected: false }, { id: 'b', selected: true } ]);
      const selector = repos.map(list => list.filter(({ selected }) => selected));
      const change = repos.mutate((list, id) => {
        return list.map((repo) => {
          if (repo.id === id) {
            return {
              ...repo,
              prs: ['foo', 'bar']
            };
          }
          return repo;
        });
      });
      const View = ({ selector }) => {
        return (
          <div>
            { selector.map(({ id, prs }) => <p key={ id }>{ id }: { prs ? prs.join(',') : 'nope' }</p>) }
          </div>
        );
      };
      const controller = async ({ change }) => {
        await delay(2);
        act(() => { change('b'); });
      };
      const R = riew(View, controller).with({ selector, change });
      const { container } = render(<R />);

      exerciseHTML(container, `
        <div>
          <p>b: nope</p>
        </div>
      `);
      await delay(10);
      exerciseHTML(container, `
        <div>
          <p>b: foo,bar</p>
        </div>
      `);
    });
  });
});
