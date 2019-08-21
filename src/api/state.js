/* eslint-disable no-use-before-define, no-return-assign */
import System from './System';
import { isPromise } from '../utils';

var ids = 0;
const getId = () => `@@s${ ++ids }`;

function processQueue(payload, value, items, setStateValue) {
  let index = 0;
  let result = value;

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
        let pipeResult = (func || function () {})(result, ...payload);

        if (isPromise(pipeResult)) {
          return pipeResult.then(next);
        }
        return next();
      /* -------------------------------------------------- map */
      case 'map':
        result = func(result, ...payload);
        if (isPromise(result)) {
          return result.then(asyncResult => {
            result = asyncResult;
            return next();
          });
        }
        return next();
      /* -------------------------------------------------- mutate */
      case 'mutate':
          result = func(result, ...payload);
          if (isPromise(result)) {
            return result.then(asyncResult => {
              result = asyncResult;
              setStateValue(result);
              return next();
            });
          }
          setStateValue(result);
          return next();
      /* -------------------------------------------------- mutate */
      case 'filter':
        let filterResult = func(result, ...payload);

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
    }
    throw new Error(`Unsupported method "${ type }".`);
  };

  return loop();
}

export default function createState(initialValue) {
  let value = initialValue;

  const methods = ['pipe', 'map', 'mutate', 'filter'];
  const stateAPI = {};

  const Queue = function (setStateValue) {
    const items = [];

    return {
      add: (type, func) => items.push({ type, func }),
      process: (payload) => processQueue(payload, value, items, setStateValue)
    };
  };
  const createQueue = function (typeOfFirstItem, func) {
    const queue = Queue(stateAPI.__set);
    const api = (...payload) => queue.process(payload);

    queue.add(typeOfFirstItem, func);
    methods.forEach(methodName => {
      api[methodName] = (func) => {
        queue.add(methodName, func);
        return api;
      };
    });
    return api;
  };

  stateAPI.__id = getId();
  stateAPI.__get = () => value;
  stateAPI.__set = (newValue) => (value = newValue);

  methods.forEach(methodName => {
    stateAPI[methodName] = (func) => createQueue(methodName, func);
  });

  return stateAPI;
};
