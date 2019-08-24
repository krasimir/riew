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

var Queue = function Queue(setStateValue, getStateValue) {
  var predefinedItems = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  var items = [].concat(_toConsumableArray(predefinedItems));

  return {
    add: function add(type, func) {
      items.push({ type: type, func: func });
    },
    process: function process(payload) {
      var index = 0;
      var result = getStateValue();

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
            var pipeResult = (func[0] || function () {}).apply(undefined, [result].concat(_toConsumableArray(payload)));

            if ((0, _utils.isPromise)(pipeResult)) {
              return pipeResult.then(next);
            }
            return next();
          /* -------------------------------------------------- map */
          case 'map':
            result = (func[0] || function (value) {
              return value;
            }).apply(undefined, [result].concat(_toConsumableArray(payload)));
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

            result = mappingFunc.apply(undefined, [result].concat(_toConsumableArray(payload)));
            return next();
          /* -------------------------------------------------- mutate */
          case 'mutate':
            result = (func[0] || function (current, payload) {
              return payload;
            }).apply(undefined, [result].concat(_toConsumableArray(payload)));
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
            var filterResult = func[0].apply(func, [result].concat(_toConsumableArray(payload)));

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
              return f.apply(undefined, [result].concat(_toConsumableArray(payload)));
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
            var conditionResult = func[0].apply(func, [result].concat(_toConsumableArray(payload)));
            var runTruthy = function runTruthy(value) {
              if (value) {
                var r = func[1].apply(func, [result].concat(_toConsumableArray(payload)));

                index = items.length;
                return (0, _utils.isPromise)(r) ? r.then(next) : next();
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
            items = [];
            return result;

        }
        /* -------------------------------------------------- error */
        throw new Error('Unsupported method "' + type + '".');
      };

      return items.length > 0 ? loop() : result;
    },
    cancel: function cancel() {
      items = [];
    },
    clone: function clone() {
      return Queue(setStateValue, getStateValue, items);
    }
  };
};

function createState(initialValue) {
  var value = initialValue;

  var methods = ['pipe', 'map', 'mutate', 'filter', 'parallel', 'branch', 'cancel', 'mapToKey'];
  var stateAPI = {};
  var createdQueues = [];
  var listeners = [];

  var createQueue = function createQueue(typeOfFirstItem, func) {
    var queue = Queue(stateAPI.__set, stateAPI.__get);
    var api = function api() {
      for (var _len = arguments.length, payload = Array(_len), _key = 0; _key < _len; _key++) {
        payload[_key] = arguments[_key];
      }

      return queue.process(payload);
    };

    queue.add(typeOfFirstItem, func);
    api.fork = function () {
      return createQueue(typeOfFirstItem, func);
    };
    methods.forEach(function (methodName) {
      api[methodName] = function () {
        for (var _len2 = arguments.length, func = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          func[_key2] = arguments[_key2];
        }

        queue.add(methodName, func);
        return api;
      };
    });
    createdQueues.push(queue);
    return api;
  };

  stateAPI.__id = getId();
  stateAPI.__get = function () {
    return value;
  };
  stateAPI.__set = function (newValue) {
    value = newValue;
    stateAPI.__triggerListeners();
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
    methods.forEach(function (methodName) {
      return stateAPI[methodName] = function () {};
    });
    createdQueues.forEach(function (q) {
      return q.cancel();
    });
    createdQueues = [];
    listeners = [];
  };
  stateAPI.onUpdate = function () {
    var queueAPI = createQueue('pipe', []);

    listeners.push(queueAPI);
    return queueAPI;
  };

  methods.forEach(function (methodName) {
    stateAPI[methodName] = function () {
      for (var _len3 = arguments.length, func = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        func[_key3] = arguments[_key3];
      }

      return createQueue(methodName, func);
    };
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
      statesMap[key].__set(newValue[key]);
    });
  };
  s.__get = fetchSourceValues;

  Object.keys(statesMap).forEach(function (key) {
    statesMap[key].onUpdate().pipe(s.__triggerListeners);
  });

  return s;
}