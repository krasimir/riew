import { isPromise } from '../utils';

export default function pipe(func) {
  return (intermediateValue, payload, next) => {
    let result = (func || function () {})(intermediateValue, ...payload);

    if (isPromise(result)) {
      return result.then(() => next(intermediateValue));
    }
    return next(intermediateValue);
  };
};
