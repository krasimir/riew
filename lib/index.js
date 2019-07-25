'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = rine;

var _react = require('react');

var _RineElement = require('./RineElement');

var _RineElement2 = _interopRequireDefault(_RineElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isGenerator = function isGenerator(obj) {
  return obj && typeof obj['next'] === 'function';
};
var isPromise = function isPromise(obj) {
  return obj && typeof obj['then'] === 'function';
};

function rine(Component) {
  var el = (0, _RineElement2.default)(Component);

  return function Rine(props) {
    var _useState = (0, _react.useState)(null),
        _useState2 = _slicedToArray(_useState, 2),
        result = _useState2[0],
        setResult = _useState2[1];

    (0, _react.useEffect)(function () {
      var initialRender = el.in(_extends({}, props, {
        render: function render(content) {
          setResult(content);
        }
      }));

      if (initialRender && !isPromise(initialRender) && !isGenerator(initialRender)) {
        setResult(initialRender);
      }

      return function () {
        el.out();
      };
    }, []);

    return result;
  };
}