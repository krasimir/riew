import { useState, useEffect } from 'react';
import createRoutineController from './RoutineController';

const isGenerator = obj => obj && typeof obj['next'] === 'function';
const isPromise = obj => obj && typeof obj['then'] === 'function';
const getFuncName = (func) => {
  if (func.name) return func.name;
  let result = /^function\s+([\w\$]+)\s*\(/.exec(func.toString());

  return result ? result[ 1 ] : 'unknown';
};

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

export function Routine(routine) {
  let controller;
  const RineBridge = function (props) {
    const [ content, setContent ] = useState(null);

    useEffect(() => {
      if (controller) controller.update(props);
    }, [ props ]);

    useEffect(() => {
      controller = createRoutineController(routine, {
        broadcast(...args) {
          System.put(...args);
        }
      });

      System.addController(controller);

      const result = controller.in(setContent, props);

      if (result && !isPromise(result) && !isGenerator(result)) {
        setContent(result);
      }

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

export function Partial(product) {
  return initialValue => {
    let rerender = () => {};
    let value = initialValue;

    const RineBridgeComponent = Routine(function Partial({ render }) {
      rerender = () => render(product(value));
      return rerender();
    });

    RineBridgeComponent.displayName = `Rine(${ getFuncName(product) })`;

    RineBridgeComponent.set = newValue => {
      value = newValue;
      rerender();
    };
    RineBridgeComponent.get = () => value;

    return RineBridgeComponent;
  };
}
