'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* eslint-disable max-len */


exports.default = createRoutineInstance;

var _state = require('./state');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var noop = function noop() {};

function createRoutineInstance() {
  var controllerFunc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop;
  var viewFunc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

  var instance = {};
  var active = false;
  var onOutCallbacks = [];
  var statesMap = null;
  var states = null;
  var onRender = noop;
  var viewProps = (0, _state.createState)({});
  var updateViewProps = viewProps.mutate(function (current, newProps) {
    return _extends({}, current, newProps);
  });
  var routineProps = (0, _state.createState)({});
  var updateRoutineProps = routineProps.mutate(function (current, newProps) {
    return _extends({}, current, newProps);
  });

  function isActive() {
    return active;
  }
  function callView() {
    viewFunc(viewProps.get(), onRender);
    onRender = noop;
  }
  function initializeStates() {
    if (statesMap !== null) {
      return Object.keys(statesMap).reduce(function (values, key) {
        if (states === null) states = {};
        var alreadyState = (0, _state.isRineState)(statesMap[key]);
        var s = states[key] = alreadyState ? statesMap[key] : (0, _state.createState)(statesMap[key]);

        if (!alreadyState) onOutCallbacks.push(s.teardown);
        s.stream.pipe(function (value) {
          return updateViewProps(_defineProperty({}, key, value));
        });
        values[key] = s.get();
        return values;
      }, {});
    }
    return {};
  }
  function objectRequired(value, method) {
    if (value === null || typeof value !== 'undefined' && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
      throw new Error('The routine\'s "' + method + '" method must be called with a key-value object. Instead "' + value + '" passed.');
    }
  }

  instance.__states = function () {
    return states;
  };
  instance.isActive = isActive;
  instance.in = function (initialProps) {
    active = true;
    objectRequired(initialProps, 'in');
    updateRoutineProps(initialProps);
    updateViewProps(initializeStates());
    controllerFunc(Object.assign({
      render: function render(props) {
        objectRequired(props, 'render');
        if (!active) return Promise.resolve();
        return new Promise(function (done) {
          onRender = done;
          updateViewProps(props);
        });
      },

      props: routineProps,
      isActive: isActive
    }, states !== null ? _extends({}, states) : {}));
    routineProps.stream();
    viewProps.stream.pipe(callView);
    callView();
    return instance;
  };
  instance.update = updateRoutineProps;
  instance.out = function () {
    onOutCallbacks.forEach(function (f) {
      return f();
    });
    onOutCallbacks = [];
    viewProps.teardown();
    states = null;
    active = false;
    return instance;
  };
  instance.withState = function (map) {
    statesMap = map;
    return instance;
  };

  return instance;
}