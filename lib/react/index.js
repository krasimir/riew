'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = riew;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('../utils');

var _riew = require('../riew');

var _riew2 = _interopRequireDefault(_riew);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var noop = function noop() {};

function riew(View) {
  var controller = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
  var map = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var createBridge = function createBridge() {
    var map = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    var comp = function comp(outerProps) {
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
        instance = (0, _riew2.default)(function (props, done) {
          if (props === null) {
            setContent({ content: null, done: done });
          } else {
            setContent({ content: _react2.default.createElement(View, props), done: done });
          }
        }, controller);

        if (map !== null) {
          var _instance;

          instance = (_instance = instance).with.apply(_instance, _toConsumableArray(map));
        }
        setInstance(instance);
        instance.in(outerProps);

        return function () {
          instance.out();
        };
      }, []);

      return content.content;
    };

    comp.displayName = 'Riew(' + (0, _utils.getFuncName)(controller) + ')';
    comp.with = function () {
      for (var _len = arguments.length, map = Array(_len), _key = 0; _key < _len; _key++) {
        map[_key] = arguments[_key];
      }

      return createBridge(map);
    };

    return comp;
  };

  return createBridge(map);
}