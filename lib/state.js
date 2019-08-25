'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.createState = createState;
exports.mergeStates = mergeStates;

var _utils = require('./utils');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /* eslint-disable no-use-before-define, no-return-assign */


var ids = 0;
var getId = function getId() {
  return '@@s' + ++ids;
};
var queueMethods = ['pipe', 'map', 'mutate', 'filter', 'parallel', 'branch', 'cancel', 'mapToKey'];

function createQueue(setStateValue, getStateValue) {
  var predefinedItems = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var onCreated = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};

  var q = {
    items: [].concat(_toConsumableArray(predefinedItems)),
    add: function add(type, func) {
      this.items.push({ type: type, func: func });
    },
    trigger: function trigger() {
      for (var _len = arguments.length, payload = Array(_len), _key = 0; _key < _len; _key++) {
        payload[_key] = arguments[_key];
      }

      var index = 0;
      var result = getStateValue();
      var items = q.items;
      var resetItems = function resetItems() {
        return q.items = [];
      };

      function next() {
        index++;
        if (index < items.length) {
          return loop();
        }
        return result;
      };
      function loop() {
        var _items$index = items[index],
            type = _items$index.type,
            func = _items$index.func;


        switch (type) {
          /* -------------------------------------------------- pipe */
          case 'pipe':
            var pipeResult = (func[0] || function () {}).apply(undefined, [result].concat(payload));

            if ((0, _utils.isPromise)(pipeResult)) {
              return pipeResult.then(next);
            }
            return next();
          /* -------------------------------------------------- map */
          case 'map':
            result = (func[0] || function (value) {
              return value;
            }).apply(undefined, [result].concat(payload));
            if ((0, _utils.isPromise)(result)) {
              return result.then(function (asyncResult) {
                result = asyncResult;
                return next();
              });
            }
            return next();
          /* -------------------------------------------------- map */
          case 'mapToKey':
            var mappingFunc = function mappingFunc(value) {
              return _defineProperty({}, func[0], value);
            };

            result = mappingFunc.apply(undefined, [result].concat(payload));
            return next();
          /* -------------------------------------------------- mutate */
          case 'mutate':
            result = (func[0] || function (current, payload) {
              return payload;
            }).apply(undefined, [result].concat(payload));
            if ((0, _utils.isPromise)(result)) {
              return result.then(function (asyncResult) {
                result = asyncResult;
                setStateValue(result);
                return next();
              });
            }
            setStateValue(result);
            return next();
          /* -------------------------------------------------- filter */
          case 'filter':
            var filterResult = func[0].apply(func, [result].concat(payload));

            if ((0, _utils.isPromise)(filterResult)) {
              return filterResult.then(function (asyncResult) {
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
            result = func.map(function (f) {
              return f.apply(undefined, [result].concat(payload));
            });
            var promises = result.filter(_utils.isPromise);

            if (promises.length > 0) {
              return Promise.all(promises).then(function () {
                result.forEach(function (r, index) {
                  if ((0, _utils.isPromise)(r)) {
                    r.then(function (value) {
                      return result[index] = value;
                    });
                  }
                });
                return next();
              });
            }
            return next();
          /* -------------------------------------------------- branch */
          case 'branch':
            var conditionResult = func[0].apply(func, [result].concat(payload));
            var runTruthy = function runTruthy(value) {
              if (value) {
                index = items.length - 1;
                var truthyResult = func[1](q.trigger);

                if ((0, _utils.isPromise)(truthyResult)) {
                  return truthyResult.then(next);
                }
              }
              return next();
            };

            if ((0, _utils.isPromise)(conditionResult)) {
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
        throw new Error('Unsupported method "' + type + '".');
      };

      return items.length > 0 ? loop() : result;
    },
    cancel: function cancel() {
      this.items = [];
    },
    clone: function clone() {
      return createQueue(setStateValue, getStateValue, q.items.map(function (_ref2) {
        var type = _ref2.type,
            func = _ref2.func;
        return { type: type, func: func };
      }), onCreated);
    }
  };

  queueMethods.forEach(function (methodName) {
    q.trigger[methodName] = function () {
      for (var _len2 = arguments.length, func = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        func[_key2] = arguments[_key2];
      }

      q.add(methodName, func);
      return q.trigger;
    };
  });

  q.trigger.fork = function () {
    return q.clone().trigger;
  };
  q.trigger.test = function (callback) {
    var newQueue = q.clone();
    var tools = {
      setValue: function setValue(newValue) {
        newQueue.items = [{ type: 'map', func: [function () {
            return newValue;
          }] }].concat(_toConsumableArray(newQueue.items));
      },
      swap: function swap(index, funcs, type) {
        if (!Array.isArray(funcs)) funcs = [funcs];
        newQueue.items[index].func = funcs;
        if (type) {
          newQueue.items[index].type = type;
        }
      },
      swapFirst: function swapFirst(funcs, type) {
        tools.swap(0, funcs, type);
      },
      swapLast: function swapLast(funcs, type) {
        tools.swap(newQueue.items.length - 1, funcs, type);
      }
    };

    callback(tools);

    return newQueue.trigger;
  };
  ['set', 'get', 'teardown', 'stream'].forEach(function (stateMethod) {
    q.trigger[stateMethod] = function () {
      throw new Error('"' + stateMethod + '" is not a queue method but a method of the state object.');
    };
  });

  onCreated(q);

  return q;
}

function createState(initialValue) {
  var value = initialValue;
  var stateAPI = {};
  var createdQueues = [];
  var listeners = [];

  stateAPI.__id = getId();
  stateAPI.__get = function () {
    return value;
  };
  stateAPI.__set = function (newValue) {
    var callListeners = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    value = newValue;
    if (callListeners) stateAPI.__triggerListeners();
  };
  stateAPI.__triggerListeners = function () {
    return listeners.forEach(function (l) {
      return l();
    });
  };
  stateAPI.__listeners = function () {
    return listeners;
  };
  stateAPI.__queues = function () {
    return createdQueues;
  };

  stateAPI.set = function (newValue) {
    return stateAPI.mutate()(newValue);
  };
  stateAPI.get = function () {
    return stateAPI.map()();
  };
  stateAPI.teardown = function () {
    createdQueues.forEach(function (q) {
      return q.cancel();
    });
    createdQueues = [];
    listeners = [];
  };
  stateAPI.stream = function () {
    return stateAPI.__get();
  };

  [{ obj: stateAPI, type: 'normal' }, { obj: stateAPI.stream, type: 'stream' }].forEach(function (_ref3) {
    var obj = _ref3.obj,
        type = _ref3.type;

    queueMethods.forEach(function (methodName) {
      obj[methodName] = function () {
        for (var _len3 = arguments.length, func = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          func[_key3] = arguments[_key3];
        }

        var queue = createQueue(stateAPI.__set, stateAPI.__get, [], function (q) {
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

function mergeStates(statesMap) {
  var fetchSourceValues = function fetchSourceValues() {
    return Object.keys(statesMap).reduce(function (result, key) {
      result[key] = statesMap[key].__get();
      return result;
    }, {});
  };
  var s = createState(fetchSourceValues());

  s.__set = function (newValue) {
    if ((typeof newValue === 'undefined' ? 'undefined' : _typeof(newValue)) !== 'object') {
      throw new Error('Wrong merged state value. Must be key-value pairs.');
    }
    Object.keys(newValue).forEach(function (key) {
      statesMap[key].__set(newValue[key], false);
    });
    s.__triggerListeners();
  };
  s.__get = fetchSourceValues;

  Object.keys(statesMap).forEach(function (key) {
    statesMap[key].stream.pipe(function () {
      s.__triggerListeners();
    });
  });

  return s;
}