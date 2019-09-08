import { isPromise } from '../utils';

export default function mutate(func) {
  return (intermediateValue, payload, next, q) => {
    let result = (func || ((current, payload) => payload))(intermediateValue, ...payload);

    if (isPromise(result)) {
      return result.then(asyncResult => {
        q.setStateValue(asyncResult);
        return next(asyncResult);
      });
    }
    q.setStateValue(result);
    return next(result);
  };
};
