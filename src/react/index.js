/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { getFuncName } from '../utils';
import { namedRiew } from '../index';

export default function riew(View, ...routines) {
  const name = getFuncName(View);
  const createBridge = function(externals = []) {
    const comp = function(outerProps) {
      let [instance, setInstance] = useState(null);
      const [content, setContent] = useState(null);
      const mounted = useRef(true);

      // updating props
      useEffect(() => {
        if (instance) {
          instance.update(outerProps);
        }
      }, [outerProps]);

      // mounting
      useEffect(() => {
        instance = namedRiew(name, props => {
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
        instance.name = name;

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

    comp.displayName = `Riew_${name}`;
    comp.with = (...maps) => createBridge(maps);

    return comp;
  };

  return createBridge();
}
