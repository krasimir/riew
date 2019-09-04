import React, { useState, useEffect } from 'react';
import { getFuncName } from '../utils';
import createRawRiew from '../riew';

const noop = () => {};

export default function riew(View, controller = noop, map = {}) {
  const createBridge = function (map = null) {
    const comp = function (outerProps) {
      let [ instance, setInstance ] = useState(null);
      let [ content, setContent ] = useState(null);

      // updating props
      useEffect(() => {
        if (instance) instance.update(outerProps);
      }, [ outerProps ]);

      // mounting
      useEffect(() => {
        instance = createRawRiew(
          (props) => {
            if (props === null) {
              setContent(null);
            } else {
              setContent(<View {...props}/>);
            }
          },
          controller
        );

        if (map !== null) {
          instance = instance.with(...map);
        }
        setInstance(instance);
        instance.in(outerProps);

        return function () {
          instance.out();
        };
      }, []);

      return content;
    };

    comp.displayName = `Riew(${ getFuncName(controller) })`;
    comp.with = (...map) => createBridge(map);

    return comp;
  };

  return createBridge(map);
}
