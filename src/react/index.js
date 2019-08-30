import React, { useState, useEffect } from 'react';
import { getFuncName } from '../utils';
import createRoutineInstance from '../routine';

export default function routine(controller, View) {
  if (typeof View === 'undefined') {
    View = controller;
    controller = () => {};
  }
  const createBridge = function (map = null, stateMap = null) {
    const comp = function (outerProps) {
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

        if (map !== null) {
          instance = instance.with(map);
        }
        if (stateMap !== null) {
          instance = instance.withState(stateMap);
        }
        setInstance(instance);
        instance.in(outerProps);

        return function () {
          instance.out();
        };
      }, []);

      return content.content;
    };

    comp.displayName = `Routine(${ getFuncName(controller) })`;
    comp.with = (map) => createBridge(map);
    comp.withState = (map) => createBridge(null, map);

    return comp;
  };

  return createBridge();
}
