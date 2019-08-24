/* eslint-disable no-return-assign */
import React, { useState, useEffect } from 'react';
import { getFuncName } from '../utils';
import { createState as state } from '../state';

var ids = 0;
const getId = () => `@@r${ ++ids }`;

export function createRoutineInstance(routineFunc) {
  let id = getId();
  let mounted = false;
  let outerProps = state();
  let setOuterProps = outerProps.mutate();
  let permanentProps = {};
  let funcsToCallOnUnmount = [];
  let onRendered;

  function isMounted() {
    return mounted;
  }
  function preserveProps(props) {
    return permanentProps = {...permanentProps, ...props};
  }

  const instance = {
    __rine: 'routine',
    id,
    name: getFuncName(routineFunc),
    isMounted,
    in(initialProps, Component, setContent) {
      mounted = true;
      setOuterProps(initialProps);
      routineFunc(
        {
          render(props) {
            if (!mounted) return Promise.resolve();
            if (typeof props === 'string' || typeof props === 'number' || React.isValidElement(props)) {
              setContent(props);
            } else if (props === null) {
              setContent(() => null);
            } else {
              setContent(<Component {...preserveProps(props)}/>);
            }
            return new Promise(done => (onRendered = done));
          },
          props: outerProps.stream,
          state(...args) {
            const s = state(...args);

            funcsToCallOnUnmount.push(s.teardown);
            return s;
          },
          isMounted
        }
      );
    },
    updated(newProps) {
      setOuterProps(newProps);
    },
    rendered() {
      if (onRendered) onRendered();
    },
    out() {
      mounted = false;
      funcsToCallOnUnmount.forEach(f => f());
      funcsToCallOnUnmount = [];
    }
  };

  funcsToCallOnUnmount.push(outerProps.teardown);

  return instance;
}

export default function routine(
  routineFunc,
  Component = () => null,
  options = { createRoutineInstance }
) {
  const RoutineBridge = function (outerProps) {
    let [ instance, setInstance ] = useState(null);
    let [ content, setContent ] = useState(null);

    // updating props
    useEffect(() => {
      if (instance) instance.updated(outerProps);
    }, [ outerProps ]);

    // to support sync rendering (i.e. await render(...))
    useEffect(() => {
      if (instance) instance.rendered();
    }, [ content ]);

    // mounting
    useEffect(() => {
      setInstance(instance = options.createRoutineInstance(routineFunc));

      instance.in(outerProps, Component, setContent);

      return function () {
        instance.out();
      };
    }, []);

    return content;
  };

  RoutineBridge.displayName = `Routine(${ getFuncName(routineFunc) })`;

  return RoutineBridge;
}
