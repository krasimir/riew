'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Logger;

var _index = require('./index');

var _sanitize = require('./sanitize');

var _sanitize2 = _interopRequireDefault(_sanitize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /* eslint-disable no-use-before-define */


var MAX_SNAPSHOTS = 100;
var RIEW = 'RIEW';
var STATE = 'STATE';
var CHANNEL = 'CHANNEL';

function normalizeRiew(r) {
  return {
    id: r.id,
    name: r.name,
    type: RIEW,
    viewData: r.renderer.data(),
    children: r.children.map(function (child) {
      if ((0, _index.isState)(child)) {
        return normalizeState(child);
      }
      if ((0, _index.isChannel)(child)) {
        return normalizeChannel(child);
      }
      console.warn('Riew logger: unrecognized riew child', child);
    })
  };
}
function normalizeState(s) {
  return {
    id: s.id,
    type: STATE,
    value: s.get(),
    children: s.children().map(function (child) {
      if ((0, _index.isChannel)(child)) {
        return normalizeChannel(child);
      }
      console.warn('Riew logger: unrecognized state child', child);
    })
  };
}
function normalizeChannel(c) {
  var o = {
    id: c.id,
    type: CHANNEL,
    value: c.value(),
    puts: c.buff.puts.map(function (_ref) {
      var item = _ref.item;
      return item;
    }),
    takes: c.buff.takes.map(function () {
      return 'TAKE';
    })
  };
  if ((0, _index.isStateWriteChannel)(c)) {
    o.stateWrite = true;
  }
  if ((0, _index.isStateReadChannel)(c)) {
    o.stateRead = true;
  }
  return o;
}

function Logger() {
  var api = {};
  var frames = [];

  api.snapshot = function () {
    if (frames.length >= MAX_SNAPSHOTS) {
      frames.shift();
    }
    var riews = [];
    var states = [];
    var filteredStates = [];
    var channels = [];
    var filteredChannels = [];

    _index.grid.nodes().forEach(function (node) {
      if ((0, _index.isRiew)(node)) {
        riews.push(normalizeRiew(node));
      } else if ((0, _index.isState)(node)) {
        states.push(normalizeState(node));
      } else if ((0, _index.isChannel)(node)) {
        channels.push(normalizeChannel(node));
      } else {
        // console.warn('Riew logger: unrecognized entity type', node);
      }
    });
    filteredStates = states.filter(function (s) {
      return !riews.find(function (r) {
        return r.children.find(function (_ref2) {
          var id = _ref2.id;
          return s.id === id;
        });
      });
    });
    filteredChannels = channels.filter(function (c) {
      return !riews.find(function (r) {
        return r.children.find(function (_ref3) {
          var id = _ref3.id;
          return c.id === id;
        });
      }) && !states.find(function (s) {
        return s.children.find(function (_ref4) {
          var id = _ref4.id;
          return c.id === id;
        });
      });
    });
    var snapshot = (0, _sanitize2.default)({
      items: [].concat(riews, _toConsumableArray(filteredStates), _toConsumableArray(filteredChannels))
    });
    frames.push(snapshot);
    return snapshot;
  };
  api.frames = function () {
    return frames;
  };
  api.reset = function () {
    frames = [];
  };

  return api;
}