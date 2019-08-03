import { useState, useEffect } from 'react';
import createRoutineController from './RoutineController';
import System from './System';
import { getFuncName } from '../utils';

export default function routine(routine) {
  const RoutineBridge = function (props) {
    const [ content, setContent ] = useState(null);
    let [ controller, setController ] = useState(null);

    // updating props
    useEffect(() => {
      if (controller) controller.updated(props);
    }, [ props ]);

    // to support sync rendering (i.e. await render(...))
    useEffect(() => {
      if (controller) controller.rendered();
    }, [ content ]);

    useEffect(() => {
      setController(controller = createRoutineController(routine));

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
