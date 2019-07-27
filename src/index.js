import { useState, useEffect } from 'react';
import createRoutineController from './RoutineController';

const isGenerator = obj => obj && typeof obj['next'] === 'function';
const isPromise = obj => obj && typeof obj['then'] === 'function';

const Rine = {
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
  }
};

export default function createRineBridge(routine) {
  return function RineBridge(props) {
    const [ content, setContent ] = useState(null);

    useEffect(() => {
      const controller = createRoutineController(routine, {
        putGlobal(...args) {
          Rine.put(...args);
        }
      });

      Rine.addController(controller);

      const result = controller.in(setContent, props);

      if (result && !isPromise(result) && !isGenerator(result)) {
        setContent(result);
      }

      return function () {
        controller.out();
        Rine.removeController(controller);
      };
    }, []);

    return content;
  };
}
