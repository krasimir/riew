'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createEventBus;

var _grid = require('./grid');

var _grid2 = _interopRequireDefault(_grid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createEventBus() {
  var events = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var emit = function emit(type) {
    for (var _len = arguments.length, payload = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      payload[_key - 1] = arguments[_key];
    }

    if (__DEV__) _grid2.default.dispatch.apply(_grid2.default, [type].concat(payload));
    if (events[type]) {
      return events[type].apply(events, payload);
    }
  };

  return emit;
} /* eslint-disable consistent-return */
;