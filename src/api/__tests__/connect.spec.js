/* eslint-disable react/prop-types */
import React from 'react';
import { render, act } from '@testing-library/react';
import System from '../System';
import state from '../state';

import { connect, mapStateToProps } from '../connect';
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
  describe('when we use a translate function', () => {
    it('should get the accumulated props and pass them through the translate function', () => {
      const C = jest.fn().mockImplementation(() => null);
      const s1 = state('foo');
      const s2 = state('bar');
      const Connected = connect(C, { s1, s2 }, function ({ s1, s2 }) {
        return {
          s3: s1 + '_xxx',
          s4: s2 + '_xxx'
        };
      });

      render(<Connected />);
      act(() => s1.set('oof'));
      act(() => s2.set('rab'));

      expect(C).toBeCalledTimes(3);
      expect(C.mock.calls[0]).toStrictEqual([
        { s3: 'foo_xxx', s4: 'bar_xxx' },
        {}
      ]);
      expect(C.mock.calls[1]).toStrictEqual([
        { s3: 'oof_xxx', s4: 'bar_xxx' },
        {}
      ]);
      expect(C.mock.calls[2]).toStrictEqual([
        { s3: 'oof_xxx', s4: 'rab_xxx' },
        {}
      ]);
    });
  });
  describe('when we use mapStateToProps', () => {
    it('should call the function at least once and then every time when the state changes', () => {
      const s1 = state('foo');
      const s2 = state('bar');
      const spy = jest.fn();

      mapStateToProps({ s1, s2 }, spy);
      s1.set('oof');
      s2.set('rab');

      expect(spy).toBeCalledTimes(3);
      expect(spy.mock.calls[0]).toStrictEqual([{ s1: 'foo', s2: 'bar' }]);
      expect(spy.mock.calls[1]).toStrictEqual([{ s1: 'oof', s2: 'bar' }]);
      expect(spy.mock.calls[2]).toStrictEqual([{ s1: 'oof', s2: 'rab' }]);
    });
    it('should return a unsubscribe function', () => {
      const s1 = state('foo');
      const s2 = state('bar');
      const spy = jest.fn();

      const unsubscribe = mapStateToProps({ s1, s2, foo: 'boo' }, spy);

      expect(unsubscribe).toStrictEqual(expect.any(Function));
      expect(s1.__subscribers()).toHaveLength(1);
      expect(s2.__subscribers()).toHaveLength(1);
      unsubscribe();
      expect(s1.__subscribers()).toHaveLength(0);
      expect(s2.__subscribers()).toHaveLength(0);
    });
  });
});
