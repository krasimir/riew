'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MUTABLE = exports.IMMUTABLE = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.createState = createState;
exports.mergeStates = mergeStates;
exports.createStream = createStream;
exports.isRineState = isRineState;
exports.isRineQueueTrigger = isRineQueueTrigger;

var _utils = require('./utils');

var _system = require('./system');

var _system2 = _interopRequireDefault(_system);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var IMMUTABLE = exports.IMMUTABLE = 'IMMUTABLE';
var MUTABLE = exports.MUTABLE = 'MUTABLE';

var ids = 0;
var getId = function getId(prefix) {
  return '@@' + prefix + ++ids;
};
var queueMethods = ['pipe', 'map', 'mutate', 'filter', 'parallel', 'cancel', 'mapToKey'];
var getTriggerActivity = function getTriggerActivity(items) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;

      if (item.type === 'mutate') return MUTABLE;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return IMMUTABLE;
};

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
      var resetItems = function resetItems() {
        return q.items = [];
      };

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
          /* -------------------------------------------------- cancel */
          case 'cancel':
            q.index = -1;
            resetItems();
            return q.result;

        }
        /* -------------------------------------------------- error */
        throw new Error('Unsupported method "' + type + '".');
      };

      return items.length > 0 ? loop() : q.result;
    },
    cancel: function cancel() {
      this.items = [];
    }
  };

  return q;
}

function createState(initialValue) {
  var value = initialValue;
  var stateAPI = {};
  var createdQueues = [];
  var listeners = [];
  var active = true;

  stateAPI.__rine = true;
  stateAPI.id = getId('s');
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

  stateAPI.active = function () {
    return active;
  };
  stateAPI.get = function () {
    return value;
  };
  stateAPI.set = function (newValue) {
    var callListeners = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    value = newValue;
    if (callListeners) stateAPI.__triggerListeners();
  };
  stateAPI.teardown = function () {
    createdQueues.forEach(function (q) {
      return q.cancel();
    });
    createdQueues = [];
    listeners = [];
    active = false;
    if (__DEV__) _system2.default.onStateTeardown(stateAPI);
  };
  stateAPI.stream = createStreamObj();

  function createStreamObj() {
    return function () {
      if (arguments.length > 0) {
        stateAPI.set(arguments.length <= 0 ? undefined : arguments[0]);
      } else {
        stateAPI.__triggerListeners();
      }
    };
  }
  function removeListener(_ref2) {
    var toRemove = _ref2.id;

    listeners = listeners.filter(function (_ref3) {
      var id = _ref3.id;
      return id !== toRemove;
    });
  }

  function enhanceToQueueAPI(obj, isStream) {
    function createNewTrigger() {
      var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var isStream = arguments[1];
      var previousTrigger = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var trigger = function trigger() {
        if (active === false) return stateAPI.get();
        var queue = createQueue(stateAPI.set, stateAPI.get, function (q) {
          return createdQueues = createdQueues.filter(function (_ref4) {
            var id = _ref4.id;
            return q.id !== id;
          });
        });

        createdQueues.push(queue);
        trigger.__itemsToCreate.forEach(function (_ref5) {
          var type = _ref5.type,
              func = _ref5.func;
          return queue.add(type, func);
        });
        return queue.process.apply(queue, arguments);
      };

      trigger.id = getId('t');
      trigger.stream = createStreamObj();
      trigger.__rineTrigger = true;
      trigger.__itemsToCreate = [].concat(_toConsumableArray(items));
      trigger.__state = stateAPI;
      trigger.__activity = function () {
        return getTriggerActivity(trigger.__itemsToCreate);
      };

      // queue methods
      queueMethods.forEach(function (m) {
        trigger[m] = function () {
          for (var _len2 = arguments.length, func = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            func[_key2] = arguments[_key2];
          }

          return createNewTrigger([].concat(_toConsumableArray(items), [{ type: m, func: func }]), isStream, trigger);
        };
        trigger.stream[m] = function () {
          for (var _len3 = arguments.length, func = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            func[_key3] = arguments[_key3];
          }

          return createNewTrigger([].concat(_toConsumableArray(items), [{ type: m, func: func }]), true, trigger);
        };
      });
      // not supported in queue methods
      ['set', 'get', 'teardown'].forEach(function (stateMethod) {
        trigger[stateMethod] = function () {
          throw new Error('"' + stateMethod + '" is not a queue method but a method of the state object.');
        };
      });
      // other methods
      trigger.test = function (callback) {
        var testTrigger = createNewTrigger([].concat(_toConsumableArray(items)), isStream, trigger);
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

      if (isStream) {
        listeners.push(trigger);
        if (previousTrigger) removeListener(previousTrigger);
      }

      return trigger;
    }

    queueMethods.forEach(function (methodName) {
      obj[methodName] = function () {
        for (var _len4 = arguments.length, func = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          func[_key4] = arguments[_key4];
        }

        return createNewTrigger([{ type: methodName, func: func }], isStream);
      };
    });
  };

  enhanceToQueueAPI(stateAPI);
  enhanceToQueueAPI(stateAPI.stream, true);
  if (__DEV__) _system2.default.onStateCreated(stateAPI);

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
    statesMap[key].stream.pipe(function () {
      s.__triggerListeners();
    });
  });

  return s;
}

function createStream(initialValue) {
  return createState(initialValue).stream;
}

function isRineState(obj) {
  return obj && obj.__rine === true;
}

function isRineQueueTrigger(func) {
  return func && func.__rineTrigger === true;
}