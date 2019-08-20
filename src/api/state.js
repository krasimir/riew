/* eslint-disable no-use-before-define, no-return-assign */
import System from './System';
import { isPromise } from '../utils';

var ids = 0;
const getId = () => `@@s${ ++ids }`;

export default function createState(initialValue) {
  let value = initialValue;

  const Queue = function () {
    const items = [];

    function processQueue(payload) {
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
          case 'pipe':
            let pipeResult = func(result, ...payload);

            if (isPromise(pipeResult)) {
              return pipeResult.then(next);
            }
            return next();
          case 'map':
            result = func(result, ...payload);
            if (isPromise(result)) {
              return result.then(asyncResult => {
                result = asyncResult;
                return next();
              });
            }
            return next();
        }
        throw new Error(`Unsupported method ${ type }.`);
      };

      return loop();
    }

    return {
      add(type, func) {
        items.push({ type, func });
      },
      processQueue
    };
  };

  const queue = Queue();
  const methods = ['pipe', 'map'];
  const api = function (...payload) {
    return queue.processQueue(payload);
  };

  api.__id = getId();

  methods.forEach(name => {
    api[name] = function (func) {
      queue.add(name, func);
      return api;
    };
  });

  return api;
};
