import React, { useState, useEffect } from 'react';
import System from './System';
import { getFuncName, isGenerator } from '../utils';
import { isState, teardownAction } from './state';

var ids = 0;
const getId = () => `@@r${ ++ids }`;
const unmountedAction = id => `${ id }_unmounted`;

export function createRoutineInstance(routineFunc) {
  let id = getId();
  let mounted = false;
  let RenderComponent;
  let triggerRender;
  let onRendered = () => {};
  let tasksToRemove = [];
  let actionsToFire = [];

  function isMounted() {
    return mounted;
  }

  const instance = {
    __rine: 'routine',
    id,
    name: getFuncName(routineFunc),
    in(setContent, props) {
      mounted = true;
      triggerRender = newProps => {
        if (mounted) setContent(<RenderComponent {...newProps } />);
      };

      const result = routineFunc(
        function render(f) {
          if (typeof f === 'function') {
            RenderComponent = f;
          } else {
            RenderComponent = () => f;
          }
          triggerRender(props);
          return new Promise(done => {
            onRendered = () => done();
          });
        },
        { isMounted }
      );

      if (isGenerator(result)) {
        (function processGenerator(genValue) {
          if (System.isTask(genValue.value)) {
            const task = genValue.value;

            tasksToRemove.push(task);
            if (task.done) {
              task.done.then(taskResult => processGenerator(result.next(taskResult)));
              return;
            }
          } else if (isState(genValue.value)) {
            actionsToFire.push(teardownAction(genValue.value.id));
          }
          if (!genValue.done) {
            processGenerator(result.next(genValue.value));
          }
        })(result.next());
      }
    },
    updated(props) {
      triggerRender(props);
    },
    rendered() {
      onRendered();
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

export default function routine(routineFunc, options) {
  const RoutineBridge = function (props) {
    const [ content, setContent ] = useState(null);
    let [ instance, setInstance ] = useState(null);

    // updating props
    useEffect(() => {
      if (instance) instance.updated(props);
    }, [ props ]);

    // to support sync rendering (i.e. await render(...))
    useEffect(() => {
      if (instance) instance.rendered();
    }, [ content ]);

    useEffect(() => {
      setInstance(instance = createRoutineInstance(routineFunc));

      if (__DEV__) {
        if (options && options.onInstanceCreated) {
          options.onInstanceCreated(instance);
        }
      }

      instance.in(setContent, props);

      return function () {
        System.put(unmountedAction(instance.id));
      };
    }, []);

    return content;
  };

  RoutineBridge.displayName = `Routine(${ getFuncName(routineFunc) })`;

  return RoutineBridge;
}