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

const createQueue = function (setStateValue, getStateValue, predefinedItems = []) {
  let items = [ ...predefinedItems ];

  const q = {
    items,
    add(type, func) {
      items.push({ type, func });
    },
    trigger(...payload) {
      let index = 0;
      let result = getStateValue();

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
            items = [];
            return result;

        }
        /* -------------------------------------------------- error */
        throw new Error(`Unsupported method "${ type }".`);
      };

      return items.length > 0 ? loop() : result;
    },
    cancel() {
      items = [];
    },
    clone() {
      return createQueue(setStateValue, getStateValue, items);
    }
  };

  queueMethods.forEach(methodName => {
    q.trigger[methodName] = (...func) => {
      q.add(methodName, func);
      return q.trigger;
    };
  });

  q.trigger.fork = () => q.clone().trigger;
  q.trigger.test = ({ value: mockValue, swap }) => {
    // value = mockValue;
    // return facade;
  };
  ['set', 'get', 'teardown', 'stream'].forEach(stateMethod => {
    q.trigger[stateMethod] = () => {
      throw new Error(`"${ stateMethod }" is not a queue method but a method of the state object.`);
    };
  });

  return q;
};

const enhanceToQueueInterface = function (obj, onCreated = () => {}) {
  queueMethods.forEach(methodName => {
    obj[methodName] = (...func) => {
      const queue = createQueue(obj.__set, obj.__get);

      queue.add(methodName, func);

      onCreated(queue);
      return queue.trigger;
    };
  });
};

export function createState(initialValue) {
  let value = initialValue;
  const stateAPI = {};
  let createdQueues = [];
  let listeners = [];

  stateAPI.__id = getId();
  stateAPI.__get = () => value;
  stateAPI.__set = (newValue) => {
    value = newValue;
    stateAPI.__triggerListeners();
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
  stateAPI.stream.__set = stateAPI.__set;
  stateAPI.stream.__get = stateAPI.__get;

  enhanceToQueueInterface(stateAPI, newQueue => {
    createdQueues.push(newQueue);
  });
  enhanceToQueueInterface(stateAPI.stream, (newQueue) => {
    createdQueues.push(newQueue);
    listeners.push(newQueue.trigger);
  });

  return stateAPI;
};

export function mergeStates(statesMap) {
  const fetchSourceValues = () => Object.keys(statesMap).reduce((result, key) => {
    result[key] = statesMap[key].__get();
    return result;
  }, {});
  const s = createState(fetchSourceValues());

  s.__set = s.stream.__set = (newValue) => {
    if (typeof newValue !== 'object') {
      throw new Error('Wrong merged state value. Must be key-value pairs.');
    }
    Object.keys(newValue).forEach(key => {
      statesMap[key].__set(newValue[key]);
    });
  };
  s.__get = s.stream.__get = fetchSourceValues;

  Object.keys(statesMap).forEach(key => {
    statesMap[key].stream.pipe(s.__triggerListeners);
  });

  return s;
}
