import { getId, isPromise } from './utils';
import pipe from './queueMethods/pipe';
import map from './queueMethods/map';
import mapToKey from './queueMethods/mapToKey';
import mutate from './queueMethods/mutate';
import filter from './queueMethods/filter';
import createQueue from './queue';
import { EFFECT_FORK, EFFECT_EXPORTED, STATE_DESTROY, EFFECT_QUEUE_END } from './constants';

export function isEffect(func) {
  return func && func.__riewEffect === true;
}

export const implementIterable = (obj) => {
  if (typeof Symbol !== 'undefined' && typeof Symbol.iterator !== 'undefined') {
    obj[Symbol.iterator] = function () {
      const values = [ obj, obj.mutate(), obj ];
      let i = 0;

      return {
        next: () => ({
          value: values[ i++ ],
          done: i > values.length
        })
      };
    };
  }
};

export default function createEffect(state, items = [], emit) {
  const queueAPI = {};
  let active = true;

  const effect = function (...payload) {
    if (!active || effect.__items.length === 0) {
      return state.get();
    }
    const queue = createQueue(
      state.set,
      state.get,
      queueAPI,
      emit.extend({
        [ EFFECT_QUEUE_END ]: () => {
          effect.__queues = effect.__queues.filter(q => q.id !== queue.id);
        }
      })
    );

    effect.__queues.push(queue);
    effect.__items.forEach(({ type, func }) => queue.add(type, func));
    return queue.process(...payload);
  };
  const fork = function (newItems) {
    return emit(EFFECT_FORK, effect, newItems);
  };

  effect.id = getId('e');
  effect.state = state;
  effect.loggable = state.loggable;
  effect.__queues = [];
  effect.__riewEffect = true;
  effect.__items = [ ...items ];

  implementIterable(effect);

  // queue methods
  Object.keys(queueAPI).forEach(m => {
    effect[m] = (...methodArgs) => fork([ { type: m, func: methodArgs } ]);
  });

  // effect direct methods
  effect.define = (methodName, func) => {
    defineQueueMethod(methodName, func);
    return effect;
  };
  effect.isMutating = () => {
    return !!effect.__items.find(({ type }) => type === 'mutate');
  };
  effect.subscribe = (initialCall = false) => {
    if (effect.isMutating()) {
      throw new Error('You should not subscribe a effect that mutates the state. This will lead to endless recursion.');
    }
    if (initialCall) effect();
    state.addListener(effect);
    return effect;
  };
  effect.unsubscribe = () => {
    state.removeListener(effect);
    return effect;
  };
  effect.cancel = () => {
    active = false;
    effect.unsubscribe();
    effect.__queues.forEach(q => q.cancel());
    return effect;
  };
  effect.destroy = () => {
    emit(STATE_DESTROY);
    return effect;
  };
  effect.isActive = () => {
    return active;
  };
  effect.export = name => {
    emit(EFFECT_EXPORTED, effect, name);
    return effect;
  };
  effect.logability = flag => {
    effect.loggable = flag;
    return effect;
  };
  effect.test = function (callback) {
    const testTrigger = fork([]);
    const tools = {
      setValue(newValue) {
        testTrigger.__items = [
          { type: 'map', func: [ () => newValue ] },
          ...testTrigger.__items
        ];
      },
      swap(index, funcs, type) {
        if (!Array.isArray(funcs)) funcs = [funcs];
        testTrigger.__items[index].func = funcs;
        if (type) {
          testTrigger.__items[index].type = type;
        }
      },
      swapFirst(funcs, type) {
        tools.swap(0, funcs, type);
      },
      swapLast(funcs, type) {
        tools.swap(testTrigger.__items.length - 1, funcs, type);
      }
    };

    callback(tools);

    return testTrigger;
  };

  function defineQueueMethod(methodName, func) {
    queueAPI[methodName] = function (q, args, payload, next) {
      const result = func(...args)(q.result, payload, q);

      if (isPromise(result)) {
        return result.then(next);
      }
      return next(result);
    };
    effect[methodName] = (...methodArgs) => {
      return fork([ { type: methodName, func: methodArgs } ]);
    };
  };

  defineQueueMethod('pipe', pipe);
  defineQueueMethod('map', map);
  defineQueueMethod('mapToKey', mapToKey);
  defineQueueMethod('mutate', mutate);
  defineQueueMethod('filter', filter);

  return effect;
};
