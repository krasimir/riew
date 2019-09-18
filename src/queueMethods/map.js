import { isPromise } from '../utils';

export default function map(func) {
  return (intermediateValue, payload, next) => {
    let result = (func || (value => value))(intermediateValue, ...payload);

    if (isPromise(result)) {
      return result.then(next);
    }
    return next(result);
  };
};
