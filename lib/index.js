'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stop = exports.sleep = exports.go = exports.isStateWriteChannel = exports.isStateReadChannel = exports.isRoutine = exports.isState = exports.isRiew = exports.isChannel = exports.timeout = exports.merge = exports.fork = exports.call = exports.schannelReset = exports.channelReset = exports.sclose = exports.close = exports.unreadAll = exports.listen = exports.sread = exports.read = exports.take = exports.stake = exports.put = exports.sput = exports.registry = exports.reset = exports.grid = exports.logger = exports.register = exports.use = exports.react = exports.state = exports.chan = exports.buffer = exports.CHANNELS = exports.ONE_OF = exports.ALL_REQUIRED = exports.NOTHING = exports.FORK_ROUTINE = exports.CALL_ROUTINE = exports.READ = exports.STOP = exports.SLEEP = exports.NOOP = exports.TAKE = exports.PUT = exports.ENDED = exports.CLOSED = exports.OPEN = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _riew = require('./riew');

Object.keys(_riew).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _riew[key];
    }
  });
});

var _registry = require('./registry');

var _registry2 = _interopRequireDefault(_registry);

var _grid = require('./grid');

var _grid2 = _interopRequireDefault(_grid);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _utils = require('./utils');

var _react = require('./react');

var _react2 = _interopRequireDefault(_react);

var _buf = require('./csp/buf');

var _buf2 = _interopRequireDefault(_buf);

var _channel = require('./csp/channel');

var _channel2 = _interopRequireDefault(_channel);

var _ops = require('./csp/ops');

var _ops2 = _interopRequireDefault(_ops);

var _state = require('./csp/state');

var _state2 = _interopRequireDefault(_state);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OPEN = exports.OPEN = Symbol('OPEN');
var CLOSED = exports.CLOSED = Symbol('CLOSED');
var ENDED = exports.ENDED = Symbol('ENDED');
var PUT = exports.PUT = 'PUT';
var TAKE = exports.TAKE = 'TAKE';
var NOOP = exports.NOOP = 'NOOP';
var SLEEP = exports.SLEEP = 'SLEEP';
var STOP = exports.STOP = 'STOP';
var READ = exports.READ = 'READ';
var CALL_ROUTINE = exports.CALL_ROUTINE = 'CALL_ROUTINE';
var FORK_ROUTINE = exports.FORK_ROUTINE = 'FORK_ROUTINE';
var NOTHING = exports.NOTHING = Symbol('NOTHING');
var ALL_REQUIRED = exports.ALL_REQUIRED = Symbol('ALL_REQUIRED');
var ONE_OF = exports.ONE_OF = Symbol('ONE_OF');

var CHANNELS = exports.CHANNELS = {
  channels: {},
  getAll: function getAll() {
    return this.channels;
  },
  get: function get(id) {
    return this.channels[id];
  },
  set: function set(id, ch) {
    this.channels[id] = ch;
    return ch;
  },
  del: function del(id) {
    delete this.channels[id];
  },
  exists: function exists(id) {
    return !!this.channels[id];
  },
  reset: function reset() {
    this.channels = {};
  }
};

var buffer = exports.buffer = _buf2.default;
var chan = exports.chan = _channel2.default;
var state = exports.state = _state2.default;

var react = exports.react = {
  riew: function riew() {
    return _react2.default.apply(undefined, arguments);
  }
};
var use = exports.use = function use(name) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return _registry2.default.produce.apply(_registry2.default, [name].concat(args));
};
var register = exports.register = function register(name, whatever) {
  if ((typeof whatever === 'undefined' ? 'undefined' : _typeof(whatever)) === 'object' || typeof whatever === 'function') {
    whatever.__registered = name;
  }
  _registry2.default.defineProduct(name, function () {
    return whatever;
  });
  return whatever;
};
var logger = exports.logger = new _logger2.default();
var grid = exports.grid = new _grid2.default();
var reset = exports.reset = function reset() {
  return (0, _utils.resetIds)(), grid.reset(), _registry2.default.reset(), CHANNELS.reset(), logger.reset();
};
var registry = exports.registry = _registry2.default;

var sput = exports.sput = _ops2.default.sput;
var put = exports.put = _ops2.default.put;
var stake = exports.stake = _ops2.default.stake;
var take = exports.take = _ops2.default.take;
var read = exports.read = _ops2.default.read;
var sread = exports.sread = _ops2.default.sread;
var listen = exports.listen = _ops2.default.listen;
var unreadAll = exports.unreadAll = _ops2.default.unreadAll;
var close = exports.close = _ops2.default.close;
var sclose = exports.sclose = _ops2.default.sclose;
var channelReset = exports.channelReset = _ops2.default.channelReset;
var schannelReset = exports.schannelReset = _ops2.default.schannelReset;
var call = exports.call = _ops2.default.call;
var fork = exports.fork = _ops2.default.fork;
var merge = exports.merge = _ops2.default.merge;
var timeout = exports.timeout = _ops2.default.timeout;
var isChannel = exports.isChannel = _ops2.default.isChannel;
var isRiew = exports.isRiew = _ops2.default.isRiew;
var isState = exports.isState = _ops2.default.isState;
var isRoutine = exports.isRoutine = _ops2.default.isRoutine;
var isStateReadChannel = exports.isStateReadChannel = _ops2.default.isStateReadChannel;
var isStateWriteChannel = exports.isStateWriteChannel = _ops2.default.isStateWriteChannel;
var go = exports.go = _ops2.default.go;
var sleep = exports.sleep = _ops2.default.sleep;
var stop = exports.stop = _ops2.default.stop;