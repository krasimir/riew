'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = createRoutineInstance;

var _state = require('./state');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function noop() {};
function objectRequired(value, method) {
  if (value === null || typeof value !== 'undefined' && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
    throw new Error('The routine\'s "' + method + '" method must be called with a key-value object. Instead "' + value + '" passed.');
  }
}

function createRoutineInstance(controllerFunc, viewFunc) {
  var externals = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (typeof viewFunc === 'undefined') {
    viewFunc = controllerFunc;
    controllerFunc = noop;
  }
  var instance = {};
  var active = false;
  var onOutCallbacks = [];
  var onRender = noop;
  var isActive = function isActive() {
    return active;
  };
  var routineProps = (0, _state.createState)({});
  var updateRoutineProps = routineProps.mutate(function (current, newProps) {
    return _extends({}, current, newProps);
  });
  var viewProps = (0, _state.createState)({});
  var updateViewProps = viewProps.mutate(function (current, newProps) {
    return _extends({}, current, newProps);
  });
  var controllerProps = (0, _state.createState)({
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
  });
  var updateControllerProps = controllerProps.mutate(function (current, newProps) {
    return _extends({}, current, newProps);
  });

  function callView() {
    viewFunc(viewProps.get(), onRender);
    onRender = noop;
  }
  function processExternals() {
    Object.keys(externals).forEach(function (key) {
      var isState = (0, _state.isRineState)(externals[key]);
      var isTrigger = (0, _state.isRineQueueTrigger)(externals[key]);
      var s = void 0;

      // passing a state
      if (isState) {
        s = externals[key];
        updateControllerProps(_defineProperty({}, key, s));
        updateViewProps(_defineProperty({}, key, s.get()));
        s.stream.pipe(function (value) {
          return updateViewProps(_defineProperty({}, key, value));
        });

        // passing a trigger
      } else if (isTrigger) {
        var trigger = externals[key];

        if (trigger.__activity() === _state.MUTABLE) {
          throw new Error('Triggers that mutate state can not be sent to the routine. This area is meant only for triggers that fetch data. If you need pass such triggers use the controller for that.');
        }

        trigger.__state.stream.filter(isActive).pipe(function () {
          return updateViewProps(_defineProperty({}, key, trigger()));
        })();

        // raw data that is converted to a state
      } else if (key.charAt(0) === '$') {
        var k = key.substr(1, key.length);

        s = (0, _state.createState)(externals[key]);
        onOutCallbacks.push(s.teardown);
        updateControllerProps(_defineProperty({}, k, s));
        updateViewProps(_defineProperty({}, k, s.get()));
        s.stream.filter(isActive).pipe(function (value) {
          return updateViewProps(_defineProperty({}, k, value));
        });

        // proxy the rest
      } else {
        updateControllerProps(_defineProperty({}, key, externals[key]));
        updateViewProps(_defineProperty({}, key, externals[key]));
      }
    });
  }

  instance.isActive = isActive;
  instance.in = function (initialProps) {
    active = true;
    objectRequired(initialProps, 'in');
    updateRoutineProps(initialProps);
    processExternals();

    var controllerResult = controllerFunc(controllerProps.get());

    if (controllerResult) {
      if ((typeof controllerResult === 'undefined' ? 'undefined' : _typeof(controllerResult)) !== 'object') {
        throw new Error('You must return a key-value object from your controller.');
      }
      updateViewProps(controllerResult);
    }
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
    controllerProps.teardown();
    active = false;
    return instance;
  };
  instance.with = function (map) {
    return createRoutineInstance(controllerFunc, viewFunc, _extends({}, externals, map));
  };
  instance.withState = function (map) {
    return createRoutineInstance(controllerFunc, viewFunc, Object.keys(map).reduce(function (obj, key) {
      return obj['$' + key] = map[key], obj;
    }, externals));
  };
  instance.test = function (map) {
    return createRoutineInstance(controllerFunc, viewFunc, _extends({}, externals, map));
  };

  return instance;
}