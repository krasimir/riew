'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.riew = riew;
exports.namedRiew = namedRiew;

var _index = require('./index');

var _utils = require('./utils');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /* eslint-disable no-param-reassign, no-use-before-define */

var Renderer = function Renderer(pushDataToView) {
  var _data = {};
  var inProgress = false;
  var active = true;

  return {
    push: function push(newData) {
      if (newData === _index.chan.CLOSED || newData === _index.chan.ENDED) {
        return;
      }
      _data = (0, _utils.accumulate)(_data, newData);
      if (!inProgress) {
        inProgress = true;
        Promise.resolve().then(function () {
          if (active) {
            pushDataToView(_data);
          }
          inProgress = false;
        });
      }
    },
    destroy: function destroy() {
      active = false;
    },
    data: function data() {
      return _data;
    }
  };
};
function riew(viewFunc) {
  var name = (0, _utils.getFuncName)(viewFunc);

  for (var _len = arguments.length, routines = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    routines[_key - 1] = arguments[_key];
  }

  return namedRiew.apply(undefined, [name, viewFunc].concat(routines));
}

function namedRiew(name, viewFunc) {
  for (var _len2 = arguments.length, routines = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    routines[_key2 - 2] = arguments[_key2];
  }

  var renderer = Renderer(function (value) {
    viewFunc(value);
    _index.logger.log(api, 'RIEW_RENDERED', value);
  });
  var api = {
    id: (0, _utils.getId)(name + '_riew'),
    name: name,
    '@riew': true,
    children: [],
    renderer: renderer
  };
  var cleanups = [];
  var externals = {};
  var subscriptions = {};
  var state = function state() {
    var s = _index.state.apply(undefined, arguments);
    api.children.push(s);
    return s;
  };
  var subscribe = function subscribe(to, func) {
    if (!(to in subscriptions)) {
      subscriptions[to] = true;
      (0, _index.sread)(to, func, { listen: true });
    }
  };
  var VIEW_CHANNEL = (0, _utils.getId)(name + '_view');
  var PROPS_CHANNEL = (0, _utils.getId)(name + '_props');

  api.children.push((0, _index.chan)(VIEW_CHANNEL, _index.buffer.memory()));
  api.children.push((0, _index.chan)(PROPS_CHANNEL, _index.buffer.memory()));

  var normalizeRenderData = function normalizeRenderData(value) {
    return Object.keys(value).reduce(function (obj, key) {
      if (_index.CHANNELS.exists(value[key]) || (0, _index.isChannel)(value[key])) {
        subscribe(value[key], function (v) {
          (0, _index.sput)(VIEW_CHANNEL, _defineProperty({}, key, v));
        });
        (0, _index.stake)(value[key], function (v) {
          return (0, _index.sput)(VIEW_CHANNEL, _defineProperty({}, key, v));
        });
      } else if ((0, _index.isState)(value[key])) {
        subscribe(value[key].READ, function (v) {
          return (0, _index.sput)(VIEW_CHANNEL, _defineProperty({}, key, v));
        });
        (0, _index.stake)(value[key].READ, function (v) {
          return (0, _index.sput)(VIEW_CHANNEL, _defineProperty({}, key, v));
        });
      } else {
        obj[key] = value[key];
      }
      return obj;
    }, {});
  };

  api.mount = function () {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    (0, _utils.requireObject)(props);
    (0, _index.sput)(PROPS_CHANNEL, props);
    subscribe(PROPS_CHANNEL, function (newProps) {
      return (0, _index.sput)(VIEW_CHANNEL, newProps);
    });
    subscribe(VIEW_CHANNEL, renderer.push);
    api.children = api.children.concat(routines.map(function (r) {
      return (0, _index.go)(r, function (result) {
        if (typeof result === 'function') {
          cleanups.push(result);
        }
      }, _extends({
        render: function render(value) {
          (0, _utils.requireObject)(value);
          (0, _index.sput)(VIEW_CHANNEL, normalizeRenderData(value));
        },
        state: state,
        props: PROPS_CHANNEL
      }, externals));
    }));
    if (!(0, _utils.isObjectEmpty)(externals)) {
      (0, _index.sput)(VIEW_CHANNEL, normalizeRenderData(externals));
    }
    _index.logger.log(api, 'RIEW_MOUNTED', props);
  };

  api.unmount = function () {
    cleanups.forEach(function (c) {
      return c();
    });
    cleanups = [];
    api.children.forEach(function (c) {
      if ((0, _index.isState)(c)) {
        c.destroy();
      } else if ((0, _index.isRoutine)(c)) {
        c.stop();
      }
    });
    api.children = [];
    renderer.destroy();
    (0, _index.close)(PROPS_CHANNEL);
    (0, _index.close)(VIEW_CHANNEL);
    _index.grid.remove(api);
    _index.logger.log(api, 'RIEW_UNMOUNTED');
  };

  api.update = function () {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    (0, _utils.requireObject)(props);
    (0, _index.sput)(PROPS_CHANNEL, props);
    _index.logger.log(api, 'RIEW_UPDATED', props);
  };

  api.with = function () {
    for (var _len3 = arguments.length, maps = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      maps[_key3] = arguments[_key3];
    }

    api.__setExternals(maps);
    return api;
  };

  api.test = function (map) {
    var newInstance = riew.apply(undefined, [viewFunc].concat(routines));

    newInstance.__setExternals([map]);
    return newInstance;
  };

  api.__setExternals = function (maps) {
    var reducedMaps = maps.reduce(function (res, item) {
      if (typeof item === 'string') {
        res = _extends({}, res, _defineProperty({}, item, (0, _index.use)(item)));
      } else {
        res = _extends({}, res, item);
      }
      return res;
    }, {});
    externals = _extends({}, externals, reducedMaps);
  };

  _index.grid.add(api);
  _index.logger.log(api, 'RIEW_CREATED');

  return api;
}