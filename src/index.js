import { useState, useEffect } from 'react';
import createActMLElement from './ActMLElement';

const isGenerator = obj => obj && typeof obj['next'] === 'function';
const isPromise = obj => obj && typeof obj['then'] === 'function';

export default function actml(Component) {
  const el = createActMLElement(Component);

  return function ActML(props) {
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
