/* eslint-disable no-return-assign */
import React, { useState, useEffect } from 'react';
import { getFuncName } from '../utils';
import createRoutineInstance from '../routine';

export default function routine(controller, View) {
  if (typeof View === 'undefined') {
    View = controller;
    controller = () => {};
  }
  let statesMap = null;
  const RoutineBridge = function (outerProps) {
    let [ instance, setInstance ] = useState(null);
    let [ content, setContent ] = useState({ content: null, done: () => {}});

    // updating props
    useEffect(() => {
      if (instance) instance.update(outerProps);
    }, [ outerProps ]);

    // to support sync rendering (i.e. await render(...))
    useEffect(() => {
      if (instance) content.done();
    }, [ content ]);

    // mounting
    useEffect(() => {
      instance = createRoutineInstance(
        controller,
        (props, done) => {
          if (props === null) {
            setContent({ content: null, done });
          } else {
            setContent({ content: <View {...props}/>, done });
          }
        }
      );

      if (statesMap !== null) {
        instance.withState(statesMap);
      }
      setInstance(instance);
      instance.in(outerProps);

      return function () {
        instance.out();
      };
    }, []);

    return content.content;
  };

  RoutineBridge.displayName = `Routine(${ getFuncName(controller) })`;
  RoutineBridge.withState = (map) => {
    statesMap = map;
    return RoutineBridge;
  };

  return RoutineBridge;
}
