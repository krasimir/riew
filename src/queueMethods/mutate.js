import { isPromise } from '../utils';

export default function mutate(func) {
  return (intermediateValue, payload, q) => {
    let result = (func || ((current, payload) => payload))(intermediateValue, ...payload);

    if (isPromise(result)) {
      return result.then(asyncResult => {
        q.setStateValue(asyncResult);
        return asyncResult;
      });
    }
    q.setStateValue(result);
    return result;
  };
};
