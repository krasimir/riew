import React, { useState, useEffect } from 'react';
import { getFuncName } from '../utils';
import createRawRiew from '../riew';

export default function riew(controller, View) {
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
        instance = createRawRiew(
          (props, done) => {
            if (props === null) {
              setContent({ content: null, done });
            } else {
              setContent({ content: <View {...props}/>, done });
            }
          },
          controller
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

    comp.displayName = `Riew(${ getFuncName(controller) })`;
    comp.with = (map) => createBridge(map);
    comp.withState = (map) => createBridge(null, map);

    return comp;
  };

  return createBridge();
}
