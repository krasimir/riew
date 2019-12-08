'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.chan = chan;
exports.go = go;
exports.put = put;
exports.take = take;
exports.sleep = sleep;
exports.ops = ops;
exports.merge = merge;
exports.timeout = timeout;
exports.isChannel = isChannel;

var _utils = require('../utils');

var _constants = require('./constants');

var _index = require('../index');

var _buffer = require('./buffer');

var _buffer2 = _interopRequireDefault(_buffer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// **************************************************** chan / channel

function chan() {
  var state = _constants.OPEN;

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var _normalizeChannelArgu = normalizeChannelArguments(args),
      _normalizeChannelArgu2 = _slicedToArray(_normalizeChannelArgu, 2),
      id = _normalizeChannelArgu2[0],
      buff = _normalizeChannelArgu2[1];

  var api = { id: id, '@channel': true };

  ops(api);

  api.buff = buff;
  api.state = function (s) {
    if (typeof s !== 'undefined') {
      state = s;
      if (state === _constants.ENDED) {
        _index.grid.remove(api);
      }
    }
    return state;
  };
  api.__value = function () {
    console.warn("Riew: you should not get the channel's value directly! This method is here purely for testing purposes.");
    return buff.getValue();
  };

  _index.grid.add(api);
  return api;
}

// **************************************************** constants

chan.OPEN = _constants.OPEN;
chan.CLOSED = _constants.CLOSED;
chan.ENDED = _constants.ENDED;

// **************************************************** go / generators

function go(genFunc) {
  var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var done = arguments[2];

  var RUNNING = 'RUNNING';
  var STOPPED = 'STOPPED';
  var gen = genFunc.apply(undefined, _toConsumableArray(args));
  var state = RUNNING;
  var api = {
    stop: function stop() {
      state = STOPPED;
    }
  };

  if (!(0, _utils.isGenerator)(gen)) {
    if ((0, _utils.isPromise)(gen)) {
      gen.then(function (r) {
        if (done && state === RUNNING) done(r);
      });
      return api;
    }
    if (done && state === RUNNING) done(gen);
    return api;
  }
  var alreadyDone = false;
  (function next(value) {
    if (alreadyDone || state === STOPPED) {
      // There are cases where the channel is closed but then we have more iteration
      return;
    }
    var i = gen.next(value);
    if (i.done === true) {
      alreadyDone = true;
      if (done) done(i.value);
      return;
    }
    switch (i.value.op) {
      case _constants.PUT:
        i.value.ch.put(i.value.item, next);
        break;
      case _constants.TAKE:
        i.value.ch.take(next);
        break;
      case _constants.SLEEP:
        setTimeout(next, i.value.ms);
        break;
      default:
        throw new Error('Unrecognized operation ' + i.value.op + ' for a routine.');
    }
  })();

  return api;
}
function put(ch, item) {
  return { ch: ch, op: _constants.PUT, item: item };
}
function take(ch) {
  return { ch: ch, op: _constants.TAKE };
}
function sleep() {
  var ms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

  return { op: _constants.SLEEP, ms: ms };
}

// **************************************************** ops

function ops(ch) {
  var opsTaker = false;
  var observers = [];

  function taker() {
    if (!opsTaker) {
      opsTaker = true;
      var listen = function listen(v) {
        if (v === _constants.CLOSED || v === _constants.ENDED) return;
        observers.forEach(function (p) {
          if (isChannel(p.observer)) {
            p.observer.put(v);
          } else {
            p.observer(v);
          }
        });
        ch.take(listen);
      };
      ch.take(listen);
    }
  }

  ch.put = function (item, next) {
    var result = void 0;
    var callback = next;
    if (typeof next === 'undefined') {
      result = new Promise(function (resolve) {
        return callback = resolve;
      });
    }

    var state = ch.state();
    if (state === chan.CLOSED || state === chan.ENDED) {
      callback(state);
    } else {
      ch.buff.put(item, function (result) {
        return callback(result);
      });
    }

    return result;
  };

  ch.take = function (next) {
    var result = void 0;
    var callback = next;
    if (typeof next === 'undefined') {
      result = new Promise(function (resolve) {
        return callback = resolve;
      });
    }

    var state = ch.state();
    if (state === chan.ENDED) {
      callback(chan.ENDED);
    } else {
      // When we close a channel we do check if the buffer is empty.
      // If it is not then it is safe to take from it.
      // If it is empty the state here will be ENDED, not CLOSED.
      // So there is no way to reach this point with CLOSED state and an empty buffer.
      if (state === chan.CLOSED && ch.buff.isEmpty()) {
        ch.state(chan.ENDED);
        callback(chan.ENDED);
      } else {
        ch.buff.take(function (result) {
          return callback(result);
        });
      }
    }

    return result;
  };

  ch.close = function () {
    var newState = ch.buff.isEmpty() ? _constants.ENDED : _constants.CLOSED;
    ch.state(newState);
    ch.buff.puts.forEach(function (put) {
      return put(newState);
    });
    ch.buff.takes.forEach(function (take) {
      return take(newState);
    });
    _index.grid.remove(ch);
  };

  ch.reset = function () {
    ch.state(_constants.OPEN);
    ch.buff.reset();
  };

  ch.subscribe = function (observer) {
    var who = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _utils.getId)('who');

    var id = (0, _utils.getId)('sub');
    if (isChannel(observer)) {
      who = observer.id;
    }
    if (!observers.find(function (p) {
      return p.who === who;
    })) {
      observers.push({ id: id, observer: observer, who: who });
    }
    taker();
    return function () {
      var index = observers.findIndex(function (p) {
        return p.id === id;
      });
      if (index >= 0) {
        observers.splice(index, 1);
      }
    };
  };

  ch.map = function (func) {
    var newCh = chan();
    ch.subscribe(function (value) {
      return newCh.put(func(value));
    });
    return newCh;
  };

  ch.filter = function (func) {
    var newCh = chan();
    ch.subscribe(function (value) {
      if (func(value)) newCh.put(value);
    });
    return newCh;
  };

  ch.isActive = function () {
    return ch.state() === _constants.OPEN;
  };
}

function merge() {
  var newCh = chan();

  for (var _len2 = arguments.length, channels = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    channels[_key2] = arguments[_key2];
  }

  channels.map(function (ch) {
    var listen = function listen() {
      ch.take(function (v) {
        if (v !== _constants.CLOSED && v !== _constants.ENDED && newCh.state() === _constants.OPEN) {
          newCh.put(v);
          listen();
        }
      });
    };
    listen();
  });

  return newCh;
}

function timeout(interval) {
  var ch = chan();
  setTimeout(function () {
    return ch.close();
  }, interval);
  return ch;
}

// **************************************************** utils

function isChannel(ch) {
  return ch && ch['@channel'] === true;
}

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