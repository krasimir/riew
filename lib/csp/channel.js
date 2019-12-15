'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.channelExists = exports.getChannels = exports.cspReset = exports.isChannel = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.chan = chan;
exports.put = put;
exports.sput = sput;
exports.take = take;
exports.stake = stake;
exports.close = close;
exports.sclose = sclose;
exports.channelReset = channelReset;
exports.schannelReset = schannelReset;
exports.sub = sub;
exports.unsub = unsub;
exports.sleep = sleep;
exports.onSubscriberAdded = onSubscriberAdded;
exports.onSubscriberRemoved = onSubscriberRemoved;
exports.go = go;

var _utils = require('../utils');

var _constants = require('./constants');

var _index = require('../index');

var _buffer = require('./buffer');

var _buffer2 = _interopRequireDefault(_buffer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var channels = {};
var noop = function noop() {};

function chan() {
  var state = _constants.OPEN;

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var _normalizeChannelArgu = normalizeChannelArguments(args),
      _normalizeChannelArgu2 = _slicedToArray(_normalizeChannelArgu, 2),
      id = _normalizeChannelArgu2[0],
      buff = _normalizeChannelArgu2[1];

  if (channels[id]) {
    return channels[id];
  }

  var api = channels[id] = {
    id: id,
    '@channel': true,
    'subscribers': []
  };

  api.isActive = function () {
    return api.state() === _constants.OPEN;
  };
  api.buff = buff;
  api.state = function (s) {
    if (typeof s !== 'undefined') state = s;
    return state;
  };
  api.__value = function () {
    console.warn("Riew: you should not get the channel's value directly! This method is here purely for testing purposes.");
    return buff.getValue();
  };

  _index.grid.add(api);
  return api;
}

// **************************************************** PUT

function put(id, item, callback) {
  var doPut = function doPut(ch, item, callback) {
    var state = ch.state();
    if (state === _constants.CLOSED || state === _constants.ENDED) {
      callback(state);
    } else {
      ch.subscribers.forEach(function (s) {
        return s(item);
      });
      ch.buff.put(item, callback);
    }
  };

  var ch = isChannel(id) ? id : chan(id);
  if (typeof callback === 'function') {
    doPut(ch, item, callback);
  } else {
    return { ch: ch, op: _constants.PUT, item: item };
  }
}
function sput(id, item, callback) {
  return put(id, item, callback || noop);
}

// **************************************************** TAKE

function take(id, callback) {
  var doTake = function doTake(ch, callback) {
    var state = ch.state();
    if (state === _constants.ENDED) {
      callback(_constants.ENDED);
    } else {
      if (state === _constants.CLOSED && ch.buff.isEmpty()) {
        ch.state(_constants.ENDED);
        callback(_constants.ENDED);
      } else {
        ch.buff.take(function (r) {
          return callback(r);
        });
      }
    }
  };

  var ch = isChannel(id) ? id : chan(id);
  if (typeof callback === 'function') {
    doTake(ch, callback);
  } else {
    return { ch: ch, op: _constants.TAKE };
  }
}
function stake(id, callback) {
  return take(id, callback || noop);
}

// **************************************************** close & reset

function close(id) {
  var ch = isChannel(id) ? id : chan(id);
  var newState = ch.buff.isEmpty() ? _constants.ENDED : _constants.CLOSED;
  ch.state(newState);
  ch.buff.puts.forEach(function (put) {
    return put(newState);
  });
  ch.buff.takes.forEach(function (take) {
    return take(newState);
  });
  _index.grid.remove(ch);
  ch.subscribers = [];
  delete channels[ch.id];
  return { op: _constants.NOOP };
}
function sclose(id) {
  return close(id);
}
function channelReset(id) {
  var ch = isChannel(id) ? id : chan(id);
  ch.state(_constants.OPEN);
  ch.buff.reset();
  return { ch: ch, op: _constants.NOOP };
}
function schannelReset(id) {
  channelReset(id);
}

// **************************************************** pubsub

function sub(id, callback) {
  var ch = isChannel(id) ? id : chan(id);
  if (!ch.subscribers.find(function (c) {
    return c === callback;
  })) {
    ch.subscribers.push(callback);
  }
}
function unsub(id, callback) {
  var ch = isChannel(id) ? id : chan(id);
  ch.subscribers = ch.subscribers.filter(function (c) {
    if (c !== callback) {
      return true;
    }
    return false;
  });
}
function sleep(ms, callback) {
  if (typeof callback === 'function') {
    setTimeout(callback, ms);
  } else {
    return { op: _constants.SLEEP, ms: ms };
  }
}
function onSubscriberAdded(id, callback) {
  var ch = isChannel(id) ? id : chan(id);
  ch.onSubscriberAddedCallback = callback;
}
function onSubscriberRemoved(id, callback) {
  var ch = isChannel(id) ? id : chan(id);
  ch.onSubscriberRemovedCallback = callback;
}

// **************************************************** other

var isChannel = exports.isChannel = function isChannel(ch) {
  return ch && ch['@channel'] === true;
};
var cspReset = exports.cspReset = function cspReset() {
  return channels = {};
};
var getChannels = exports.getChannels = function getChannels() {
  return channels;
};
var channelExists = exports.channelExists = function channelExists(id) {
  return !!channels[id];
};

// **************************************************** routine

function go(func) {
  var done = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

  var RUNNING = 'RUNNING';
  var STOPPED = 'STOPPED';
  var state = RUNNING;

  var routineApi = {
    stop: function stop() {
      state = STOPPED;
    }
  };

  for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    args[_key2 - 2] = arguments[_key2];
  }

  var gen = func.apply(undefined, args);
  (function next(value) {
    if (state === STOPPED) {
      return;
    }
    var i = gen.next(value);
    if (i.done === true) {
      if (done) done(i.value);
      return;
    }
    switch (i.value.op) {
      case _constants.PUT:
        put(i.value.ch, i.value.item, next);
        break;
      case _constants.TAKE:
        take(i.value.ch, next);
        break;
      case _constants.NOOP:
        next();
        break;
      case _constants.SLEEP:
        setTimeout(next, i.value.ms);
        break;
      default:
        throw new Error('Unrecognized operation ' + i.value.op + ' for a routine.');
    }
  })();

  return routineApi;
}

// **************************************************** utils

function normalizeChannelArguments(args) {
  var id = void 0,
      buff = void 0;
  if (args.length === 2) {
    id = args[0];
    buff = args[1];
  } else if (args.length === 1 && typeof args[0] === 'string') {
    id = args[0];
    buff = _buffer2.default.fixed();
  } else if (args.length === 1 && _typeof(args[0]) === 'object') {
    id = (0, _utils.getId)('ch');
    buff = args[0];
  } else {
    id = (0, _utils.getId)('ch');
    buff = _buffer2.default.fixed();
  }
  return [id, buff];
}