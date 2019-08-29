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

function createRoutineInstance(controllerFunc, viewFunc) {
  if (typeof viewFunc === 'undefined') {
    viewFunc = controllerFunc;
    controllerFunc = noop;
  }
  var instance = {};
  var active = false;
  var onOutCallbacks = [];
  var statesMap = null;
  var states = null;
  var triggers = null;
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
      Object.keys(statesMap).forEach(function (key) {
        if (states === null) states = {};
        if (triggers === null) triggers = {};
        var isState = (0, _state.isRineState)(statesMap[key]);
        var isTrigger = (0, _state.isRineQueueTrigger)(statesMap[key]);
        var s = void 0;

        // passing a state
        if (isState) {
          s = statesMap[key];
          updateViewProps(_defineProperty({}, key, s.get()));
          s.stream.pipe(function (value) {
            return updateViewProps(_defineProperty({}, key, value));
          });
          states[key] = s;

          // passing a trigger
        } else if (isTrigger) {
          triggers[key] = statesMap[key];
          statesMap[key].__state.stream.filter(isActive).pipe(callView);
          updateViewProps(_defineProperty({}, key, triggers[key]));

          // raw data that is converted to a state
        } else {
          s = (0, _state.createState)(statesMap[key]);
          onOutCallbacks.push(s.teardown);
          updateViewProps(_defineProperty({}, key, s.get()));
          s.stream.filter(isActive).pipe(function (value) {
            return updateViewProps(_defineProperty({}, key, value));
          });
          states[key] = s;
        }
      });
    }
  }
  function objectRequired(value, method) {
    if (value === null || typeof value !== 'undefined' && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
      throw new Error('The routine\'s "' + method + '" method must be called with a key-value object. Instead "' + value + '" passed.');
    }
  }

  instance.__states = function () {
    return states;
  };
  instance.__triggers = function () {
    return triggers;
  };
  instance.isActive = isActive;
  instance.in = function (initialProps) {
    active = true;
    objectRequired(initialProps, 'in');
    updateRoutineProps(initialProps);
    initializeStates();
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
    }, states !== null ? _extends({}, states, triggers) : {}));
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