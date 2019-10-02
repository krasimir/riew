import { getId, isPromise } from './utils';
import pipe from './queueMethods/pipe';
import map from './queueMethods/map';
import mapToKey from './queueMethods/mapToKey';
import mutate from './queueMethods/mutate';
import filter from './queueMethods/filter';

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

export function createQueue(state, effect, lifecycle) {
  const setStateValue = state.set;
  const getStateValue = state.get;
  const q = {
    id: getId('q'),
    index: null,
    causedBy: effect.id,
    setStateValue,
    getStateValue,
    result: null,
    items: [],
    add(type, func) {
      this.items.push({ type, func });
    },
    process(...payload) {
      q.result = getStateValue();
      q.index = 0;

      function next() {
        if (q.index < q.items.length) {
          return loop();
        }
        q.index = null;
        lifecycle.end(q);
        return q.result;
      };
      function loop() {
        lifecycle.stepIn(q);
        const { type, func } = q.items[q.index];
        const logic = QueueAPI[type];

        if (logic) {
          const r = logic(q, func, payload, (lastResult) => {
            q.result = lastResult;
            lifecycle.stepOut(q);
            q.index++;
            return next();
          });

          return r;
        }
        throw new Error(`Unsupported method "${ type }".`);
      };

      lifecycle.start(q);
      if (q.items.length > 0) {
        return loop();
      }
      lifecycle.end(q);
      return q.result;
    },
    cancel() {
      q.items = [];
    }
  };

  effect.items.forEach(({ type, func }) => q.add(type, func));

  return q;
}
