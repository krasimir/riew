'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (state) {
  var queueMethods = [];
  var queueAPI = {};
  var exportedAs = void 0;

  return function createNewTrigger() {
    var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    function defineQueueMethod(methodName, func) {
      queueMethods.push(methodName);
      queueAPI[methodName] = function (q, args, payload, next) {
        var result = func.apply(undefined, _toConsumableArray(args))(q.result, payload, next, q);

        if ((0, _utils.isPromise)(result)) {
          return result.then(next);
        }
        return next(result);
      };
    };

    var trigger = function trigger() {
      if (!state.isActive() || trigger.__itemsToCreate.length === 0) return state.get();
      var queue = createQueue(state.set, state.get, state.removeQueue, queueAPI);

      state.addQueue(queue);
      trigger.__itemsToCreate.forEach(function (_ref) {
        var type = _ref.type,
            func = _ref.func;
        return queue.add(type, func);
      });
      return queue.process.apply(queue, arguments);
    };

    defineQueueMethod('pipe', _pipe2.default);
    defineQueueMethod('map', _map2.default);
    defineQueueMethod('mapToKey', _mapToKey2.default);
    defineQueueMethod('mutate', _mutate2.default);
    defineQueueMethod('filter', _filter2.default);
    (0, _utils.implementIterable)(trigger);

    trigger.id = getId('t');
    trigger.state = state;
    trigger.__riewTrigger = true;
    trigger.__itemsToCreate = [].concat(_toConsumableArray(items));
    trigger.__listeners = state.listeners;
    trigger.__queues = state.createdQueues;

    // queue methods
    queueMethods.forEach(function (m) {
      trigger[m] = function () {
        for (var _len2 = arguments.length, methodArgs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          methodArgs[_key2] = arguments[_key2];
        }

        return createNewTrigger([].concat(_toConsumableArray(trigger.__itemsToCreate), [{ type: m, func: methodArgs }]));
      };
    });

    // trigger direct methods
    trigger.define = function (methodName, func) {
      defineQueueMethod(methodName, func);
      trigger[methodName] = function () {
        for (var _len3 = arguments.length, methodArgs = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          methodArgs[_key3] = arguments[_key3];
        }

        return createNewTrigger([].concat(_toConsumableArray(trigger.__itemsToCreate), [{ type: methodName, func: methodArgs }]));
      };
      return trigger;
    };
    trigger.isMutating = function () {
      return !!trigger.__itemsToCreate.find(function (_ref2) {
        var type = _ref2.type;
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
      trigger.__itemsToCreate = [];
      queueMethods.forEach(function (m) {
        return trigger[m] = function () {
          return trigger;
        };
      });
      return trigger;
    };
    trigger.teardown = function () {
      state.teardown();
      if (exportedAs) _registry2.default.free(exportedAs);
      return trigger;
    };
    trigger.export = function (key) {
      // if already exported with different key
      if (exportedAs) _registry2.default.free(exportedAs);
      _registry2.default.add(exportedAs = key, trigger);
      return trigger;
    };
    trigger.isActive = function () {
      return state.isActive();
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var ids = 0;
var getId = function getId(prefix) {
  return '@@' + prefix + ++ids;
};

function createQueue(setStateValue, getStateValue) {
  var onDone = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
  var queueAPI = arguments[3];

  var q = {
    index: 0,
    setStateValue: setStateValue,
    getStateValue: getStateValue,
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

      function next(lastResult) {
        q.result = lastResult;
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

        var logic = queueAPI[type];

        if (logic) {
          return logic(q, func, payload, next);
        }
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

;