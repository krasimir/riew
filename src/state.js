import equal from 'fast-deep-equal';
import { isPromise, getFuncName } from './utils';
import registry from './registry';

var ids = 0;
const getId = (prefix) => `@@${ prefix }${ ++ids }`;

function pipe(func) {
  return (queueResult, payload, next) => {
    let result = (func || function () {})(queueResult, ...payload);

    if (isPromise(result)) {
      return result.then(() => next(queueResult));
    }
    return next(queueResult);
  };
};
function map(func) {
  return (queueResult, payload, next) => {
    let result = (func || (value => value))(queueResult, ...payload);

    if (isPromise(result)) {
      return result.then(next);
    }
    return next(result);
  };
};
function mapToKey(key) {
  return (queueResult, payload, next) => {
    const mappingFunc = (value) => ({ [key]: value });

    return next(mappingFunc(queueResult, ...payload));
  };
}
function mutate(func) {
  return (queueResult, payload, next, q) => {
    let result = (func || ((current, payload) => payload))(queueResult, ...payload);

    if (isPromise(result)) {
      return result.then(asyncResult => {
        q.setStateValue(asyncResult);
        return next(asyncResult);
      });
    }
    q.setStateValue(result);
    return next(result);
  };
}
function filter(func) {
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

function createQueue(setStateValue, getStateValue, onDone = () => {}, queueAPI) {
  const q = {
    index: 0,
    setStateValue,
    getStateValue,
    result: getStateValue(),
    id: getId('q'),
    items: [],
    add(type, func) {
      this.items.push({ type, func, name: func.map(getFuncName) });
    },
    process(...payload) {
      var items = q.items;

      q.index = 0;

      function next(lastResult) {
        q.result = lastResult;
        q.index++;
        if (q.index < items.length) {
          return loop();
        }
        onDone(q);
        return q.result;
      };
      function loop() {
        const { type, func } = items[q.index];
        const logic = queueAPI[type];

        if (logic) {
          return logic(q, func, payload, next);
        }
        throw new Error(`Unsupported method "${ type }".`);
      };

      return items.length > 0 ? loop() : q.result;
    },
    teardown() {
      this.items = [];
    }
  };

  return q;
}

function implementIterable(stateAPI) {
  if (typeof Symbol !== 'undefined' && typeof Symbol.iterator !== 'undefined') {
      stateAPI[Symbol.iterator] = function () {
        const values = [ stateAPI.map(), stateAPI.mutate(), stateAPI ];
        let i = 0;

        return {
          next: () => ({
            value: values[ i++ ],
            done: i > values.length
          })
        };
      };
  }
}

export function createState(initialValue) {
  const stateAPI = {};
  const queueMethods = [];
  const queueAPI = {};
  let value = initialValue;
  let createdQueues = [];
  let listeners = [];
  let active = true;
  let exportedAs;

  stateAPI.id = getId('s');
  stateAPI.__riew = true;
  stateAPI.__triggerListeners = () => {
    equal('a', 'b');
    listeners.forEach(l => l());
  };
  stateAPI.__listeners = () => listeners;
  stateAPI.__queues = () => createdQueues;

  stateAPI.active = () => active;
  stateAPI.get = () => value;
  stateAPI.set = (newValue, callListeners = true) => {
    let isEqual = equal(value, newValue);

    value = newValue;
    if (callListeners && !isEqual) stateAPI.__triggerListeners();
  };
  stateAPI.teardown = () => {
    createdQueues.forEach(q => q.teardown());
    createdQueues = [];
    listeners = [];
    active = false;
    if (exportedAs) registry.free(exportedAs);
  };
  stateAPI.export = (key) => {
    // if already exported with different key
    if (exportedAs) registry.free(exportedAs);
    registry.add(exportedAs = key, stateAPI);
    return stateAPI;
  };
  stateAPI.define = defineQueueMethod;

  defineQueueMethod('pipe', pipe);
  defineQueueMethod('map', map);
  defineQueueMethod('mapToKey', mapToKey);
  defineQueueMethod('mutate', mutate);
  defineQueueMethod('filter', filter);
  implementIterable(stateAPI);

  function defineQueueMethod(methodName, func) {
    queueMethods.push(methodName);
    queueAPI[methodName] = function (q, args, payload, next) {
      const result = func(...args)(q.result, payload, next, q);

      if (isPromise(result)) {
        return result.then(next);
      }
      return next(result);
    };
    stateAPI[methodName] = (...methodArgs) => createNewTrigger([ { type: methodName, func: methodArgs } ]);
  };
  function addListener(trigger) {
    trigger.__isStream = true;
    listeners.push(trigger);
  }
  function removeListener(trigger) {
    trigger.__isStream = false;
    listeners = listeners.filter(({ id }) => id !== trigger.id);
  }
  function addQueue(q) {
    createdQueues.push(q);
  }
  function removeQueue(q) {
    createdQueues = createdQueues.filter(({ id }) => q.id !== id);
  }
  function createNewTrigger(items = []) {
    const trigger = function (...payload) {
      if (active === false || trigger.__itemsToCreate.length === 0) return stateAPI.get();
      const queue = createQueue(stateAPI.set, stateAPI.get, removeQueue, queueAPI);

      addQueue(queue);
      trigger.__itemsToCreate.forEach(({ type, func }) => queue.add(type, func));
      return queue.process(...payload);
    };

    trigger.id = getId('t');
    trigger.__isStream = false;
    trigger.__riewTrigger = true;
    trigger.__itemsToCreate = [ ...items ];
    trigger.__state = stateAPI;

    // queue methods
    queueMethods.forEach(m => {
      trigger[m] = (...methodArgs) => createNewTrigger([ ...trigger.__itemsToCreate, { type: m, func: methodArgs } ]);
    });

    // not supported in queue methods
    ['set', 'get', 'teardown'].forEach(stateMethod => {
      trigger[stateMethod] = () => {
        throw new Error(`"${ stateMethod }" is not a queue method but a method of the state object.`);
      };
    });

    // trigger direct methods
    trigger.isMutating = () => {
      return !!trigger.__itemsToCreate.find(({ type }) => type === 'mutate');
    };
    trigger.subscribe = (initialCall = false) => {
      if (trigger.isMutating()) {
        throw new Error('You should not subscribe a trigger that mutates the state. This will lead to endless recursion.');
      }
      if (initialCall) trigger();
      addListener(trigger);
      return trigger;
    };
    trigger.unsubscribe = () => {
      removeListener(trigger);
      return trigger;
    };
    trigger.cancel = () => {
      trigger.__itemsToCreate = [];
      queueMethods.forEach(m => trigger[m] = () => trigger);
      return trigger;
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
  }

  return stateAPI;
};

export function mergeStates(statesMap) {
  const fetchSourceValues = () => Object.keys(statesMap).reduce((result, key) => {
    result[key] = statesMap[key].get();
    return result;
  }, {});
  const s = createState(fetchSourceValues());

  s.set = (newValue) => {
    if (typeof newValue !== 'object') {
      throw new Error('Wrong merged state value. Must be key-value pairs.');
    }
    Object.keys(newValue).forEach(key => {
      statesMap[key].set(newValue[key], false);
    });
    s.__triggerListeners();
  };
  s.get = fetchSourceValues;

  Object.keys(statesMap).forEach(key => {
    statesMap[key].pipe(() => {
      s.__triggerListeners();
    }).subscribe();
  });

  return s;
}

export function isRiewState(obj) {
  return obj && obj.__riew === true;
}

export function isRiewQueueTrigger(func) {
  return func && func.__riewTrigger === true;
}
