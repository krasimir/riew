import { isPromise } from '../utils';

export default function pipe(func) {
  return (intermediateValue, payload) => {
    let result = (func || function () {})(intermediateValue, ...payload);

    if (isPromise(result)) {
      return result.then(() => intermediateValue);
    }
    return intermediateValue;
  };
};
