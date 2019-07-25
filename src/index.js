import { useState, useEffect } from 'react';
import createRineElement from './RineElement';

const isGenerator = obj => obj && typeof obj['next'] === 'function';
const isPromise = obj => obj && typeof obj['then'] === 'function';

export default function rine(Component) {
  const el = createRineElement(Component);

  return function Rine(props) {
    const [ result, setResult ] = useState(null);

    useEffect(() => {
      const initialRender = el.in({
        ...props,
        render(content) {
          setResult(content);
        }
      });

      if (initialRender && !isPromise(initialRender) && !isGenerator(initialRender)) {
        setResult(initialRender);
      }

      return function () {
        el.out();
      };
    }, []);

    return result;
  };
}
