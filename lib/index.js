'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolver = exports.register = exports.takeEvery = exports.take = exports.put = exports.connect = exports.state = exports.rine = exports.System = undefined;

var _System = require('./api/System');

Object.defineProperty(exports, 'System', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_System).default;
  }
});

var _routine = require('./api/routine');

Object.defineProperty(exports, 'rine', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_routine).default;
  }
});

var _state = require('./api/state');

Object.defineProperty(exports, 'state', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_state).default;
  }
});

var _connect = require('./api/connect');

Object.defineProperty(exports, 'connect', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_connect).default;
  }
});

var _System2 = _interopRequireDefault(_System);

var _Registry = require('./api/Registry');

var _Registry2 = _interopRequireDefault(_Registry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var put = exports.put = _System2.default.put.bind(_System2.default);
var take = exports.take = _System2.default.take.bind(_System2.default);
var takeEvery = exports.takeEvery = _System2.default.takeEvery.bind(_System2.default);
var register = exports.register = _Registry2.default.set.bind(_Registry2.default);
var resolver = exports.resolver = _Registry2.default.resolver.bind(_Registry2.default);