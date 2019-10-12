/* eslint-disable no-new-func */
import React, { useState, useEffect } from 'react';
import { getFuncName } from '../utils';
import { riew as createRiew } from '../index';

export default function riew(View, ...controllers) {
  const createBridge = function (externals = []) {
    const comp = function (outerProps) {
      let [ instance, setInstance ] = useState(null);
      let [ content, setContent ] = useState(null);

      // updating props
      useEffect(() => {
        if (instance) {
          instance.update(outerProps);
        }
      }, [ outerProps ]);

      // mounting
      useEffect(() => {
        instance = createRiew(
          (new Function('React', 'setContent', 'View', `
          return function Riew_${ getFuncName(View) }(props) {
            if (props === null) {
              setContent(null);
            } else {
              setContent(props);
            }
          }
          `)(React, setContent, View)),
          ...controllers
        );

        if (externals && externals.length > 0) {
          instance = instance.with(...externals);
        }

        setInstance(instance);
        instance.mount(outerProps);

        return function () {
          instance.unmount();
        };
      }, []);

      return content === null ? null : React.createElement(View, content);
    };

    comp.displayName = `Riew_${ getFuncName(View) }`;
    comp.with = (...maps) => {
      return createBridge(maps);
    };

    return comp;
  };

  return createBridge();
}
