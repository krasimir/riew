'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.implementIterable = undefined;

exports.default = function (initialValue) {
  var state = (0, _core2.default)(initialValue);
  var queueMethods = [];
  var queueAPI = {};
  var triggers = [];

  function createNewTrigger() {
    var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var exportedAs = void 0;
    var active = true;

    var trigger = function trigger() {
      if (!active || trigger.__itemsToCreate.length === 0) return state.get();
      var queue = (0, _queue2.default)(state.set, state.get, function () {
        trigger.__queues = trigger.__queues.filter(function (_ref) {
          var id = _ref.id;
          return queue.id !== id;
        });
      }, queueAPI);

      trigger.__queues.push(queue);
      trigger.__itemsToCreate.forEach(function (_ref2) {
        var type = _ref2.type,
            func = _ref2.func;
        return queue.add(type, func);
      });
      return queue.process.apply(queue, arguments);
    };

    triggers.push(trigger);
    implementIterable(trigger);

    trigger.id = (0, _utils.getId)('t');
    trigger.state = state;
    trigger.__queues = [];
    trigger.__riewTrigger = true;
    trigger.__itemsToCreate = [].concat(_toConsumableArray(items));
    trigger.__listeners = state.listeners;

    // queue methods
    queueMethods.forEach(function (m) {
      trigger[m] = function () {
        for (var _len = arguments.length, methodArgs = Array(_len), _key = 0; _key < _len; _key++) {
          methodArgs[_key] = arguments[_key];
        }

        return createNewTrigger([].concat(_toConsumableArray(trigger.__itemsToCreate), [{ type: m, func: methodArgs }]));
      };
    });

    // trigger direct methods
    trigger.define = function (methodName, func) {
      defineQueueMethod(methodName, func);
      return trigger;
    };
    trigger.isMutating = function () {
      return !!trigger.__itemsToCreate.find(function (_ref3) {
        var type = _ref3.type;
        return type === 'mutate';
      });
    };
    trigger.subscribe = function () {
      var initialCall = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (trigger.isMutating()) {
        throw new Error('You should not subscribe a trigger that mutates the state. This will lead to endless recursion.');
      }
      if (initialCall) trigger();
      state.addListener(trigger);
      return trigger;
    };
    trigger.unsubscribe = function () {
      state.removeListener(trigger);
      return trigger;
    };
    trigger.cancel = function () {
      trigger.__queues.forEach(function (q) {
        return q.cancel();
      });
      return trigger;
    };
    trigger.cleanUp = function () {
      active = false;
      trigger.cancel();
      trigger.unsubscribe();
      if (exportedAs) _registry2.default.free(exportedAs);
    };
    trigger.teardown = function () {
      state.teardown();
      triggers.forEach(function (t) {
        return t.cleanUp();
      });
      triggers = [trigger];
      return trigger;
    };
    trigger.export = function (key) {
      // if already exported with different key
      if (exportedAs) _registry2.default.free(exportedAs);
      _registry2.default.add(exportedAs = key, trigger);
      return trigger;
    };
    trigger.isActive = function () {
      return active;
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
  };

  function defineQueueMethod(methodName, func) {
    queueMethods.push(methodName);
    queueAPI[methodName] = function (q, args, payload, next) {
      var result = func.apply(undefined, _toConsumableArray(args))(q.result, payload, next, q);

      if ((0, _utils.isPromise)(result)) {
        return result.then(next);
      }
      return next(result);
    };
    triggers.forEach(function (t) {
      t[methodName] = function () {
        for (var _len2 = arguments.length, methodArgs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          methodArgs[_key2] = arguments[_key2];
        }

        return createNewTrigger([].concat(_toConsumableArray(t.__itemsToCreate), [{ type: methodName, func: methodArgs }]));
      };
    });
  };

  defineQueueMethod('pipe', _pipe2.default);
  defineQueueMethod('map', _map2.default);
  defineQueueMethod('mapToKey', _mapToKey2.default);
  defineQueueMethod('mutate', _mutate2.default);
  defineQueueMethod('filter', _filter2.default);

  return createNewTrigger;
};

var _utils = require('../utils');

var _registry = require('../registry');

var _registry2 = _interopRequireDefault(_registry);

var _pipe = require('./pipe');

var _pipe2 = _interopRequireDefault(_pipe);

var _map = require('./map');

var _map2 = _interopRequireDefault(_map);

var _mapToKey = require('./mapToKey');

var _mapToKey2 = _interopRequireDefault(_mapToKey);

var _mutate = require('./mutate');

var _mutate2 = _interopRequireDefault(_mutate);

var _filter = require('./filter');

var _filter2 = _interopRequireDefault(_filter);

var _queue = require('./queue');

var _queue2 = _interopRequireDefault(_queue);

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var implementIterable = exports.implementIterable = function implementIterable(obj) {
  if (typeof Symbol !== 'undefined' && typeof Symbol.iterator !== 'undefined') {
    obj[Symbol.iterator] = function () {
      var values = [obj.map(), obj.mutate(), obj];
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
};

;