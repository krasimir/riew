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
    index: 0,
    setStateValue: setStateValue,
    getStateValue: getStateValue,
    result: getStateValue(),
    id: (0, _utils.getId)('q'),
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