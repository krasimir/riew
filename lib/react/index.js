'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /* eslint-disable no-return-assign */


exports.default = routine;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('../utils');

var _routine = require('../routine');

var _routine2 = _interopRequireDefault(_routine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function routine(controller) {
  var View = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
    return null;
  };

  var statesMap = null;
  var RoutineBridge = function RoutineBridge(outerProps) {
    var _useState = (0, _react.useState)(null),
        _useState2 = _slicedToArray(_useState, 2),
        instance = _useState2[0],
        setInstance = _useState2[1];

    var _useState3 = (0, _react.useState)({ content: null, done: function done() {} }),
        _useState4 = _slicedToArray(_useState3, 2),
        content = _useState4[0],
        setContent = _useState4[1];

    // updating props


    (0, _react.useEffect)(function () {
      if (instance) instance.update(outerProps);
    }, [outerProps]);

    // to support sync rendering (i.e. await render(...))
    (0, _react.useEffect)(function () {
      if (instance) content.done();
    }, [content]);

    // mounting
    (0, _react.useEffect)(function () {
      instance = (0, _routine2.default)(controller, function (props, done) {
        if (props === null) {
          setContent({ content: null, done: done });
        } else {
          setContent({ content: _react2.default.createElement(View, props), done: done });
        }
      });

      if (statesMap !== null) {
        instance.withState(statesMap);
      }
      setInstance(instance);
      instance.in(outerProps);

      return function () {
        instance.out();
      };
    }, []);

    return content.content;
  };

  RoutineBridge.displayName = 'Routine(' + (0, _utils.getFuncName)(controller) + ')';
  RoutineBridge.withState = function (map) {
    statesMap = map;
    return RoutineBridge;
  };

  return RoutineBridge;
}