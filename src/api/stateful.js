import React, { useState, useEffect } from 'react';
import { getFuncName } from '../utils';
import System from './System';

var ids = 0;
const getId = () => `s${ ++ids }`;

function isRineState(value) {
  return value.__state === 'rine';
}
function accumulateProps(map) {
  return Object.keys(map).reduce((props, key) => {
    const value = map[key];

    if (isRineState(value)) {
      props[key] = value.get();
    } else if (typeof value === 'function') {
      props[key] = value();
    }
    return props;
  }, {});
}

export function state(initialValue, reducer) {
  let subscribersUID = 0;
  let stateValue = initialValue;
  let subscribers = [];

  const stateController = {
    id: getId(),
    __state: 'rine',
    __subscribers: subscribers,
    set(newValue) {
      stateValue = newValue;
      subscribers.forEach(({ update }) => update(stateValue));
    },
    get() {
      return stateValue;
    },
    connect(update) {
      const subscriberId = ++subscribersUID;

      subscribers.push({ id: subscriberId, update });
      return () => {
        this.__subscribers = subscribers = subscribers.filter(({ id }) => id !== subscriberId);
      };
    },
    destroy() {
      System.removeController(this);
    },
    put(type, payload) {
      if (reducer) {
        this.set(reducer(stateValue, { type, payload }));
      }
    },
    system() { // to fullfil the controller contract
      return { pending: [] };
    }
  };

  System.addController(stateController);

  return stateController;
};

export function connect(Component, map) {
  function StateBridge(props) {
    let [ aprops, setAProps ] = useState(accumulateProps(map));

    useEffect(() => {
      let unsubscribeCallbacks = [];

      Object.keys(map).forEach(key => {
        const value = map[key];

        if (isRineState(value)) {
          unsubscribeCallbacks.push(
            value.connect(newValue => setAProps({ ...aprops, [key]: newValue }))
          );
        }
      });
      return () => {
        unsubscribeCallbacks.forEach(f => f());
      };
    }, []);

    return <Component {...aprops} {...props}/>;
  }

  StateBridge.displayName = `State(${ getFuncName(Component) })`;
  return StateBridge;
};
