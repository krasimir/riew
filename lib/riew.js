'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = createRiew;

var _index = require('./index');

var _state3 = require('./state');

var _utils = require('./utils');

var _constants = require('./constants');

var _grid = require('./grid');

var _grid2 = _interopRequireDefault(_grid);

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
  for (var _len = arguments.length, controllers = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    controllers[_key - 1] = arguments[_key];
  }

  var instance = {
    id: (0, _utils.getId)('r'),
    name: (0, _utils.getFuncName)(viewFunc)
  };
  var active = false;
  var internalStates = [];
  var onUnmountCallbacks = [];
  var subscriptions = {};
  var externals = {};
  var data = {};
  var api = {};
  var _props = void 0,
      updateProps = void 0;

  var isActive = function isActive() {
    return active;
  };

  var updateData = function updateData(newStuff) {
    if (newStuff) {
      var result = {};

      Object.keys(newStuff).forEach(function (key) {
        if ((0, _state3.isEffect)(newStuff[key]) && !newStuff[key].isMutating()) {
          var effect = newStuff[key];
          var _state = _grid2.default.getNodeById(effect.stateId);

          result[key] = effect();
          if (!subscriptions[effect.stateId]) subscriptions[effect.stateId] = {};
          subscriptions[effect.stateId][key] = effect;
          _grid2.default.subscribe(instance).to(_state).when(_constants.STATE_VALUE_CHANGE, function () {
            _render(Object.keys(subscriptions[effect.stateId]).reduce(function (effectsResult, key) {
              effectsResult[key] = subscriptions[effect.stateId][key]();
              return effectsResult;
            }, {}));
          });
        } else {
          result[key] = newStuff[key];
        }
      });
      data = accumulate(data, result);
    }
  };
  var _render = function _render(newData) {
    updateData(newData);
    if (isActive()) {
      viewFunc(data);
    }
  };
  var updateControllerAPI = function updateControllerAPI(newMethods) {
    return api = accumulate(api, newMethods);
  };

  // defining the controller api
  updateControllerAPI({
    state: function state() {
      var s = _index.state.apply(undefined, arguments);

      internalStates.push(s);
      return s;
    },
    render: function render(newProps) {
      ensureObject(newProps, 'The `render` method');
      return _render(newProps);
    },

    props: function props() {
      if (!_props) {
        _props = (0, _index.state)(data);
        updateProps = _props.mutate(accumulate);
      }
      return _props;
    },
    isActive: isActive
  });

  function processExternals() {
    Object.keys(externals).forEach(function (key) {
      var external = void 0;

      if (key.charAt(0) === '@') {
        key = key.substr(1, key.length);
        external = (0, _index.use)(key);
      } else {
        external = externals[key];
      }

      updateData(_defineProperty({}, key, external));
      updateControllerAPI(_defineProperty({}, key, external));
    });
  }

  instance.isActive = isActive;
  instance.mount = function () {
    var initialProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    ensureObject(initialProps, 'The `mount` method');
    updateData(initialProps);
    processExternals();

    var controllersResult = _utils.parallel.apply(undefined, controllers)(api);
    var done = function done(result) {
      return onUnmountCallbacks = result || [];
    };

    if ((0, _utils.isPromise)(controllersResult)) {
      controllersResult.then(done);
    } else {
      done(controllersResult);
    }

    active = true;
    _render();
    return instance;
  };
  instance.update = function (newProps) {
    if (updateProps) updateProps(newProps);
    _render(newProps);
  };
  instance.unmount = function () {
    active = false;
    internalStates.forEach(function (s) {
      return s.destroy();
    });
    internalStates = [];
    onUnmountCallbacks.filter(function (f) {
      return typeof f === 'function';
    }).forEach(function (f) {
      return f();
    });
    onUnmountCallbacks = [];
    Object.keys(subscriptions).forEach(function (stateId) {
      return _grid2.default.unsubscribe(instance).from(_grid2.default.getNodeById(stateId));
    });
    subscriptions = {};
    return instance;
  };
  instance.with = function () {
    for (var _len2 = arguments.length, maps = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      maps[_key2] = arguments[_key2];
    }

    instance.__setExternals(maps);
    return instance;
  };
  instance.test = function (map) {
    var newInstance = createRiew.apply(undefined, [viewFunc].concat(controllers));

    newInstance.__setExternals([map]);
    return newInstance;
  };
  instance.__setExternals = function (maps) {
    externals = _extends({}, externals, normalizeExternalsMap(maps));
  };
  instance.__data = data;

  return instance;
};