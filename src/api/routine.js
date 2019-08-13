/* eslint-disable no-return-assign */
import React, { useState, useEffect } from 'react';
import System from './System';
import { getFuncName } from '../utils';
import createState, { teardownAction } from './state';

var ids = 0;
const getId = () => `@@r${ ++ids }`;
const unmountedAction = id => `${ id }_unmounted`;

export function createRoutineInstance(routineFunc) {
  let id = getId();
  let mounted = false;
  let tasksToRemove = [];
  let permanentProps = {};
  let outerProps = createState();
  let actionsToFire = [ teardownAction(outerProps.id) ];
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
      outerProps.set(initialProps);
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
          useProps(callback) {
            outerProps.subscribe(callback);
            callback(outerProps.get());
          },
          put(...args) {
            return System.put(...args);
          },
          take(...args) {
            const task = System.take(...args);

            tasksToRemove.push(task);
            return task.done;
          },
          takeEvery(...args) {
            const task = System.takeEvery(...args);

            tasksToRemove.push(task);
            return task;
          },
          state(...args) {
            const state = createState(...args);

            actionsToFire.push(teardownAction(state.id));
            return state;
          },
          isMounted
        }
      );
    },
    updated(newProps) {
      outerProps.set(newProps);
    },
    rendered() {
      if (onRendered) onRendered();
    },
    out() {
      mounted = false;
    }
  };

  System.addTask(
    unmountedAction(id),
    () => {
      tasksToRemove.forEach(t => t.cancel());
      System.putBulk(actionsToFire);
    }
  );

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
        System.put(unmountedAction(instance.id));
      };
    }, []);

    return content;
  };

  RoutineBridge.displayName = `Routine(${ getFuncName(routineFunc) })`;

  return RoutineBridge;
}
