'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createRiew;

var _index = require('./index');

var _utils = require('./utils');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Renderer = function Renderer(viewFunc) {
  var data = {};
  var inProgress = false;
  var active = true;

  return {
    push: function push(newData) {
      if (newData === _index.chan.CLOSED || newData === _index.chan.ENDED) {
        return;
      }
      data = (0, _utils.accumulate)(data, newData);
      if (!inProgress) {
        inProgress = true;
        Promise.resolve().then(function () {
          if (active) {
            viewFunc(data);
          }
          inProgress = false;
        });
      }
    },
    destroy: function destroy() {
      active = false;
    }
  };
};

function createRiew(viewFunc) {
  for (var _len = arguments.length, routines = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    routines[_key - 1] = arguments[_key];
  }

  var name = (0, _utils.getFuncName)(viewFunc);
  var riew = {
    id: (0, _utils.getId)(name),
    name: name
  };
  var renderer = Renderer(viewFunc);
  var states = [];
  var cleanups = [];
  var runningRoutines = [];
  var externals = {};
  var state = function state() {
    var s = _index.state.apply(undefined, arguments);
    states.push(s);
    return s;
  };
  var VIEW_TOPIC = riew.id + '_view';
  var PROPS_TOPIC = riew.id + '_props';

  var normalizeRenderData = function normalizeRenderData(value) {
    return Object.keys(value).reduce(function (obj, key) {
      if ((0, _index.isState)(value[key])) {
        (0, _index.sub)(value[key].READ, function (v) {
          (0, _index.pub)(VIEW_TOPIC, _defineProperty({}, key, v));
        });
      } else if (key.charAt(0) === '$') {
        var viewKey = key.substr(1, key.length);
        (0, _index.sub)(value[key], function (v) {
          (0, _index.pub)(VIEW_TOPIC, _defineProperty({}, viewKey, v));
        });
      } else {
        obj[key] = value[key];
      }
      return obj;
    }, {});
  };

  riew.mount = function () {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    (0, _utils.requireObject)(props);
    (0, _index.sub)(PROPS_TOPIC, function (newProps) {
      return (0, _index.pub)(VIEW_TOPIC, newProps);
    });
    (0, _index.sub)(VIEW_TOPIC, renderer.push);
    runningRoutines = routines.map(function (r) {
      return (0, _index.go)(r, [_extends({
        render: function render(value) {
          (0, _utils.requireObject)(value);
          (0, _index.pub)(VIEW_TOPIC, normalizeRenderData(value));
        },
        state: state,
        props: PROPS_TOPIC
      }, externals)], function (result) {
        if (typeof result === 'function') {
          cleanups.push(result);
        }
      });
    });
    if (!(0, _utils.isObjectEmpty)(externals)) {
      (0, _index.pub)(VIEW_TOPIC, normalizeRenderData(externals));
    }
    (0, _index.pub)(PROPS_TOPIC, props);
  };

  riew.unmount = function () {
    cleanups.forEach(function (c) {
      return c();
    });
    cleanups = [];
    states.forEach(function (s) {
      return s.destroy();
    });
    states = [];
    runningRoutines.forEach(function (r) {
      return r.stop();
    });
    runningRoutines = [];
    renderer.destroy();
    (0, _index.halt)(PROPS_TOPIC);
    (0, _index.halt)(VIEW_TOPIC);
  };

  riew.update = function () {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    (0, _utils.requireObject)(props);
    (0, _index.pub)(PROPS_TOPIC, props);
  };

  riew.with = function () {
    for (var _len2 = arguments.length, maps = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      maps[_key2] = arguments[_key2];
    }

    riew.__setExternals(maps);
    return riew;
  };

  riew.test = function (map) {
    var newInstance = createRiew.apply(undefined, [viewFunc].concat(routines));

    newInstance.__setExternals([map]);
    return newInstance;
  };

  riew.__setExternals = function (maps) {
    maps = maps.reduce(function (map, item) {
      if (typeof item === 'string') {
        map = _extends({}, map, _defineProperty({}, item, (0, _index.use)(item)));
      } else {
        map = _extends({}, map, item);
      }
      return map;
    }, {});
    externals = _extends({}, externals, maps);
  };

  return riew;
}