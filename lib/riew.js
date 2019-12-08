'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createRiew;

var _index = require('./index');

var _utils = require('./utils');

var _csp = require('./csp');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Renderer = function Renderer(viewFunc) {
  var data = {};
  var inProgress = false;
  var active = true;

  return {
    push: function push(newData) {
      if (newData === _csp.chan.CLOSED || newData === _csp.chan.ENDED) {
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

  var riew = {
    id: (0, _utils.getId)('r'),
    name: (0, _utils.getFuncName)(viewFunc)
  };
  var renderer = Renderer(viewFunc);
  var channels = [];
  var states = [];
  var cleanups = [];
  var runningRoutines = [];
  var externals = {};
  var chan = function chan() {
    var ch = _csp.chan.apply(undefined, arguments);
    channels.push(ch);
    return ch;
  };
  var state = function state() {
    var s = _csp.state.apply(undefined, arguments);
    states.push(s);
    return s;
  };
  var viewCh = chan(riew.name + '_view');
  var propsCh = chan(riew.name + '_props');

  var normalizeRenderData = function normalizeRenderData(value) {
    return Object.keys(value).reduce(function (obj, key) {
      if ((0, _csp.isChannel)(value[key])) {
        var ch = value[key];
        ch.subscribe(function (v) {
          viewCh.put(_defineProperty({}, key, v));
        }, ch.id + riew.id);
      } else if ((0, _csp.isState)(value[key])) {
        var _state = value[key];
        var _ch = _state.map();
        _ch.subscribe(function (v) {
          viewCh.put(_defineProperty({}, key, v));
        }, _ch.id + riew.id);
      } else {
        obj[key] = value[key];
      }
      return obj;
    }, {});
  };

  riew.mount = function () {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    (0, _utils.requireObject)(props);
    propsCh.subscribe(viewCh);
    viewCh.subscribe(renderer.push);
    runningRoutines = routines.map(function (r) {
      return (0, _csp.go)(r, [_extends({
        render: function render(value) {
          (0, _utils.requireObject)(value);
          viewCh.put(normalizeRenderData(value));
        },
        chan: chan,
        state: state,
        props: propsCh
      }, externals)], function (result) {
        if (typeof result === 'function') {
          cleanups.push(result);
        }
      });
    });
    if (!(0, _utils.isObjectEmpty)(externals)) {
      viewCh.put(normalizeRenderData(externals));
    }
    propsCh.put(props);
  };

  riew.unmount = function () {
    cleanups.forEach(function (c) {
      return c();
    });
    cleanups = [];
    channels.forEach(function (c) {
      return c.close();
    });
    channels = [];
    states.forEach(function (s) {
      return s.destroy();
    });
    states = [];
    runningRoutines.forEach(function (r) {
      return r.stop();
    });
    runningRoutines = [];
    renderer.destroy();
  };

  riew.update = function () {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    (0, _utils.requireObject)(props);
    propsCh.put(props);
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