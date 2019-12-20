/* eslint-disable no-new-func */
import React, { useState, useEffect, useRef } from 'react';
import { getFuncName } from '../utils';
import { riew as createRiew } from '../index';

export default function riew(View, ...routines) {
  const createBridge = function(externals = []) {
    const comp = function(outerProps) {
      let [instance, setInstance] = useState(null);
      let [content, setContent] = useState(null);
      let mounted = useRef(true);

      // updating props
      useEffect(() => {
        if (instance) {
          instance.update(outerProps);
        }
      }, [outerProps]);

      // mounting
      useEffect(() => {
        instance = createRiew(props => {
          if (!mounted) return;
          if (props === null) {
            setContent(null);
          } else {
            setContent(props);
          }
        }, ...routines);

        if (externals && externals.length > 0) {
          instance = instance.with(...externals);
        }

        setInstance(instance);
        instance.mount(outerProps);
        mounted.current = true;

        return function() {
          mounted.current = false;
          instance.unmount();
        };
      }, []);

      return content === null ? null : React.createElement(View, content);
    };

    comp.displayName = `Riew_${getFuncName(View)}`;
    comp.with = (...maps) => {
      return createBridge(maps);
    };

    return comp;
  };

  return createBridge();
}
