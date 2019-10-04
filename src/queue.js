import { getId, isPromise } from './utils';
import pipe from './queueMethods/pipe';
import map from './queueMethods/map';
import mapToKey from './queueMethods/mapToKey';
import mutate from './queueMethods/mutate';
import filter from './queueMethods/filter';
import { implementObservableInterface } from './interfaces';
import { QUEUE_START, QUEUE_END, QUEUE_STEP_IN, QUEUE_STEP_OUT, QUEUE_SET_STATE_VALUE, CANCEL_EVENT } from './constants';

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

export function createQueue(initialStateValue, effect) {
  const q = {
    id: getId('q'),
    index: null,
    setStateValue(value) {
      this.emit(QUEUE_SET_STATE_VALUE, value);
    },
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
        q.emit(QUEUE_END);
        q.off();
        return q.result;
      };
      function loop() {
        q.emit(QUEUE_STEP_IN);
        const { type, func } = q.items[q.index];
        const logic = QueueAPI[type];

        if (logic) {
          const r = logic(q, func, payload, (lastResult) => {
            q.result = lastResult;
            q.emit(QUEUE_STEP_OUT);
            q.index++;
            return next();
          });

          return r;
        }
        throw new Error(`Unsupported method "${ type }".`);
      };

      q.emit(QUEUE_START);
      if (q.items.length > 0) {
        return loop();
      }
      q.emit(QUEUE_END);
      q.off();
      return q.result;
    },
    cancel() {
      q.items = [];
    }
  };

  implementObservableInterface(q);

  effect.items.forEach(({ type, func }) => q.add(type, func));
  effect.on(CANCEL_EVENT, () => {
    q.cancel();
  });

  return q;
}
