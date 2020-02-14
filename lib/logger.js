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
var ROUTINE = 'ROUTINE';

function normalizeRiew(r) {
  return {
    id: r.id,
    name: r.name,
    type: RIEW,
    viewData: (0, _sanitize2.default)(r.renderer.data()),
    children: r.children.map(function (child) {
      if ((0, _index.isState)(child)) {
        return normalizeState(child);
      }
      if ((0, _index.isChannel)(child)) {
        return normalizeChannel(child);
      }
      if ((0, _index.isRoutine)(child)) {
        return normalizeRoutine(child);
      }
      console.warn('Riew logger: unrecognized riew child', child);
    })
  };
}
function normalizeState(s) {
  return {
    id: s.id,
    type: STATE,
    value: (0, _sanitize2.default)(s.get()),
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
    value: (0, _sanitize2.default)(c.value()),
    puts: c.buff.puts.map(function (_ref) {
      var item = _ref.item;
      return { item: item };
    }),
    takes: c.buff.takes.map(function (_ref2) {
      var options = _ref2.options;
      return {
        read: options.read,
        listen: options.listen
      };
    })
  };
  return o;
}
function normalizeRoutine(r) {
  return {
    id: r.id,
    type: ROUTINE,
    name: r.name
  };
}

function Logger() {
  var api = {};
  var frames = [];
  var data = [];
  var inProgress = false;
  var enabled = false;
  var listeners = [];

  api.on = function (listener) {
    return listeners.push(listener);
  };
  api.log = function (who, what, meta) {
    if (!enabled) return null;
    if ((0, _index.isRiew)(who)) {
      who = normalizeRiew(who);
    } else if ((0, _index.isState)(who)) {
      who = normalizeState(who);
    } else if ((0, _index.isChannel)(who)) {
      who = normalizeChannel(who);
    } else if ((0, _index.isRoutine)(who)) {
      who = normalizeRoutine(who);
    } else {
      console.warn('Riew logger: unrecognized who', who, what);
    }
    data.push({
      who: who,
      what: what,
      meta: (0, _sanitize2.default)(meta)
    });
    if (!inProgress) {
      inProgress = true;
      Promise.resolve().then(function () {
        var s = api.snapshot(data);
        inProgress = false;
        data = [];
        listeners.forEach(function (l) {
          return l(s);
        });
      });
    }
  };
  api.snapshot = function (actions) {
    if (!enabled) return null;
    if (frames.length >= MAX_SNAPSHOTS) {
      frames.shift();
    }
    var riews = [];
    var states = [];
    var filteredStates = [];
    var channels = [];
    var filteredRoutines = [];
    var routines = [];
    var filteredChannels = [];

    _index.grid.nodes().forEach(function (node) {
      if ((0, _index.isRiew)(node)) {
        riews.push(normalizeRiew(node));
      } else if ((0, _index.isState)(node)) {
        states.push(normalizeState(node));
      } else if ((0, _index.isChannel)(node)) {
        channels.push(normalizeChannel(node));
      } else if ((0, _index.isRoutine)(node)) {
        routines.push(normalizeRoutine(node));
      } else {
        console.warn('Riew logger: unrecognized entity type', node);
      }
    });
    filteredStates = states.filter(function (s) {
      return !riews.find(function (r) {
        return r.children.find(function (_ref3) {
          var id = _ref3.id;
          return s.id === id;
        });
      });
    });
    filteredChannels = channels.filter(function (c) {
      return !riews.find(function (r) {
        return r.children.find(function (_ref4) {
          var id = _ref4.id;
          return c.id === id;
        });
      }) && !states.find(function (s) {
        return s.children.find(function (_ref5) {
          var id = _ref5.id;
          return c.id === id;
        });
      });
    });
    filteredRoutines = routines.filter(function (ro) {
      return !riews.find(function (r) {
        return r.children.find(function (_ref6) {
          var id = _ref6.id;
          return ro.id === id;
        });
      });
    });
    var snapshot = (0, _sanitize2.default)({
      actions: actions,
      state: [].concat(riews, _toConsumableArray(filteredStates), _toConsumableArray(filteredChannels), _toConsumableArray(filteredRoutines))
    });
    frames.push(snapshot);
    return snapshot;
  };
  api.frames = function () {
    return frames;
  };
  api.now = function () {
    return frames.length > 0 ? frames[frames.length - 1] : null;
  };
  api.reset = function () {
    frames = [];
    enabled = false;
  };
  api.enable = function () {
    enabled = true;
  };
  api.disable = function () {
    enabled = false;
  };

  return api;
}