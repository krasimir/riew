'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createQueue;

var _utils = require('../utils');

function createQueue(setStateValue, getStateValue) {
  var onDone = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
  var queueAPI = arguments[3];

  var q = {
    id: (0, _utils.getId)('q'),
    index: 0,
    setStateValue: setStateValue,
    getStateValue: getStateValue,
    result: getStateValue(),
    items: [],
    add: function add(type, func) {
      this.items.push({ type: type, func: func, name: func.map(_utils.getFuncName) });
    },
    process: function process() {
      for (var _len = arguments.length, payload = Array(_len), _key = 0; _key < _len; _key++) {
        payload[_key] = arguments[_key];
      }

      q.index = 0;

      function next(lastResult) {
        q.result = lastResult;
        q.index++;
        if (q.index < q.items.length) {
          return loop();
        }
        onDone();
        return q.result;
      };
      function loop() {
        var _q$items$q$index = q.items[q.index],
            type = _q$items$q$index.type,
            func = _q$items$q$index.func;

        var logic = queueAPI[type];

        if (logic) {
          return logic(q, func, payload, next);
        }
        throw new Error('Unsupported method "' + type + '".');
      };

      return q.items.length > 0 ? loop() : q.result;
    },
    cancel: function cancel() {
      q.items = [];
    }
  };

  return q;
}