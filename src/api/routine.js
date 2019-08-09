import React, { useState, useEffect } from 'react';
import System from './System';
import { getFuncName } from '../utils';
import createState, { teardownAction } from './state';

var ids = 0;
const getId = () => `@@r${ ++ids }`;
const unmountedAction = id => `${ id }_unmounted`;
const updatedAction = id => `${ id }_updated`;

export function createRoutineInstance(routineFunc) {
  let id = getId();
  let mounted = false;
  let props = null;
  let triggerRender;
  let tasksToRemove = [];
  let actionsToFire = [];
  let onRendered;

  function isMounted() {
    return mounted;
  }
  function updateProps(newProps) {
    return (props = { ...props, ...newProps });
  }

  const instance = {
    __rine: 'routine',
    id,
    name: getFuncName(routineFunc),
    isMounted,
    in(initialProps, Component, setContent) {
      mounted = true;
      updateProps(initialProps);
      triggerRender = () => {
        if (mounted) setContent(<Component {...props }/>);
      };
      routineFunc(
        {
          render(newProps) {
            if (!mounted) return Promise.resolve();
            if (typeof newProps === 'string' || typeof newProps === 'number' || React.isValidElement(newProps)) {
              setContent(newProps);
            } else if (newProps === null) {
              setContent(() => null);
            } else {
              if (newProps) updateProps(newProps);
              triggerRender();
            }
            return new Promise(done => {
              onRendered = done;
            });
          },
          takeProps(callback) {
            const task = System.takeEvery(updatedAction(id), callback);

            tasksToRemove.push(task);
            callback(props);
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
      updateProps(newProps);
      System.put(updatedAction(id), props);
      triggerRender();
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
      instance.out();
      System.removeTasks(tasksToRemove);
      System.putBulk(actionsToFire);
    }
  );

  return instance;
}

export default function routine(routineFunc, Component = () => null, options) {
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
      setInstance(instance = createRoutineInstance(routineFunc));

      if (__DEV__) {
        if (options && options.onInstanceCreated) {
          options.onInstanceCreated(instance);
        }
      }

      instance.in(outerProps, Component, setContent);

      return function () {
        System.put(unmountedAction(instance.id));
      };
    }, []);

    return content;
  };

  RoutineBridge.displayName = `Routine(${ getFuncName(routineFunc) })`;

  return RoutineBridge;
}
