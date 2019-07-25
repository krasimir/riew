import { useState, useEffect } from 'react';
import createRoutineController from './RoutineController';

const isGenerator = obj => obj && typeof obj['next'] === 'function';
const isPromise = obj => obj && typeof obj['then'] === 'function';

export default function Rine(routine) {
  return function RineBridge(props) {
    const [ content, setContent ] = useState(null);

    useEffect(() => {
      const controller = createRoutineController(routine);
      const result = controller.in(setContent, props);

      if (result && !isPromise(result) && !isGenerator(result)) {
        setContent(result);
      }

      return function () {
        controller.out();
      };
    }, []);

    return content;
  };
}
