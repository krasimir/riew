import { isPromise } from '../utils';

export default function map(func) {
  return (queueResult, payload, next) => {
    let result = (func || (value => value))(queueResult, ...payload);

    if (isPromise(result)) {
      return result.then(next);
    }
    return next(result);
  };
};
