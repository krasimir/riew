'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QueueAPI = undefined;
exports.createQueue = createQueue;

var _utils = require('./utils');

var _pipe = require('./queueMethods/pipe');

var _pipe2 = _interopRequireDefault(_pipe);

var _map = require('./queueMethods/map');

var _map2 = _interopRequireDefault(_map);

var _mapToKey = require('./queueMethods/mapToKey');

var _mapToKey2 = _interopRequireDefault(_mapToKey);

var _mutate = require('./queueMethods/mutate');

var _mutate2 = _interopRequireDefault(_mutate);

var _filter = require('./queueMethods/filter');

var _filter2 = _interopRequireDefault(_filter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var QueueAPI = exports.QueueAPI = {
  define: function define(methodName, func) {
    this[methodName] = function (q, args, payload, next) {
      var result = func.apply(undefined, _toConsumableArray(args))(q.result, payload, q);

      if ((0, _utils.isPromise)(result)) {
        return result.then(next);
      }
      return next(result);
    };
  }
};

QueueAPI.define('pipe', _pipe2.default);
QueueAPI.define('map', _map2.default);
QueueAPI.define('mapToKey', _mapToKey2.default);
QueueAPI.define('mutate', _mutate2.default);
QueueAPI.define('filter', _filter2.default);

function createQueue(initialStateValue, setStateValue, onDone) {
  var q = {
    id: (0, _utils.getId)('q'),
    index: null,
    setStateValue: setStateValue,
    result: initialStateValue,
    items: [],
    add: function add(type, func) {
      this.items.push({ type: type, func: func });
    },
    process: function process() {
      for (var _len = arguments.length, payload = Array(_len), _key = 0; _key < _len; _key++) {
        payload[_key] = arguments[_key];
      }

      q.index = 0;

      function next() {
        if (q.index < q.items.length) {
          return loop();
        }
        q.index = null;
        onDone();
        return q.result;
      };
      function loop() {
        var _q$items$q$index = q.items[q.index],
            type = _q$items$q$index.type,
            func = _q$items$q$index.func;

        var logic = QueueAPI[type];

        if (logic) {
          var r = logic(q, func, payload, function (lastResult) {
            q.result = lastResult;
            q.index++;
            return next();
          });

          return r;
        }
        throw new Error('Unsupported method "' + type + '".');
      };

      if (q.items.length > 0) {
        return loop();
      }
      return q.result;
    },
    cancel: function cancel() {
      q.items = [];
    }
  };

  return q;
}