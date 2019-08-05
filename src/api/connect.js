import React, { useState, useEffect } from 'react';
import equal from 'fast-deep-equal';
import { getFuncName } from '../utils';

function isRineState(value) {
  return value.__rine === 'state';
}
function getValueFromState(state) {
  return state.get();
}
function accumulateProps(map) {
  return Object.keys(map).reduce((props, key) => {
    const value = map[key];

    if (isRineState(value)) {
      props[key] = getValueFromState(value);
    } else {
      props[key] = value;
    }
    return props;
  }, {});
}

export default function connect(Component, map, translate = v => v) {
  function StateBridge(props) {
    let [ aprops, setAProps ] = useState(accumulateProps(map));

    useEffect(() => {
      let unsubscribeCallbacks = [];

      Object.keys(map).forEach(key => {
        const value = map[key];

        if (isRineState(value)) {
          const state = value;

          unsubscribeCallbacks.push(
            state.subscribe(
              () => {
                const newValue = getValueFromState(state);

                if (!equal(aprops[key], newValue)) {
                  setAProps(aprops = { ...aprops, [key]: newValue });
                }
              }
            )
          );
        }
      });
      return () => {
        unsubscribeCallbacks.forEach(f => f());
      };
    }, []);

    return <Component {...translate(aprops)} {...props}/>;
  }

  StateBridge.displayName = `Connected(${ getFuncName(Component) })`;
  return StateBridge;
};
