'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.harvester = exports.reset = exports.grid = exports.logger = exports.register = exports.use = exports.go = exports.state = exports.chan = exports.react = exports.riew = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /* eslint-disable no-param-reassign */


var _csp = require('./csp');

Object.keys(_csp).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _csp[key];
    }
  });
});

var _harvester = require('./harvester');

var _harvester2 = _interopRequireDefault(_harvester);

var _grid = require('./grid');

var _grid2 = _interopRequireDefault(_grid);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var riew = exports.riew = function riew() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return _harvester2.default.produce.apply(_harvester2.default, ['riew'].concat(args));
};
var react = exports.react = {
  riew: function riew() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _harvester2.default.produce.apply(_harvester2.default, ['reactRiew'].concat(args));
  }
};
var chan = exports.chan = function chan() {
  for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  return _harvester2.default.produce.apply(_harvester2.default, ['channel'].concat(args));
};
var state = exports.state = function state() {
  for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    args[_key4] = arguments[_key4];
  }

  return _harvester2.default.produce.apply(_harvester2.default, ['state'].concat(args));
};
var go = exports.go = function go() {
  for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    args[_key5] = arguments[_key5];
  }

  return _harvester2.default.produce.apply(_harvester2.default, ['routine'].concat(args));
};
var use = exports.use = function use(name) {
  for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
    args[_key6 - 1] = arguments[_key6];
  }

  return _harvester2.default.produce.apply(_harvester2.default, [name].concat(args));
};
var register = exports.register = function register(name, whatever) {
  if ((typeof whatever === 'undefined' ? 'undefined' : _typeof(whatever)) === 'object' || typeof whatever === 'function') {
    whatever.__registered = name;
  }
  _harvester2.default.defineProduct(name, function () {
    return whatever;
  });
  return whatever;
};
var logger = exports.logger = new _logger2.default();
var grid = exports.grid = new _grid2.default(logger);
var reset = exports.reset = function reset() {
  return grid.reset(), _harvester2.default.reset(), _csp.CHANNELS.reset(), logger.reset();
};
var harvester = exports.harvester = _harvester2.default;

go['@go'] = true;
go.with = function () {
  for (var _len7 = arguments.length, maps = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
    maps[_key7] = arguments[_key7];
  }

  var reducedMaps = maps.reduce(function (res, item) {
    if (typeof item === 'string') {
      res = _extends({}, res, _defineProperty({}, item, use(item)));
    } else {
      res = _extends({}, res, item);
    }
    return res;
  }, {});
  return function (func) {
    for (var _len8 = arguments.length, args = Array(_len8 > 2 ? _len8 - 2 : 0), _key8 = 2; _key8 < _len8; _key8++) {
      args[_key8 - 2] = arguments[_key8];
    }

    var done = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

    args.push(reducedMaps);
    return go.apply(undefined, [func, done].concat(args));
  };
};