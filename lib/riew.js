'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = createRiew;

var _state = require('./state');

var _registry = require('./registry');

var _registry2 = _interopRequireDefault(_registry);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function noop() {};
function objectRequired(value, method) {
  if (value === null || typeof value !== 'undefined' && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
    throw new Error('The riew\'s "' + method + '" method must be called with a key-value object. Instead "' + value + '" passed.');
  }
}
function normalizeExternalsMap(arr) {
  return arr.reduce(function (map, item) {
    if (typeof item === 'string') {
      map = _extends({}, map, _defineProperty({}, '@' + item, true));
    } else {
      map = _extends({}, map, item);
    }
    return map;
  }, {});
}

function createRiew(viewFunc) {
  var controllerFunc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
  var externals = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var instance = {};
  var active = false;
  var onOutCallbacks = [];
  var onRender = noop;
  var onPropsCallback = void 0;
  var isActive = function isActive() {
    return active;
  };
  var viewProps = (0, _state.createState)({});
  var updateViewProps = viewProps.mutate(function (current, newProps) {
    return _extends({}, current, newProps);
  });
  var riewProps = (0, _state.createState)({});
  var updateRiewProps = function updateRiewProps(newProps) {
    var transformed = (onPropsCallback || function (p) {
      return p;
    })(newProps);

    if ((0, _utils.isObjectLiteral)(transformed)) {
      riewProps.set(transformed);
    } else {
      riewProps.set(newProps);
    }
  };
  var controllerProps = (0, _state.createState)({
    render: function render(props) {
      objectRequired(props, 'render');
      if (!active) return Promise.resolve();
      return new Promise(function (done) {
        onRender = done;
        updateViewProps(props);
      });
    },
    props: function props(callback) {
      onPropsCallback = callback;
    },

    isActive: isActive
  });
  var updateControllerProps = controllerProps.mutate(function (current, newProps) {
    return _extends({}, current, newProps);
  });

  function callView() {
    viewFunc(_extends({}, riewProps.get(), viewProps.get()), onRender);
    onRender = noop;
  }
  function processExternals() {
    Object.keys(externals).forEach(function (key) {
      var isState = (0, _state.isRiewState)(externals[key]);
      var isTrigger = (0, _state.isRiewQueueTrigger)(externals[key]);
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

        updateControllerProps(_defineProperty({}, key, trigger));
        // subscribe only if the trigger is not mutating the state
        if (trigger.__activity() === _state.IMMUTABLE) {
          trigger.__state.stream.filter(isActive).pipe(function () {
            return updateViewProps(_defineProperty({}, key, trigger()));
          })();
        } else {
          console.warn('In the view you are not allowed to use directly a trigger that mutates the state. If you need that pass a prop from the controller to the view.');
        }

        // state in the registry
      } else if (key.charAt(0) === '$' && key.charAt(1) === '@') {
        var k = key.substr(2, key.length);

        s = _registry2.default.get(k);
        updateControllerProps(_defineProperty({}, k, s));
        updateViewProps(_defineProperty({}, k, s.get()));
        s.stream.filter(isActive).pipe(function (value) {
          return updateViewProps(_defineProperty({}, k, value));
        });

        // raw data that is converted to a state
      } else if (key.charAt(0) === '$') {
        var _k = key.substr(1, key.length);

        s = (0, _state.createState)(externals[key]);
        onOutCallbacks.push(s.teardown);
        updateControllerProps(_defineProperty({}, _k, s));
        updateViewProps(_defineProperty({}, _k, s.get()));
        s.stream.filter(isActive).pipe(function (value) {
          return updateViewProps(_defineProperty({}, _k, value));
        });

        // proxy the rest
      } else {
        updateControllerProps(_defineProperty({}, key, externals[key]));
        updateViewProps(_defineProperty({}, key, externals[key]));
      }
    });
  }

  instance.isActive = isActive;
  instance.in = function () {
    var initialProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    active = true;
    objectRequired(initialProps, 'in');
    processExternals();

    var controllerResult = controllerFunc(controllerProps.get());

    updateRiewProps(initialProps);

    riewProps.stream.filter(isActive).pipe(callView);
    viewProps.stream.filter(isActive).pipe(callView);

    if ((0, _utils.isObjectLiteral)(controllerResult)) {
      updateViewProps(controllerResult); // <-- this triggers the first render
    } else {
      callView(); // <-- this triggers the first render
    }
    return instance;
  };
  instance.update = updateRiewProps;
  instance.out = function () {
    onOutCallbacks.forEach(function (f) {
      return f();
    });
    onOutCallbacks = [];
    riewProps.teardown();
    viewProps.teardown();
    controllerProps.teardown();
    active = false;
    return instance;
  };
  instance.with = function () {
    for (var _len = arguments.length, maps = Array(_len), _key = 0; _key < _len; _key++) {
      maps[_key] = arguments[_key];
    }

    return createRiew(viewFunc, controllerFunc, _extends({}, externals, normalizeExternalsMap(maps)));
  };
  instance.withState = function () {
    for (var _len2 = arguments.length, maps = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      maps[_key2] = arguments[_key2];
    }

    var nmaps = normalizeExternalsMap(maps);

    return createRiew(viewFunc, controllerFunc, Object.keys(nmaps).reduce(function (obj, key) {
      return obj['$' + key] = nmaps[key], obj;
    }, externals));
  };
  instance.test = function (map) {
    return createRiew(viewFunc, controllerFunc, _extends({}, externals, map));
  };

  return instance;
}