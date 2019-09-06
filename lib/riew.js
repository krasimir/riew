'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = createRiew;

var _state2 = require('./state');

var _registry = require('./registry');

var _registry2 = _interopRequireDefault(_registry);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function ensureObject(value, context) {
  if (value === null || typeof value !== 'undefined' && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
    throw new Error('"' + context + '" must be called with a key-value object. Instead "' + value + '" passed.');
  }
  return value;
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
  for (var _len = arguments.length, effects = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    effects[_key - 1] = arguments[_key];
  }

  var instance = {};
  var active = false;
  var internalStates = [];
  var subscriptions = [];
  var onUnmountCallbacks = [];
  var externals = {};

  var effectsProps = (0, _state2.createState)({});
  var viewProps = (0, _state2.createState)({});
  var riewProps = (0, _state2.createState)({});

  var isActive = function isActive() {
    return active;
  };

  // triggers
  var updateViewProps = viewProps.mutate(function (current, newStuff) {
    var result = _extends({}, current);

    if (newStuff) {
      Object.keys(newStuff).forEach(function (key) {
        if ((0, _state2.isRiewState)(newStuff[key])) {
          result[key] = newStuff[key].get();
          subscriptions.push(newStuff[key].pipe(function (value) {
            return render(_defineProperty({}, key, value));
          }).subscribe());
        } else if ((0, _state2.isRiewQueueTrigger)(newStuff[key]) && !newStuff[key].isMutating()) {
          result[key] = newStuff[key]();
          subscriptions.push(newStuff[key].pipe(function () {
            return render(_defineProperty({}, key, newStuff[key]()));
          }).subscribe());
        } else {
          result[key] = newStuff[key];
        }
      });
    }
    return result;
  });
  var render = updateViewProps.filter(isActive).pipe(function (value) {
    return viewFunc(value);
  });
  var updateEffectsProps = effectsProps.mutate(function (current, newStuff) {
    return _extends({}, current, newStuff);
  });
  var updateRiewProps = riewProps.mutate(function (current, newStuff) {
    return newStuff;
  }).pipe(render);

  // defining the effect api
  updateEffectsProps({
    state: function state() {
      var s = _state2.createState.apply(undefined, arguments);

      internalStates.push(s);
      return s;
    },

    render: render,
    isActive: isActive,
    props: viewProps.get()
  });

  function processExternals() {
    Object.keys(externals).forEach(function (key) {
      var external = void 0;

      if (key.charAt(0) === '@') {
        key = key.substr(1, key.length);
        external = _registry2.default.get(key);
      } else {
        external = externals[key];
      }

      if ((0, _state2.isRiewState)(external)) {
        subscriptions.push(_state2.createState.filter(isActive).map(function (value) {
          return _defineProperty({}, key, value);
        }).pipe(render).subscribe(true));
      } else {
        updateViewProps(_defineProperty({}, key, external));
      }
      updateEffectsProps(_defineProperty({}, key, external));
    });
  }

  instance.active = isActive;
  instance.mount = function () {
    var initialProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    ensureObject(initialProps, 'The `mount` method');
    processExternals();
    updateViewProps(initialProps);
    updateRiewProps(initialProps);

    var effectsResult = _utils.parallel.apply(undefined, effects)(effectsProps.get());
    var done = function done(result) {
      return onUnmountCallbacks = result || [];
    };

    if ((0, _utils.isPromise)(effectsResult)) {
      effectsResult.then(done);
    } else {
      done(effectsResult);
    }

    active = true;
    render();
    return instance;
  };
  instance.update = updateRiewProps;
  instance.unmount = function () {
    active = false;
    viewProps.teardown();
    effectsProps.teardown();
    updateRiewProps.teardown();
    internalStates.forEach(function (s) {
      return s.teardown();
    });
    internalStates = [];
    onUnmountCallbacks.filter(function (f) {
      return typeof f === 'function';
    }).forEach(function (f) {
      return f();
    });
    onUnmountCallbacks = [];
    subscriptions.forEach(function (s) {
      return s.unsubscribe();
    });
    subscriptions = [];
    return instance;
  };
  instance.with = function () {
    for (var _len2 = arguments.length, maps = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      maps[_key2] = arguments[_key2];
    }

    return createRiew(viewFunc, controllerFunc, _extends({}, externals, normalizeExternalsMap(maps)));
  };
  instance.test = function (map) {
    return createRiew(viewFunc, controllerFunc, _extends({}, externals, map));
  };

  return instance;
}