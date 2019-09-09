'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.createState = createState;
exports.mergeStates = mergeStates;
exports.isRiewQueueTrigger = isRiewQueueTrigger;

var _fastDeepEqual = require('fast-deep-equal');

var _fastDeepEqual2 = _interopRequireDefault(_fastDeepEqual);

var _effect = require('./effect');

var _effect2 = _interopRequireDefault(_effect);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createValue(initialValue) {
  var api = {};
  var value = initialValue;
  var listeners = [];

  api.id = (0, _utils.getId)('s');
  api.triggerListeners = function () {
    listeners.forEach(function (l) {
      return l();
    });
  };

  api.get = function () {
    return value;
  };
  api.set = function (newValue) {
    var isEqual = (0, _fastDeepEqual2.default)(value, newValue);

    value = newValue;
    if (!isEqual) api.triggerListeners();
  };
  api.teardown = function () {
    listeners = [];
  };
  api.listeners = function () {
    return listeners;
  };
  api.addListener = function (trigger) {
    listeners.push(trigger);
  };
  api.removeListener = function (trigger) {
    listeners = listeners.filter(function (_ref) {
      var id = _ref.id;
      return id !== trigger.id;
    });
  };

  return api;
};

function createState(initialValue) {
  return (0, _effect2.default)(createValue(initialValue))();
};

function mergeStates(statesMap) {
  var fetchSourceValues = function fetchSourceValues() {
    return Object.keys(statesMap).reduce(function (result, key) {
      var _statesMap$key = _slicedToArray(statesMap[key], 1),
          s = _statesMap$key[0];

      result[key] = s();
      return result;
    }, {});
  };
  var trigger = createState();

  trigger.state.get = fetchSourceValues;
  trigger.state.set = function (newValue) {
    if ((typeof newValue === 'undefined' ? 'undefined' : _typeof(newValue)) !== 'object') {
      throw new Error('Wrong merged state value. Must be key-value pairs.');
    }
    Object.keys(newValue).forEach(function (key) {
      if (!statesMap[key]) {
        throw new Error('There is no state with key "' + key + '".');
      }

      var _statesMap$key2 = _slicedToArray(statesMap[key], 2),
          getChildState = _statesMap$key2[0],
          setChildState = _statesMap$key2[1];

      if (!(0, _fastDeepEqual2.default)(newValue[key], getChildState())) {
        setChildState(newValue[key]);
      }
    }, {});
  };

  Object.keys(statesMap).forEach(function (key) {
    statesMap[key].pipe(trigger.state.triggerListeners).subscribe();
  });

  return trigger;
}

function isRiewQueueTrigger(func) {
  return func && func.__riewTrigger === true;
}