import { isPromise, getFuncName } from './utils';
import registry from './registry';

var ids = 0;
const getId = (prefix) => `@@${ prefix }${ ++ids }`;

export const queueMethods = [
  'pipe',
  'map',
  'mutate',
  'filter',
  'parallel',
  'mapToKey'
];

function createQueue(setStateValue, getStateValue, onDone = () => {}) {
  const q = {
    index: 0,
    result: getStateValue(),
    id: getId('q'),
    items: [],
    add(type, func) {
      this.items.push({ type, func, name: func.map(getFuncName) });
    },
    process(...payload) {
      var items = q.items;

      q.index = 0;

      function next() {
        q.index++;
        if (q.index < items.length) {
          return loop();
        }
        onDone(q);
        return q.result;
      };
      function loop() {
        const { type, func } = items[q.index];

        switch (type) {
          /* -------------------------------------------------- pipe */
          case 'pipe':
            let pipeResult = (func[0] || function () {})(q.result, ...payload);

            if (isPromise(pipeResult)) {
              return pipeResult.then(next);
            }
            return next();
          /* -------------------------------------------------- map */
          case 'map':
            q.result = (func[0] || (value => value))(q.result, ...payload);
            if (isPromise(q.result)) {
              return q.result.then(asyncResult => {
                q.result = asyncResult;
                return next();
              });
            }
            return next();
          /* -------------------------------------------------- map */
          case 'mapToKey':
            const mappingFunc = (value) => ({ [func[0]]: value });

            q.result = mappingFunc(q.result, ...payload);
            return next();
          /* -------------------------------------------------- mutate */
          case 'mutate':
              q.result = (func[0] || ((current, payload) => payload))(q.result, ...payload);
              if (isPromise(q.result)) {
                return q.result.then(asyncResult => {
                  q.result = asyncResult;
                  setStateValue(q.result);
                  return next();
                });
              }
              setStateValue(q.result);
              return next();
          /* -------------------------------------------------- filter */
          case 'filter':
            let filterResult = func[0](q.result, ...payload);

            if (isPromise(filterResult)) {
              return filterResult.then(asyncResult => {
                if (!asyncResult) {
                  q.index = items.length;
                }
                return next();
              });
            }
            if (!filterResult) {
              q.index = items.length;
            }
            return next();
          /* -------------------------------------------------- parallel */
          case 'parallel':
            q.result = func.map(f => f(q.result, ...payload));
            const promises = q.result.filter(isPromise);

            if (promises.length > 0) {
              return Promise.all(promises).then(() => {
                q.result.forEach((r, index) => {
                  if (isPromise(r)) {
                    r.then(value => (q.result[index] = value));
                  }
                });
                return next();
              });
            }
            return next();

        }
        /* -------------------------------------------------- error */
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

export function createState(initialValue) {
  let value = initialValue;
  const stateAPI = {};
  let createdQueues = [];
  let listeners = [];
  let active = true;
  let exportedAs;

  stateAPI.id = getId('s');
  stateAPI.__riew = true;
  stateAPI.__triggerListeners = () => listeners.forEach(l => l());
  stateAPI.__listeners = () => listeners;
  stateAPI.__queues = () => createdQueues;

  stateAPI.active = () => active;
  stateAPI.get = () => value;
  stateAPI.set = (newValue, callListeners = true) => {
    value = newValue;
    if (callListeners) stateAPI.__triggerListeners();
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
      const queue = createQueue(stateAPI.set, stateAPI.get, removeQueue);

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
      trigger[m] = (...func) => createNewTrigger([ ...trigger.__itemsToCreate, { type: m, func } ]);
    });

    // not supported in queue methods
    ['set', 'get', 'teardown'].forEach(stateMethod => {
      trigger[stateMethod] = () => {
        throw new Error(`"${ stateMethod }" is not a queue method but a method of the state object.`);
      };
    });

    // trigger direct methods
    trigger.subscribe = (initialCall = false) => {
      if (trigger.__itemsToCreate.find(({ type }) => type === 'mutate')) {
        throw new Error('You should not subscribe a trigger that mutates the state. This will lead to endless recursion.');
      }
      if (initialCall) trigger();
      addListener(trigger);
      return trigger;
    };
    trigger.cancel = () => {
      trigger.__itemsToCreate = [];
      queueMethods.forEach(m => trigger[m] = () => trigger);
      return trigger;
    };
    trigger.unsubscribe = () => {
      removeListener(trigger);
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

  queueMethods.forEach(methodName => {
    stateAPI[methodName] = (...func) => createNewTrigger([ { type: methodName, func } ]);
  });

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
