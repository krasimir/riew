'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = routine;

var _react = require('react');

var _RoutineController = require('./RoutineController');

var _RoutineController2 = _interopRequireDefault(_RoutineController);

var _System = require('./System');

var _System2 = _interopRequireDefault(_System);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

    // updating props


    (0, _react.useEffect)(function () {
      if (controller) controller.updated(props);
    }, [props]);

    // to support sync rendering (i.e. await render(...))
    (0, _react.useEffect)(function () {
      if (controller) controller.rendered();
    }, [content]);

    (0, _react.useEffect)(function () {
      setController(controller = (0, _RoutineController2.default)(routine));

      controller.in(setContent, props);

      return function () {
        controller.out();
        _System2.default.removeController(controller);
      };
    }, []);

    return content;
  };

  RoutineBridge.displayName = 'Routine(' + (0, _utils.getFuncName)(routine) + ')';

  return RoutineBridge;
}