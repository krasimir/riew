/* eslint-disable no-return-assign */
import React, { useState, useEffect } from 'react';
import { getFuncName } from '../utils';
import createRoutineInstance from '../routine';

export default function routine(controller, View = () => null) {
  const RoutineBridge = function (outerProps) {
    let [ instance, setInstance ] = useState(null);
    let [ content, setContent ] = useState({ content: null, done: () => {}});
    let [ permanentProps, setPermanentProps ] = useState({});

    function preserveProps(props) {
      permanentProps = {...permanentProps, ...props};
      setPermanentProps(permanentProps);
      return permanentProps;
    }

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
          if (typeof props === 'string' || typeof props === 'number' || React.isValidElement(props)) {
            setContent({ content: props, done });
          } else if (props === null) {
            setContent({ content: null, done });
          } else {
            setContent({ content: <View {...preserveProps(props)}/>, done });
          }
        }
      );

      setInstance(instance);
      instance.in(outerProps);

      return function () {
        instance.out();
      };
    }, []);

    return content.content;
  };

  RoutineBridge.displayName = `Routine(${ getFuncName(controller) })`;

  return RoutineBridge;
}
