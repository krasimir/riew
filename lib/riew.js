'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createRiew;

var _index = require('./index');

var _state3 = require('./state');

var _utils = require('./utils');

var _constants = require('./constants');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
  var data = (0, _index.state)({});

  var updateData = data.mutate(function (current, newStuff) {
    if (newStuff === null || typeof newStuff !== 'undefined' && (typeof newStuff === 'undefined' ? 'undefined' : _typeof(newStuff)) !== 'object') {
      throw new Error('A key-value object expected. Instead "' + newStuff + '" passed.');
    }
    // console.log('updateData', newStuff);
    return _extends({}, current, newStuff);
  });
  var render = data.map(function (newStuff) {
    var result = {};

    Object.keys(newStuff).forEach(function (key) {
      if ((0, _state3.isEffect)(newStuff[key]) && !newStuff[key].isMutating()) {
        var effect = newStuff[key];
        var _state = _index.grid.getNodeById(effect.stateId);

        result[key] = effect();
        if (!subscriptions[effect.stateId]) subscriptions[effect.stateId] = {};
        subscriptions[effect.stateId][key] = effect;
        _index.grid.subscribe(instance).to(_state).when(_constants.STATE_VALUE_CHANGE, function () {
          updateData(Object.keys(subscriptions[effect.stateId]).reduce(function (effectsResult, key) {
            effectsResult[key] = subscriptions[effect.stateId][key]();
            return effectsResult;
          }, {}));
        });
      } else {
        result[key] = newStuff[key];
      }
    });
    return result;
  }).filter(function () {
    return active;
  }).pipe(viewFunc);

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
    });
  }

  instance.mount = function () {
    var initialData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (active) {
      updateData(initialData);
      return instance;
    }
    updateData(initialData);
    processExternals();

    var controllersResult = _utils.parallel.apply(undefined, controllers)(_extends({}, data(), {
      data: updateData,
      props: data,
      state: function state() {
        var s = _index.state.apply(undefined, arguments);

        internalStates.push(s);
        return s;
      }
    }));
    var done = function done(result) {
      return onUnmountCallbacks = result || [];
    };

    if ((0, _utils.isPromise)(controllersResult)) {
      controllersResult.then(done);
    } else {
      done(controllersResult);
    }

    active = true;
    (0, _index.subscribe)(render, true);
    return instance;
  };
  instance.update = function (newData) {
    updateData(newData);
  };
  instance.unmount = function () {
    active = false;
    (0, _index.unsubscribe)(render);
    onUnmountCallbacks.filter(function (f) {
      return typeof f === 'function';
    }).forEach(function (f) {
      return f();
    });
    onUnmountCallbacks = [];
    Object.keys(subscriptions).forEach(function (stateId) {
      return _index.grid.unsubscribe(instance).from(_index.grid.getNodeById(stateId));
    });
    subscriptions = {};
    data.destroy();
    internalStates.forEach(_index.destroy);
    internalStates = [];
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