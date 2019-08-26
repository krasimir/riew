/* eslint-disable no-use-before-define, no-return-assign */
import { isPromise } from './utils';

var ids = 0;
const getId = (prefix) => `@@${ prefix }${ ++ids }`;
const queueMethods = [
  'pipe',
  'map',
  'mutate',
  'filter',
  'parallel',
  'cancel',
  'mapToKey'
];

function createQueue(
  setStateValue,
  getStateValue,
  onDone = () => {}
) {
  const q = {
    id: getId('q'),
    items: [],
    add(type, func) {
      this.items.push({ type, func });
    },
    trigger(...payload) {
      let index = 0;
      let result = getStateValue();
      var items = q.items;
      const resetItems = () => (q.items = []);

      function next() {
        index++;
        if (index < items.length) {
          return loop();
        }
        onDone(q);
        return result;
      };
      function loop() {
        const { type, func } = items[index];

        switch (type) {
          /* -------------------------------------------------- pipe */
          case 'pipe':
            let pipeResult = (func[0] || function () {})(result, ...payload);

            if (isPromise(pipeResult)) {
              return pipeResult.then(next);
            }
            return next();
          /* -------------------------------------------------- map */
          case 'map':
            result = (func[0] || (value => value))(result, ...payload);
            if (isPromise(result)) {
              return result.then(asyncResult => {
                result = asyncResult;
                return next();
              });
            }
            return next();
          /* -------------------------------------------------- map */
          case 'mapToKey':
            const mappingFunc = (value) => ({ [func[0]]: value });

            result = mappingFunc(result, ...payload);
            return next();
          /* -------------------------------------------------- mutate */
          case 'mutate':
              result = (func[0] || ((current, payload) => payload))(result, ...payload);
              if (isPromise(result)) {
                return result.then(asyncResult => {
                  result = asyncResult;
                  setStateValue(result);
                  return next();
                });
              }
              setStateValue(result);
              return next();
          /* -------------------------------------------------- filter */
          case 'filter':
            let filterResult = func[0](result, ...payload);

            if (isPromise(filterResult)) {
              return filterResult.then(asyncResult => {
                if (!asyncResult) {
                  index = items.length;
                }
                return next();
              });
            }
            if (!filterResult) {
              index = items.length;
            }
            return next();
          /* -------------------------------------------------- parallel */
          case 'parallel':
            result = func.map(f => f(result, ...payload));
            const promises = result.filter(isPromise);

            if (promises.length > 0) {
              return Promise.all(promises).then(() => {
                result.forEach((r, index) => {
                  if (isPromise(r)) {
                    r.then(value => (result[index] = value));
                  }
                });
                return next();
              });
            }
            return next();
          /* -------------------------------------------------- cancel */
          case 'cancel':
            index = -1;
            resetItems();
            return result;

        }
        /* -------------------------------------------------- error */
        throw new Error(`Unsupported method "${ type }".`);
      };

      return items.length > 0 ? loop() : result;
    },
    cancel() {
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

  stateAPI.id = getId('s');
  stateAPI.__get = () => value;
  stateAPI.__set = (newValue, callListeners = true) => {
    value = newValue;
    if (callListeners) stateAPI.__triggerListeners();
  };
  stateAPI.__triggerListeners = () => listeners.forEach(l => l());
  stateAPI.__listeners = () => listeners;
  stateAPI.__queues = () => createdQueues;

  stateAPI.set = (newValue) => stateAPI.__set(newValue);
  stateAPI.get = () => stateAPI.map()();
  stateAPI.teardown = () => {
    createdQueues.forEach(q => q.cancel());
    createdQueues = [];
    listeners = [];
    active = false;
  };
  stateAPI.stream = (...args) => {
    if (args.length > 0) {
      stateAPI.__set(args[0]);
    } else {
      stateAPI.__triggerListeners();
    }
  };

  function enhanceToQueueAPI(obj, isStream) {
    function createNewTrigger(items = []) {
      const trigger = function (...payload) {
        if (active === false) return stateAPI.__get();
        const queue = createQueue(
          stateAPI.__set,
          stateAPI.__get,
          (q) => createdQueues = createdQueues.filter(({ id }) => q.id !== id)
        );

        createdQueues.push(queue);

        trigger.itemsToCreate.forEach(({ type, func }) => queue.add(type, func));
        return queue.trigger(...payload);
      };

      trigger.itemsToCreate = [ ...items ];

      // queue methods
      queueMethods.forEach(m => {
        trigger[m] = (...func) => {
          trigger.itemsToCreate.push({ type: m, func });
          return trigger;
        };
      });
      // not supported in queue methods
      ['set', 'get', 'teardown', 'stream'].forEach(stateMethod => {
        trigger[stateMethod] = () => {
          throw new Error(`"${ stateMethod }" is not a queue method but a method of the state object.`);
        };
      });
      // other methods
      trigger.fork = () => createNewTrigger(trigger.itemsToCreate);
      trigger.test = function (callback) {
        const testTrigger = createNewTrigger(trigger.itemsToCreate);
        const tools = {
          setValue(newValue) {
            testTrigger.itemsToCreate = [
              { type: 'map', func: [ () => newValue ] },
              ...testTrigger.itemsToCreate
            ];
          },
          swap(index, funcs, type) {
            if (!Array.isArray(funcs)) funcs = [funcs];
            testTrigger.itemsToCreate[index].func = funcs;
            if (type) {
              testTrigger.itemsToCreate[index].type = type;
            }
          },
          swapFirst(funcs, type) {
            tools.swap(0, funcs, type);
          },
          swapLast(funcs, type) {
            tools.swap(testTrigger.itemsToCreate.length - 1, funcs, type);
          }
        };

        callback(tools);

        return testTrigger;
      };

      return trigger;
    }

    queueMethods.forEach(methodName => {
      obj[methodName] = function (...func) {
        const trigger = createNewTrigger([ { type: methodName, func } ]);

        if (isStream) {
          listeners.push(trigger);
        }
        return trigger;
      };
    });
  };

  enhanceToQueueAPI(stateAPI);
  enhanceToQueueAPI(stateAPI.stream, true);

  return stateAPI;
};

export function mergeStates(statesMap) {
  const fetchSourceValues = () => Object.keys(statesMap).reduce((result, key) => {
    result[key] = statesMap[key].__get();
    return result;
  }, {});
  const s = createState(fetchSourceValues());

  s.__set = (newValue) => {
    if (typeof newValue !== 'object') {
      throw new Error('Wrong merged state value. Must be key-value pairs.');
    }
    Object.keys(newValue).forEach(key => {
      statesMap[key].__set(newValue[key], false);
    });
    s.__triggerListeners();
  };
  s.__get = fetchSourceValues;

  Object.keys(statesMap).forEach(key => {
    statesMap[key].stream.pipe(() => {
      s.__triggerListeners();
    });
  });

  return s;
}

export function createStream(initialValue) {
  return createState(initialValue).stream;
}
