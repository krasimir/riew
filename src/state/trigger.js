import { getId, isPromise } from '../utils';
import registry from '../registry';
import pipe from './pipe';
import map from './map';
import mapToKey from './mapToKey';
import mutate from './mutate';
import filter from './filter';
import createQueue from './queue';
import createCore from './core';

export const implementIterable = (obj) => {
  if (typeof Symbol !== 'undefined' && typeof Symbol.iterator !== 'undefined') {
    obj[Symbol.iterator] = function () {
      const values = [ obj.map(), obj.mutate(), obj ];
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

export default function (initialValue) {
  const state = createCore(initialValue);
  const queueMethods = [];
  const queueAPI = {};
  let triggers = [];

  function createNewTrigger(items = []) {
    let exportedAs;
    let active = true;

    const trigger = function (...payload) {
      if (!active || trigger.__itemsToCreate.length === 0) return state.get();
      const queue = createQueue(
        state.set,
        state.get,
        () => {
          trigger.__queues = trigger.__queues.filter(({ id }) => queue.id !== id);
        },
        queueAPI
      );

      trigger.__queues.push(queue);
      trigger.__itemsToCreate.forEach(({ type, func }) => queue.add(type, func));
      return queue.process(...payload);
    };

    triggers.push(trigger);
    implementIterable(trigger);

    trigger.id = getId('t');
    trigger.state = state;
    trigger.__queues = [];
    trigger.__riewTrigger = true;
    trigger.__itemsToCreate = [ ...items ];
    trigger.__listeners = state.listeners;

    // queue methods
    queueMethods.forEach(m => {
      trigger[m] = (...methodArgs) => createNewTrigger([ ...trigger.__itemsToCreate, { type: m, func: methodArgs } ]);
    });

    // trigger direct methods
    trigger.define = (methodName, func) => {
      defineQueueMethod(methodName, func);
      return trigger;
    };
    trigger.isMutating = () => {
      return !!trigger.__itemsToCreate.find(({ type }) => type === 'mutate');
    };
    trigger.subscribe = (initialCall = false) => {
      if (trigger.isMutating()) {
        throw new Error('You should not subscribe a trigger that mutates the state. This will lead to endless recursion.');
      }
      if (initialCall) trigger();
      state.addListener(trigger);
      return trigger;
    };
    trigger.unsubscribe = () => {
      state.removeListener(trigger);
      return trigger;
    };
    trigger.cancel = () => {
      trigger.__queues.forEach(q => q.cancel());
      return trigger;
    };
    trigger.cleanUp = () => {
      active = false;
      trigger.cancel();
      trigger.unsubscribe();
      if (exportedAs) registry.free(exportedAs);
    };
    trigger.teardown = () => {
      state.teardown();
      triggers.forEach(t => t.cleanUp());
      triggers = [ trigger ];
      return trigger;
    };
    trigger.export = (key) => {
      // if already exported with different key
      if (exportedAs) registry.free(exportedAs);
      registry.add(exportedAs = key, trigger);
      return trigger;
    };
    trigger.isActive = () => {
      return active;
    };
    trigger.test = function (callback) {
      const testTrigger = createNewTrigger([ ...trigger.__itemsToCreate ]);
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

    return trigger;
  };

  function defineQueueMethod(methodName, func) {
    queueMethods.push(methodName);
    queueAPI[methodName] = function (q, args, payload, next) {
      const result = func(...args)(q.result, payload, next, q);

      if (isPromise(result)) {
        return result.then(next);
      }
      return next(result);
    };
    triggers.forEach(t => {
      t[methodName] = (...methodArgs) => {
        return createNewTrigger([ ...t.__itemsToCreate, { type: methodName, func: methodArgs } ]);
      };
    });
  };

  defineQueueMethod('pipe', pipe);
  defineQueueMethod('map', map);
  defineQueueMethod('mapToKey', mapToKey);
  defineQueueMethod('mutate', mutate);
  defineQueueMethod('filter', filter);

  return createNewTrigger;
};
