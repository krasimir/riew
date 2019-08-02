'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.System = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.routine = routine;
exports.partial = partial;

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
  var RineBridge = function RineBridge(props) {
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

  RineBridge.displayName = 'Rine(' + (0, _utils.getFuncName)(routine) + ')';

  return RineBridge;
}

function partial(Component) {
  return function (initialValue) {
    var rerender = function rerender() {};
    var value = initialValue;
    var RineBridgeComponent = routine(function Partial(_ref) {
      var render = _ref.render;

      rerender = function rerender() {
        return render(function (props) {
          return _react2.default.createElement(Component, _extends({}, props, value));
        });
      };
      return rerender();
    });

    RineBridgeComponent.displayName = 'RinePartial(' + (0, _utils.getFuncName)(Component) + ')';
    RineBridgeComponent.set = function (newValue) {
      value = newValue;
      rerender();
    };
    RineBridgeComponent.get = function () {
      return value;
    };

    return RineBridgeComponent;
  };
}