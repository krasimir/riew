import React, { useState, useEffect } from 'react';
import createRoutineController from './RoutineController';
import { getFuncName } from './utils';

export const System = {
  controllers: {},
  addController(controller) {
    this.controllers[ controller.id ] = controller;
  },
  removeController(controller) {
    delete this.controllers[ controller.id ];
  },
  put(type, payload, source) {
    Object.keys(this.controllers).forEach(id => {
      if (id !== source) {
        this.controllers[id].put(type, payload, false);
      }
    });
  },
  debug() {
    const pending = Object.keys(this.controllers).reduce((arr, id) => {
      arr = arr.concat(this.controllers[id].system().pending);
      return arr;
    }, []);

    return {
      controllers: this.controllers,
      pending
    };
  }
};

export function routine(routine) {
  const RoutineBridge = function (props) {
    const [ content, setContent ] = useState(null);
    let [ controller, setController ] = useState(null);

    useEffect(() => {
      if (controller) controller.update(props);
    }, [ props ]);

    useEffect(() => {
      setController(controller = createRoutineController(routine, {
        broadcast(...args) {
          System.put(...args);
        }
      }));

      System.addController(controller);
      controller.in(setContent, props);

      return function () {
        controller.out();
        System.removeController(controller);
      };
    }, []);

    return content;
  };

  RoutineBridge.displayName = `RoutineBridge(${ getFuncName(routine) })`;

  return RoutineBridge;
}

export function partial(Component) {
  return function createPartial(initialValue) {
    const PartialBridge = function (props) {
      let [ value, setValue ] = useState(initialValue);

      useEffect(() => {
        PartialBridge.set = (newValue) => {
          value = newValue;
          setValue(newValue);
        };
        PartialBridge.get = () => value;
        return function () {
          PartialBridge.set = newValue => { initialValue = newValue; };
          PartialBridge.get = () => initialValue;
        };
      }, []);

      return <Component {...value} {...props}/>;
    };

    PartialBridge.set = newValue => { initialValue = newValue; };
    PartialBridge.get = () => initialValue;
    PartialBridge.displayName = `PartialBridge(${ getFuncName(Component) })`;

    return PartialBridge;
  };
}
