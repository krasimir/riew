/* eslint-disable react/prop-types */
import React from 'react';
import { render, act } from '@testing-library/react';
import System from '../System';
import state from '../state';

import connect from '../connect';
import { exerciseHTML } from '../../__helpers__';

describe('Given the connect method', () => {
  beforeEach(() => {
    System.reset();
  });
  describe('when call it', () => {
    it(`should return a React component that
      * gets rendered with accumulated props from the state controllers
      * gets rendered with the given custom props
      * gets re-rendered when the state controllers change value
      * gest detached from the state controllers if it gets unmounted`, () => {
      const C = jest.fn().mockImplementation(function (props) {
        return <p>{ props.a }{ props.b }</p>;
      });
      const A = state('a');
      const B = state('b');

      const Connected = connect(C, { a: A, b: B, foo: 'bar' });

      const { unmount, rerender } = render(<Connected zar='mar' />);

      act(() => A.set('c'));
      act(() => B.set('d'));
      act(() => rerender(<Connected nom='bom' />));
      unmount();
      act(() => A.set('e'));
      act(() => B.set('e'));

      expect(C).toBeCalledTimes(4);
      expect(C.mock.calls[0]).toStrictEqual([ { a: 'a', b: 'b', foo: 'bar', zar: 'mar'}, {} ]);
      expect(C.mock.calls[1]).toStrictEqual([ { a: 'c', b: 'b', foo: 'bar', zar: 'mar'}, {} ]);
      expect(C.mock.calls[2]).toStrictEqual([ { a: 'c', b: 'd', foo: 'bar', zar: 'mar'}, {} ]);
      expect(C.mock.calls[3]).toStrictEqual([ { a: 'c', b: 'd', foo: 'bar', nom: 'bom'}, {} ]);
    });
  });
  describe('when we connect a component to state that do not change and we use reducers', () => {
    it('should not re-render the component', () => {
      const spy = jest.fn();
      const C = function (props) {
        spy(props);
        return <p>{ props.value.message }</p>;
      };
      const s1 = state({ message: 'a' }, (value, action) => {
        return { ...value };
      });
      const s2 = state('b', (value, action) => {
        if (action.type === 'update b') {
          return action.payload;
        }
        return value;
      });
      const Connected = connect(C, { value: s1 });

      const { container } = render(<Connected />);

      act(() => System.put('update b', 'new value of b'));

      expect(s2.get()).toBe('new value of b');
      exerciseHTML(container, `
        <p>a</p>
      `);
      expect(spy).toBeCalledTimes(1);
      expect(spy.mock.calls[0]).toStrictEqual([ { value: { message: 'a' } }]);
    });
  });
});
