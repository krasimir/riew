'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.createState = createState;
exports.mergeStates = mergeStates;
exports.isRiewQueueEffect = isRiewQueueEffect;

var _fastDeepEqual = require('fast-deep-equal');

var _fastDeepEqual2 = _interopRequireDefault(_fastDeepEqual);

var _effect = require('./effect');

var _effect2 = _interopRequireDefault(_effect);

var _utils = require('../utils');

var _grid = require('../grid');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function State(initialValue) {
  var s = {};
  var value = initialValue;
  var listeners = [];

  s.id = (0, _utils.getId)('s');
  s.triggerListeners = function () {
    listeners.forEach(function (l) {
      return l();
    });
  };

  s.get = function () {
    return value;
  };
  s.set = function (newValue) {
    var isEqual = (0, _fastDeepEqual2.default)(value, newValue);

    value = newValue;
    if (!isEqual) s.triggerListeners();
  };
  s.teardown = function () {
    listeners = [];
    (0, _grid.gridFreeNode)(s.id);
  };
  s.listeners = function () {
    return listeners;
  };
  s.addListener = function (effect) {
    listeners.push(effect);
  };
  s.removeListener = function (effect) {
    listeners = listeners.filter(function (_ref) {
      var id = _ref.id;
      return id !== effect.id;
    });
  };

  (0, _grid.gridAddState)(s);

  return s;
};

function createState(initialValue) {
  return (0, _effect2.default)(State(initialValue))();
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
  var effect = createState();

  effect.state.get = fetchSourceValues;
  effect.state.set = function (newValue) {
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
    statesMap[key].pipe(effect.state.triggerListeners).subscribe();
  });

  return effect;
}

function isRiewQueueEffect(func) {
  return func && func.__riewEffect === true;
}