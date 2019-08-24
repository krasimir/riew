'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* eslint-disable no-return-assign */


exports.createRoutineInstance = createRoutineInstance;
exports.default = routine;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('../utils');

var _state2 = require('../state');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ids = 0;
var getId = function getId() {
  return '@@r' + ++ids;
};

function createRoutineInstance(routineFunc) {
  var id = getId();
  var mounted = false;
  var outerProps = (0, _state2.createState)();
  var setOuterProps = outerProps.mutate();
  var permanentProps = {};
  var funcsToCallOnUnmount = [];
  var onRendered = void 0;

  function isMounted() {
    return mounted;
  }
  function preserveProps(props) {
    return permanentProps = _extends({}, permanentProps, props);
  }

  var instance = {
    __rine: 'routine',
    id: id,
    name: (0, _utils.getFuncName)(routineFunc),
    isMounted: isMounted,
    in: function _in(initialProps, Component, setContent) {
      mounted = true;
      setOuterProps(initialProps);
      routineFunc({
        render: function render(props) {
          if (!mounted) return Promise.resolve();
          if (typeof props === 'string' || typeof props === 'number' || _react2.default.isValidElement(props)) {
            setContent(props);
          } else if (props === null) {
            setContent(function () {
              return null;
            });
          } else {
            setContent(_react2.default.createElement(Component, preserveProps(props)));
          }
          return new Promise(function (done) {
            return onRendered = done;
          });
        },

        props: outerProps.stream,
        state: function state() {
          var s = _state2.createState.apply(undefined, arguments);

          funcsToCallOnUnmount.push(s.teardown);
          return s;
        },

        isMounted: isMounted
      });
    },
    updated: function updated(newProps) {
      setOuterProps(newProps);
    },
    rendered: function rendered() {
      if (onRendered) onRendered();
    },
    out: function out() {
      mounted = false;
      funcsToCallOnUnmount.forEach(function (f) {
        return f();
      });
      funcsToCallOnUnmount = [];
    }
  };

  funcsToCallOnUnmount.push(outerProps.teardown);

  return instance;
}

function routine(routineFunc) {
  var Component = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
    return null;
  };
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { createRoutineInstance: createRoutineInstance };

  var RoutineBridge = function RoutineBridge(outerProps) {
    var _useState = (0, _react.useState)(null),
        _useState2 = _slicedToArray(_useState, 2),
        instance = _useState2[0],
        setInstance = _useState2[1];

    var _useState3 = (0, _react.useState)(null),
        _useState4 = _slicedToArray(_useState3, 2),
        content = _useState4[0],
        setContent = _useState4[1];

    // updating props


    (0, _react.useEffect)(function () {
      if (instance) instance.updated(outerProps);
    }, [outerProps]);

    // to support sync rendering (i.e. await render(...))
    (0, _react.useEffect)(function () {
      if (instance) instance.rendered();
    }, [content]);

    // mounting
    (0, _react.useEffect)(function () {
      setInstance(instance = options.createRoutineInstance(routineFunc));

      instance.in(outerProps, Component, setContent);

      return function () {
        instance.out();
      };
    }, []);

    return content;
  };

  RoutineBridge.displayName = 'Routine(' + (0, _utils.getFuncName)(routineFunc) + ')';

  return RoutineBridge;
}