import { getFuncName, getId, isPromise } from './utils';
import { QUEUE_END, QUEUE_START, QUEUE_STEP_IN, QUEUE_STEP_OUT } from './constants';
import pipe from './queueMethods/pipe';
import map from './queueMethods/map';
import mapToKey from './queueMethods/mapToKey';
import mutate from './queueMethods/mutate';
import filter from './queueMethods/filter';
import { implementLoggableInterface } from './interfaces';

const queueAPI = {
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

queueAPI.define('pipe', pipe);
queueAPI.define('map', map);
queueAPI.define('mapToKey', mapToKey);
queueAPI.define('mutate', mutate);
queueAPI.define('filter', filter);

export function isQueue(queue) {
  return queue && queue.id && queue.items && queue.process;
}

export function createQueueAPI() {
  return { ...queueAPI };
};

export function createQueue(state, emit) {
  const setStateValue = state.set;
  const getStateValue = state.get;
  const queueAPI = state.queueAPI;
  const q = {
    id: getId('q'),
    index: null,
    setStateValue,
    getStateValue,
    result: getStateValue(),
    items: [],
    add(type, func) {
      this.items.push({ type, func, name: func.map(getFuncName) });
    },
    process(...payload) {
      q.index = 0;

      function next() {
        if (q.index < q.items.length) {
          return loop();
        }
        q.index = null;
        emit(QUEUE_END, q);
        return q.result;
      };
      function loop() {
        emit(QUEUE_STEP_IN, q);
        const { type, func } = q.items[q.index];
        const logic = queueAPI[type];

        if (logic) {
          const r = logic(q, func, payload, (lastResult) => {
            q.result = lastResult;
            emit(QUEUE_STEP_OUT, q);
            q.index++;
            return next();
          });

          return r;
        }
        throw new Error(`Unsupported method "${ type }".`);
      };

      emit(QUEUE_START, q);
      if (q.items.length > 0) {
        return loop();
      }
      emit(QUEUE_END, q);
      return q.result;
    },
    cancel() {
      q.items = [];
    }
  };

  implementLoggableInterface(q, state.loggable);

  return q;
}
