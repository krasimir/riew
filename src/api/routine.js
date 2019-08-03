import { useState, useEffect } from 'react';
import createRoutineController from './RoutineController';
import System from './System';
import { getFuncName } from '../utils';

export default function routine(routine) {
  const RoutineBridge = function (props) {
    const [ content, setContent ] = useState(null);
    let [ controller, setController ] = useState(null);

    useEffect(() => {
      if (controller) controller.updated(props);
    }, [ props ]);

    useEffect(() => {
      if (controller) controller.rendered();
    }, [ content ]);

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

  RoutineBridge.displayName = `Routine(${ getFuncName(routine) })`;

  return RoutineBridge;
}
