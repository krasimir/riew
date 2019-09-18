import { isPromise } from '../utils';

export default function filter(func) {
  return (intermediateValue, payload, next, q) => {
    let filterResult = func(intermediateValue, ...payload);

    if (isPromise(filterResult)) {
      return filterResult.then(asyncResult => {
        if (!asyncResult) {
          q.index = q.items.length;
        }
        return next(intermediateValue);
      });
    }
    if (!filterResult) {
      q.index = q.items.length;
    }
    return next(intermediateValue);
  };
}
