'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queueMethods = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.createState = createState;
exports.mergeStates = mergeStates;
exports.isRiewState = isRiewState;
exports.isRiewQueueTrigger = isRiewQueueTrigger;

var _fastDeepEqual = require('fast-deep-equal');

var _fastDeepEqual2 = _interopRequireDefault(_fastDeepEqual);

var _utils = require('./utils');

var _registry = require('./registry');

var _registry2 = _interopRequireDefault(_registry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ids = 0;
var getId = function getId(prefix) {
  return '@@' + prefix + ++ids;
};

var queueMethods = exports.queueMethods = ['pipe', 'map', 'mutate', 'filter', 'parallel', 'mapToKey'];

function createQueue(setStateValue, getStateValue) {
  var onDone = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

  var q = {
    index: 0,
    result: getStateValue(),
    id: getId('q'),
    items: [],
    add: function add(type, func) {
      this.items.push({ type: type, func: func, name: func.map(_utils.getFuncName) });
    },
    process: function process() {
      for (var _len = arguments.length, payload = Array(_len), _key = 0; _key < _len; _key++) {
        payload[_key] = arguments[_key];
      }

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
        var _items$q$index = items[q.index],
            type = _items$q$index.type,
            func = _items$q$index.func;


        switch (type) {
          /* -------------------------------------------------- pipe */
          case 'pipe':
            var pipeResult = (func[0] || function () {}).apply(undefined, [q.result].concat(payload));

            if ((0, _utils.isPromise)(pipeResult)) {
              return pipeResult.then(next);
            }
            return next();
          /* -------------------------------------------------- map */
          case 'map':
            q.result = (func[0] || function (value) {
              return value;
            }).apply(undefined, [q.result].concat(payload));
            if ((0, _utils.isPromise)(q.result)) {
              return q.result.then(function (asyncResult) {
                q.result = asyncResult;
                return next();
              });
            }
            return next();
          /* -------------------------------------------------- map */
          case 'mapToKey':
            var mappingFunc = function mappingFunc(value) {
              return _defineProperty({}, func[0], value);
            };

            q.result = mappingFunc.apply(undefined, [q.result].concat(payload));
            return next();
          /* -------------------------------------------------- mutate */
          case 'mutate':
            q.result = (func[0] || function (current, payload) {
              return payload;
            }).apply(undefined, [q.result].concat(payload));
            if ((0, _utils.isPromise)(q.result)) {
              return q.result.then(function (asyncResult) {
                q.result = asyncResult;
                setStateValue(q.result);
                return next();
              });
            }
            setStateValue(q.result);
            return next();
          /* -------------------------------------------------- filter */
          case 'filter':
            var filterResult = func[0].apply(func, [q.result].concat(payload));

            if ((0, _utils.isPromise)(filterResult)) {
              return filterResult.then(function (asyncResult) {
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
            q.result = func.map(function (f) {
              return f.apply(undefined, [q.result].concat(payload));
            });
            var promises = q.result.filter(_utils.isPromise);

            if (promises.length > 0) {
              return Promise.all(promises).then(function () {
                q.result.forEach(function (r, index) {
                  if ((0, _utils.isPromise)(r)) {
                    r.then(function (value) {
                      return q.result[index] = value;
                    });
                  }
                });
                return next();
              });
            }
            return next();

        }
        /* -------------------------------------------------- error */
        throw new Error('Unsupported method "' + type + '".');
      };

      return items.length > 0 ? loop() : q.result;
    },
    teardown: function teardown() {
      this.items = [];
    }
  };

  return q;
}

function implementIterable(stateAPI) {
  if (typeof Symbol !== 'undefined' && typeof Symbol.iterator !== 'undefined') {
    stateAPI[Symbol.iterator] = function () {
      var values = [stateAPI.map(), stateAPI.mutate(), stateAPI];
      var i = 0;

      return {
        next: function next() {
          return {
            value: values[i++],
            done: i > values.length
          };
        }
      };
    };
  }
}

function createState(initialValue) {
  var value = initialValue;
  var stateAPI = {};
  var createdQueues = [];
  var listeners = [];
  var active = true;
  var exportedAs = void 0;

  stateAPI.id = getId('s');
  stateAPI.__riew = true;
  stateAPI.__triggerListeners = function () {
    (0, _fastDeepEqual2.default)('a', 'b');
    listeners.forEach(function (l) {
      return l();
    });
  };
  stateAPI.__listeners = function () {
    return listeners;
  };
  stateAPI.__queues = function () {
    return createdQueues;
  };

  stateAPI.active = function () {
    return active;
  };
  stateAPI.get = function () {
    return value;
  };
  stateAPI.set = function (newValue) {
    var callListeners = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var isEqual = (0, _fastDeepEqual2.default)(value, newValue);

    value = newValue;
    if (callListeners && !isEqual) stateAPI.__triggerListeners();
  };
  stateAPI.teardown = function () {
    createdQueues.forEach(function (q) {
      return q.teardown();
    });
    createdQueues = [];
    listeners = [];
    active = false;
    if (exportedAs) _registry2.default.free(exportedAs);
  };
  stateAPI.export = function (key) {
    // if already exported with different key
    if (exportedAs) _registry2.default.free(exportedAs);
    _registry2.default.add(exportedAs = key, stateAPI);
    return stateAPI;
  };

  queueMethods.forEach(function (methodName) {
    stateAPI[methodName] = function () {
      for (var _len2 = arguments.length, func = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        func[_key2] = arguments[_key2];
      }

      return createNewTrigger([{ type: methodName, func: func }]);
    };
  });
  implementIterable(stateAPI);

  function addListener(trigger) {
    trigger.__isStream = true;
    listeners.push(trigger);
  }
  function removeListener(trigger) {
    trigger.__isStream = false;
    listeners = listeners.filter(function (_ref2) {
      var id = _ref2.id;
      return id !== trigger.id;
    });
  }
  function addQueue(q) {
    createdQueues.push(q);
  }
  function removeQueue(q) {
    createdQueues = createdQueues.filter(function (_ref3) {
      var id = _ref3.id;
      return q.id !== id;
    });
  }
  function createNewTrigger() {
    var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var trigger = function trigger() {
      if (active === false || trigger.__itemsToCreate.length === 0) return stateAPI.get();
      var queue = createQueue(stateAPI.set, stateAPI.get, removeQueue);

      addQueue(queue);
      trigger.__itemsToCreate.forEach(function (_ref4) {
        var type = _ref4.type,
            func = _ref4.func;
        return queue.add(type, func);
      });
      return queue.process.apply(queue, arguments);
    };

    trigger.id = getId('t');
    trigger.__isStream = false;
    trigger.__riewTrigger = true;
    trigger.__itemsToCreate = [].concat(_toConsumableArray(items));
    trigger.__state = stateAPI;

    // queue methods
    queueMethods.forEach(function (m) {
      trigger[m] = function () {
        for (var _len3 = arguments.length, func = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          func[_key3] = arguments[_key3];
        }

        return createNewTrigger([].concat(_toConsumableArray(trigger.__itemsToCreate), [{ type: m, func: func }]));
      };
    });

    // not supported in queue methods
    ['set', 'get', 'teardown'].forEach(function (stateMethod) {
      trigger[stateMethod] = function () {
        throw new Error('"' + stateMethod + '" is not a queue method but a method of the state object.');
      };
    });

    // trigger direct methods
    trigger.isMutating = function () {
      return !!trigger.__itemsToCreate.find(function (_ref5) {
        var type = _ref5.type;
        return type === 'mutate';
      });
    };
    trigger.subscribe = function () {
      var initialCall = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (trigger.isMutating()) {
        throw new Error('You should not subscribe a trigger that mutates the state. This will lead to endless recursion.');
      }
      if (initialCall) trigger();
      addListener(trigger);
      return trigger;
    };
    trigger.unsubscribe = function () {
      removeListener(trigger);
      return trigger;
    };
    trigger.cancel = function () {
      trigger.__itemsToCreate = [];
      queueMethods.forEach(function (m) {
        return trigger[m] = function () {
          return trigger;
        };
      });
      return trigger;
    };
    trigger.test = function (callback) {
      var testTrigger = createNewTrigger([].concat(_toConsumableArray(trigger.__itemsToCreate)));
      var tools = {
        setValue: function setValue(newValue) {
          testTrigger.__itemsToCreate = [{ type: 'map', func: [function () {
              return newValue;
            }] }].concat(_toConsumableArray(testTrigger.__itemsToCreate));
        },
        swap: function swap(index, funcs, type) {
          if (!Array.isArray(funcs)) funcs = [funcs];
          testTrigger.__itemsToCreate[index].func = funcs;
          if (type) {
            testTrigger.__itemsToCreate[index].type = type;
          }
        },
        swapFirst: function swapFirst(funcs, type) {
          tools.swap(0, funcs, type);
        },
        swapLast: function swapLast(funcs, type) {
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

function mergeStates(statesMap) {
  var fetchSourceValues = function fetchSourceValues() {
    return Object.keys(statesMap).reduce(function (result, key) {
      result[key] = statesMap[key].get();
      return result;
    }, {});
  };
  var s = createState(fetchSourceValues());

  s.set = function (newValue) {
    if ((typeof newValue === 'undefined' ? 'undefined' : _typeof(newValue)) !== 'object') {
      throw new Error('Wrong merged state value. Must be key-value pairs.');
    }
    Object.keys(newValue).forEach(function (key) {
      statesMap[key].set(newValue[key], false);
    });
    s.__triggerListeners();
  };
  s.get = fetchSourceValues;

  Object.keys(statesMap).forEach(function (key) {
    statesMap[key].pipe(function () {
      s.__triggerListeners();
    }).subscribe();
  });

  return s;
}

function isRiewState(obj) {
  return obj && obj.__riew === true;
}

function isRiewQueueTrigger(func) {
  return func && func.__riewTrigger === true;
}