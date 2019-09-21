import { getId, isPromise } from './utils';
import pipe from './queueMethods/pipe';
import map from './queueMethods/map';
import mapToKey from './queueMethods/mapToKey';
import mutate from './queueMethods/mutate';
import filter from './queueMethods/filter';
import createQueue from './queue';

export function isRiewEffect(func) {
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

export default function effectFactory(state, lifecycle, loggable) {
  const queueMethods = [];
  const queueAPI = {};
  let effects = [];
  let active = true;

  function createNewEffect(items = []) {
    const effect = function (...payload) {
      if (!active || effect.__itemsToCreate.length === 0) {
        return state.get();
      }
      const queue = createQueue(
        state.set,
        state.get,
        () => {
          effect.__queues = effect.__queues.filter(({ id }) => queue.id !== id);
          lifecycle.out(effect);
        },
        (q, phase) => {
          lifecycle.queueStep(effect, q, phase);
        },
        queueAPI
      );

      effect.__queues.push(queue);
      effect.__itemsToCreate.forEach(({ type, func }) => queue.add(type, func));
      lifecycle.in(effect);
      return queue.process(...payload);
    };

    effect.id = getId('e');
    effect.state = state;
    effect.loggable = loggable;
    effect.__queues = [];
    effect.__riewEffect = true;
    effect.__itemsToCreate = [ ...items ];
    effect.__listeners = state.listeners;

    effects.push(effect);
    implementIterable(effect);

    // queue methods
    queueMethods.forEach(m => {
      effect[m] = (...methodArgs) => lifecycle.fork([ ...effect.__itemsToCreate, { type: m, func: methodArgs } ]);
    });

    // effect direct methods
    effect.define = (methodName, func) => {
      defineQueueMethod(methodName, func);
      return effect;
    };
    effect.isMutating = () => {
      return !!effect.__itemsToCreate.find(({ type }) => type === 'mutate');
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
      effect.__queues.forEach(q => q.cancel());
      return effect;
    };
    effect.cleanUp = () => {
      effect.cancel();
      effect.unsubscribe();
    };
    effect.teardown = () => {
      active = false;
      state.teardown();
      effects.forEach(t => t.cleanUp());
      effects = [ effect ];
      lifecycle.teardown(effect);
      return effect;
    };
    effect.isActive = () => {
      return active;
    };
    effect.export = name => {
      lifecycle.export(effect, name);
      return effect;
    };
    effect.logability = flag => {
      effect.loggable = flag;
      return effect;
    };
    effect.test = function (callback) {
      const testTrigger = lifecycle.fork([ ...effect.__itemsToCreate ]);
      const tools = {
        setValue(newValue) {
          testTrigger.__itemsToCreate = [
            { type: 'map', func: [ () => newValue ] },
            ...testTrigger.__itemsToCreate
          ];
        },
        swap(index, funcs, type) {
          if (!Array.isArray(funcs)) funcs = [funcs];
          testTrigger.__itemsToCreate[index].func = funcs;
          if (type) {
            testTrigger.__itemsToCreate[index].type = type;
          }
        },
        swapFirst(funcs, type) {
          tools.swap(0, funcs, type);
        },
        swapLast(funcs, type) {
          tools.swap(testTrigger.__itemsToCreate.length - 1, funcs, type);
        }
      };

      callback(tools);

      return testTrigger;
    };

    return effect;
  };

  function defineQueueMethod(methodName, func) {
    queueMethods.push(methodName);
    queueAPI[methodName] = function (q, args, payload, next) {
      const result = func(...args)(q.result, payload, q);

      if (isPromise(result)) {
        return result.then(next);
      }
      return next(result);
    };
    effects.forEach(t => {
      t[methodName] = (...methodArgs) => {
        return lifecycle.fork([ ...t.__itemsToCreate, { type: methodName, func: methodArgs } ]);
      };
    });
  };

  defineQueueMethod('pipe', pipe);
  defineQueueMethod('map', map);
  defineQueueMethod('mapToKey', mapToKey);
  defineQueueMethod('mutate', mutate);
  defineQueueMethod('filter', filter);

  return createNewEffect;
};
