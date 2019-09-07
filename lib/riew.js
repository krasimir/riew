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
    throw new Error(context + ' must be called with a key-value object. Instead "' + value + '" passed.');
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
var accumulate = function accumulate(current, newStuff) {
  return _extends({}, current, newStuff);
};

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

  var input = (0, _state2.createState)({});
  var output = (0, _state2.createState)({});
  var api = (0, _state2.createState)({});

  var isActive = function isActive() {
    return active;
  };
  var isSubscribed = function isSubscribed(s) {
    return !!subscriptions.find(function (trigger) {
      return trigger.__state.id === s.id;
    });
  };

  // triggers
  var updateOutput = output.mutate(function (current, newStuff) {
    var result = _extends({}, current);

    if (newStuff) {
      Object.keys(newStuff).forEach(function (key) {
        if ((0, _state2.isRiewState)(newStuff[key])) {
          result[key] = newStuff[key].get();
          if (!isSubscribed(newStuff[key])) {
            subscriptions.push(newStuff[key].pipe(function (value) {
              return _render3(_defineProperty({}, key, value));
            }).subscribe());
          }
        } else if ((0, _state2.isRiewQueueTrigger)(newStuff[key]) && !newStuff[key].isMutating()) {
          result[key] = newStuff[key]();
          if (!isSubscribed(newStuff[key].__state)) {
            subscriptions.push(newStuff[key].__state.pipe(function () {
              return _render3(_defineProperty({}, key, newStuff[key]()));
            }).subscribe());
          }
        } else {
          result[key] = newStuff[key];
        }
      });
    }
    return result;
  });
  var _render3 = updateOutput.filter(isActive).pipe(function (value) {
    return viewFunc(value);
  });
  var updateAPI = api.mutate(accumulate);
  var updateInput = input.mutate(accumulate);

  // defining the effect api
  updateAPI({
    state: function state() {
      var s = _state2.createState.apply(undefined, arguments);

      internalStates.push(s);
      return s;
    },
    render: function render(newProps) {
      ensureObject(newProps, 'The `render` method');
      return _render3(newProps);
    },

    isActive: isActive,
    props: input
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

      updateOutput(_defineProperty({}, key, external));
      updateAPI(_defineProperty({}, key, external));
    });
  }

  instance.isActive = isActive;
  instance.mount = function () {
    var initialProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    ensureObject(initialProps, 'The `mount` method');
    updateInput(initialProps);
    updateOutput(initialProps);
    processExternals();

    var effectsResult = _utils.parallel.apply(undefined, effects)(api.get());
    var done = function done(result) {
      return onUnmountCallbacks = result || [];
    };

    if ((0, _utils.isPromise)(effectsResult)) {
      effectsResult.then(done);
    } else {
      done(effectsResult);
    }

    active = true;
    _render3();
    return instance;
  };
  instance.update = function (newProps) {
    _render3(newProps);
    updateInput(newProps);
  };
  instance.unmount = function () {
    active = false;
    output.teardown();
    api.teardown();
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
  instance.__setExternals = function (maps) {
    externals = _extends({}, externals, normalizeExternalsMap(maps));
  };

  instance.with = function () {
    for (var _len2 = arguments.length, maps = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      maps[_key2] = arguments[_key2];
    }

    var newInstance = createRiew.apply(undefined, [viewFunc].concat(effects));

    newInstance.__setExternals(maps);
    return newInstance;
  };
  instance.test = function (map) {
    var newInstance = createRiew.apply(undefined, [viewFunc].concat(effects));

    newInstance.__setExternals([map]);
    return newInstance;
  };

  return instance;
}