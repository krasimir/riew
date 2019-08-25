/* eslint-disable no-use-before-define, no-return-assign */
import { isPromise } from './utils';

var ids = 0;
const getId = () => `@@s${ ++ids }`;
const queueMethods = [
  'pipe',
  'map',
  'mutate',
  'filter',
  'parallel',
  'branch',
  'cancel',
  'mapToKey'
];

function createQueue(setStateValue, getStateValue, predefinedItems = [], onCreated = () => {}) {
  const q = {
    items: [ ...predefinedItems ],
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
          /* -------------------------------------------------- branch */
          case 'branch':
            const conditionResult = func[0](result, ...payload);
            const runTruthy = (value) => {
              if (value) {
                index = items.length - 1;
                const truthyResult = func[1](q.trigger);

                if (isPromise(truthyResult)) {
                  return truthyResult.then(next);
                }
              }
              return next();
            };

            if (isPromise(conditionResult)) {
              return conditionResult.then(runTruthy);
            }
            return runTruthy(conditionResult);
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
    },
    clone() {
      return createQueue(
        setStateValue,
        getStateValue,
        q.items.map(({ type, func }) => ({ type, func })),
        onCreated
      );
    }
  };

  queueMethods.forEach(methodName => {
    q.trigger[methodName] = (...func) => {
      q.add(methodName, func);
      return q.trigger;
    };
  });

  q.trigger.fork = function () {
    return q.clone().trigger;
  };
  q.trigger.test = function (callback) {
    const newQueue = q.clone();
    const tools = {
      setValue(newValue) {
        newQueue.items = [ { type: 'map', func: [ () => newValue ] }, ...newQueue.items ];
      },
      swap(index, funcs, type) {
        if (!Array.isArray(funcs)) funcs = [funcs];
        newQueue.items[index].func = funcs;
        if (type) {
          newQueue.items[index].type = type;
        }
      },
      swapFirst(funcs, type) {
        tools.swap(0, funcs, type);
      },
      swapLast(funcs, type) {
        tools.swap(newQueue.items.length - 1, funcs, type);
      }
    };

    callback(tools);

    return newQueue.trigger;
  };
  ['set', 'get', 'teardown', 'stream'].forEach(stateMethod => {
    q.trigger[stateMethod] = () => {
      throw new Error(`"${ stateMethod }" is not a queue method but a method of the state object.`);
    };
  });

  onCreated(q);

  return q;
}

export function createState(initialValue) {
  let value = initialValue;
  const stateAPI = {};
  let createdQueues = [];
  let listeners = [];

  stateAPI.__id = getId();
  stateAPI.__get = () => value;
  stateAPI.__set = (newValue, callListeners = true) => {
    value = newValue;
    if (callListeners) stateAPI.__triggerListeners();
  };
  stateAPI.__triggerListeners = () => listeners.forEach(l => l());
  stateAPI.__listeners = () => listeners;
  stateAPI.__queues = () => createdQueues;

  stateAPI.set = (newValue) => stateAPI.mutate()(newValue);
  stateAPI.get = () => stateAPI.map()();
  stateAPI.teardown = () => {
    createdQueues.forEach(q => q.cancel());
    createdQueues = [];
    listeners = [];
  };
  stateAPI.stream = () => stateAPI.__get();

  [
    { obj: stateAPI, type: 'normal' },
    { obj: stateAPI.stream, type: 'stream' }
  ].forEach(({ obj, type }) => {
    queueMethods.forEach(methodName => {
      obj[methodName] = (...func) => {
        const queue = createQueue(stateAPI.__set, stateAPI.__get, [], (q) => {
          createdQueues.push(q);
          if (type === 'stream') {
            listeners.push(q.trigger);
          }
        });

        queue.add(methodName, func);
        return queue.trigger;
      };
    });
  });

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
