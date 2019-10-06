'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.grid = exports.harvester = exports.parallel = exports.serial = exports.compose = exports._fork = exports.test = exports.destroy = exports.unsubscribe = exports.subscribe = exports.cancel = exports.reset = exports.register = exports.use = exports.react = exports.riew = exports.merge = exports.state = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _utils = require('./utils');

Object.defineProperty(exports, 'compose', {
  enumerable: true,
  get: function get() {
    return _utils.compose;
  }
});
Object.defineProperty(exports, 'serial', {
  enumerable: true,
  get: function get() {
    return _utils.serial;
  }
});
Object.defineProperty(exports, 'parallel', {
  enumerable: true,
  get: function get() {
    return _utils.parallel;
  }
});

var _harvester = require('./harvester');

var _harvester2 = _interopRequireDefault(_harvester);

var _grid = require('./grid');

var _grid2 = _interopRequireDefault(_grid);

var _constants = require('./constants');

var _state = require('./state');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var state = exports.state = function state(initialValue) {
  return _harvester2.default.produce('state', initialValue);
};
var merge = exports.merge = function merge(statesMap) {
  return _harvester2.default.produce('mergeStates', statesMap);
};
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
var use = exports.use = function use(name) {
  for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
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
var reset = exports.reset = function reset() {
  return _grid2.default.reset(), _harvester2.default.reset();
};
var cancel = exports.cancel = function cancel(effect) {
  return grid.emit(_constants.CANCEL_EFFECT).from(effect).with();
};
var subscribe = exports.subscribe = function subscribe(effect, initialCall) {
  if (effect.isMutating()) {
    throw new Error('You should not subscribe an effect that mutates the state. This will lead to endless recursion.');
  }
  if (!(0, _state.isEffect)(effect)) {
    throw new Error('You must pass an effect to the subscribe function.');
  }

  if (initialCall) effect();
  var state = grid.getNodeById(effect.stateId);

  return grid.subscribe(effect).to(state).when(_constants.STATE_VALUE_CHANGE, function () {
    return effect();
  });
};
var unsubscribe = exports.unsubscribe = function unsubscribe(effect) {
  var state = grid.getNodeById(effect.stateId);

  grid.unsubscribe(effect).from(state);
};
var destroy = exports.destroy = function destroy(effect) {
  grid.nodes().filter(function (node) {
    return node.id === effect.stateId || node.stateId === effect.stateId;
  }).forEach(function (node) {
    node.destroy();
    grid.remove(node);
    if ('__registered' in node) {
      // in case of exported effect
      _harvester2.default.undefineProduct(node.__registered);
    }
  });
};
var test = exports.test = function test(effect, callback) {
  var state = grid.getNodeById(effect.stateId);
  var test = _fork(state, effect);
  var tools = {
    setValue: function setValue(newValue) {
      test.items = [{ type: 'map', func: [function () {
          return newValue;
        }] }].concat(_toConsumableArray(test.items));
    },
    swap: function swap(index, funcs, type) {
      if (!Array.isArray(funcs)) funcs = [funcs];
      test.items[index].func = funcs;
      if (type) {
        test.items[index].type = type;
      }
    },
    swapFirst: function swapFirst(funcs, type) {
      tools.swap(0, funcs, type);
    },
    swapLast: function swapLast(funcs, type) {
      tools.swap(test.items.length - 1, funcs, type);
    }
  };

  callback(tools);
  return test;
};
var _fork = exports._fork = function _fork(state, effect, newItem) {
  var newItems = [].concat(_toConsumableArray(effect.items));

  if (newItem) {
    newItems.push(newItem);
  }
  return _harvester2.default.produce('effect', state, newItems);
};

var harvester = exports.harvester = _harvester2.default;
var grid = exports.grid = _grid2.default;