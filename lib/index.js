'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.System = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.routine = routine;
exports.partial = partial;
exports.store = store;
exports.connect = connect;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _RoutineController = require('./RoutineController');

var _RoutineController2 = _interopRequireDefault(_RoutineController);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var System = exports.System = {
  controllers: {},
  addController: function addController(controller) {
    this.controllers[controller.id] = controller;
  },
  removeController: function removeController(controller) {
    delete this.controllers[controller.id];
  },
  put: function put(type, payload, source) {
    var _this = this;

    Object.keys(this.controllers).forEach(function (id) {
      if (id !== source) {
        _this.controllers[id].put(type, payload, false);
      }
    });
  },
  debug: function debug() {
    var _this2 = this;

    var pending = Object.keys(this.controllers).reduce(function (arr, id) {
      arr = arr.concat(_this2.controllers[id].system().pending);
      return arr;
    }, []);

    return {
      controllers: this.controllers,
      pending: pending
    };
  }
};

function routine(routine) {
  var RoutineBridge = function RoutineBridge(props) {
    var _useState = (0, _react.useState)(null),
        _useState2 = _slicedToArray(_useState, 2),
        content = _useState2[0],
        setContent = _useState2[1];

    var _useState3 = (0, _react.useState)(null),
        _useState4 = _slicedToArray(_useState3, 2),
        controller = _useState4[0],
        setController = _useState4[1];

    (0, _react.useEffect)(function () {
      if (controller) controller.update(props);
    }, [props]);

    (0, _react.useEffect)(function () {
      setController(controller = (0, _RoutineController2.default)(routine, {
        broadcast: function broadcast() {
          System.put.apply(System, arguments);
        }
      }));

      System.addController(controller);
      controller.in(setContent, props);

      return function () {
        controller.out();
        System.removeController(controller);
      };
    }, []);

    return content;
  };

  RoutineBridge.displayName = 'Routine(' + (0, _utils.getFuncName)(routine) + ')';

  return RoutineBridge;
}

function partial(Component) {
  return function createPartial(initialValue) {
    var PartialBridge = function PartialBridge(props) {
      var _useState5 = (0, _react.useState)(initialValue),
          _useState6 = _slicedToArray(_useState5, 2),
          value = _useState6[0],
          setValue = _useState6[1];

      (0, _react.useEffect)(function () {
        PartialBridge.set = function (newValue) {
          value = Object.assign({}, value, newValue);
          setValue(value);
        };
        PartialBridge.get = function () {
          return value;
        };
        return function () {
          PartialBridge.set = function (newValue) {
            initialValue = Object.assign({}, initialValue, newValue);
          };
          PartialBridge.get = function () {
            return initialValue;
          };
        };
      }, []);

      return _react2.default.createElement(Component, _extends({}, value, props));
    };

    PartialBridge.set = function (newValue) {
      initialValue = Object.assign({}, initialValue, newValue);
    };
    PartialBridge.get = function () {
      return initialValue;
    };
    PartialBridge.displayName = 'Partial(' + (0, _utils.getFuncName)(Component) + ')';

    return PartialBridge;
  };
}

function store(initialValue) {
  var stateValue = initialValue;
  var updaters = [];

  return {
    set: function set(newValue) {
      stateValue = newValue;
      updaters.forEach(function (update) {
        return update(stateValue);
      });
    },
    get: function get() {
      return stateValue;
    },
    connect: function connect(updateValueInComponent) {
      updaters.push(updateValueInComponent);
    }
  };
};

function connect(Component) {
  for (var _len = arguments.length, stores = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    stores[_key - 1] = arguments[_key];
  }

  var accumulatedValue = function accumulatedValue() {
    return stores.reduce(function (value, state) {
      return Object.assign({}, value, state.get());
    }, {});
  };

  function StoreBridge(props) {
    var _useState7 = (0, _react.useState)(accumulatedValue()),
        _useState8 = _slicedToArray(_useState7, 2),
        value = _useState8[0],
        setValue = _useState8[1];

    (0, _react.useEffect)(function () {
      stores.forEach(function (store) {
        return store.connect(function (newValue) {
          var n = Object.assign({}, value, newValue);

          setValue(n);
          value = n;
        });
      });
    }, []);

    return _react2.default.createElement(Component, _extends({}, value, props));
  }

  StoreBridge.displayName = 'State(' + (0, _utils.getFuncName)(Component) + ')';
  return StoreBridge;
};