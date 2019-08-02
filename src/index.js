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
  const RineBridge = function (props) {
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

  RineBridge.displayName = `Rine(${ getFuncName(routine) })`;

  return RineBridge;
}

export function partial(Component) {
  return (initialValue) => {
    let rerender = () => {};
    let value = initialValue;
    const RineBridgeComponent = routine(function Partial({ render }) {
      rerender = () => render(props => <Component {...props} {...value}/>);
      return rerender();
    });

    RineBridgeComponent.displayName = `RinePartial(${ getFuncName(Component) })`;
    RineBridgeComponent.set = newValue => {
      value = newValue;
      rerender();
    };
    RineBridgeComponent.get = () => value;

    return RineBridgeComponent;
  };
}
