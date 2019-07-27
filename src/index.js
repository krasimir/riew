import { useState, useEffect } from 'react';
import createRoutineController from './RoutineController';

const isGenerator = obj => obj && typeof obj['next'] === 'function';
const isPromise = obj => obj && typeof obj['then'] === 'function';

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

export default function createRineBridge(routine) {
  return function RineBridge(props) {
    const [ content, setContent ] = useState(null);

    useEffect(() => {
      const controller = createRoutineController(routine, {
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
}
