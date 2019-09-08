import { isPromise } from '../utils';

export default function filter(func) {
  return (queueResult, payload, next, q) => {
    let filterResult = func(queueResult, ...payload);

    if (isPromise(filterResult)) {
      return filterResult.then(asyncResult => {
        if (!asyncResult) {
          q.index = q.items.length;
        }
        return next(queueResult);
      });
    }
    if (!filterResult) {
      q.index = q.items.length;
    }
    return next(queueResult);
  };
}
