import { getId, isPromise } from './utils';
import pipe from './queueMethods/pipe';
import map from './queueMethods/map';
import mapToKey from './queueMethods/mapToKey';
import mutate from './queueMethods/mutate';
import filter from './queueMethods/filter';
import { CANCEL_EFFECT } from './constants';

export const QueueAPI = {
  define(methodName, func) {
    this[methodName] = function (q, args, payload, next) {
      const result = func(...args)(q.result, payload, q);

      if (isPromise(result)) {
        return result.then(next);
      }
      return next(result);
    };
  }
};

QueueAPI.define('pipe', pipe);
QueueAPI.define('map', map);
QueueAPI.define('mapToKey', mapToKey);
QueueAPI.define('mutate', mutate);
QueueAPI.define('filter', filter);

export function createQueue(initialStateValue, setStateValue) {
  const q = {
    id: getId('q'),
    index: null,
    setStateValue,
    result: initialStateValue,
    items: [],
    add(type, func) {
      this.items.push({ type, func });
    },
    process(...payload) {
      q.index = 0;

      function next() {
        if (q.index < q.items.length) {
          return loop();
        }
        q.index = null;
        return q.result;
      };
      function loop() {
        const { type, func } = q.items[q.index];
        const logic = QueueAPI[type];

        if (logic) {
          const r = logic(q, func, payload, (lastResult) => {
            q.result = lastResult;
            q.index++;
            return next();
          });

          return r;
        }
        throw new Error(`Unsupported method "${ type }".`);
      };

      if (q.items.length > 0) {
        return loop();
      }
      return q.result;
    },
    cancel() {
      q.items = [];
    }
  };

  return q;
}
