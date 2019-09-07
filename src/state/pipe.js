import { isPromise } from '../utils';

export default function pipe(func) {
  return (queueResult, payload, next) => {
    let result = (func || function () {})(queueResult, ...payload);

    if (isPromise(result)) {
      return result.then(() => next(queueResult));
    }
    return next(queueResult);
  };
};
