/* eslint-disable no-new-func */
import React, { useState, useEffect, useRef } from 'react';
import { getFuncName } from '../utils';
import { riew as createRiew } from '../index';

export default function riew(View, ...controllers) {
  const createBridge = function (externals = []) {
    const comp = function (outerProps) {
      let [ instance, setInstance ] = useState(null);
      let [ content, setContent ] = useState(null);
      const componentIsMounted = useRef(true);

      // updating props
      useEffect(() => {
        if (instance) {
          instance.update(outerProps);
        }
      }, [ outerProps ]);

      // mounting
      useEffect(() => {
        instance = createRiew(
          (props) => {
            if (!componentIsMounted.current) return;
            if (props === null) {
              setContent(null);
            } else {
              setContent(React.createElement(View, props));
            }
          },
          ...controllers
        );

        if (externals && externals.length > 0) {
          instance = instance.with(...externals);
        }

        setInstance(instance);
        instance.mount(outerProps);

        return function () {
          componentIsMounted.current = false;
          instance.unmount();
        };
      }, []);

      return content;
    };

    comp.displayName = `Riew_${ getFuncName(View) }`;
    comp.with = (...maps) => {
      return createBridge(maps);
    };

    return comp;
  };

  return createBridge();
}
