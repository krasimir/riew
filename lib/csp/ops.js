"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isChannel = undefined;
exports.put = put;
exports.sput = sput;
exports.take = take;
exports.stake = stake;
exports.close = close;
exports.sclose = sclose;
exports.channelReset = channelReset;
exports.schannelReset = schannelReset;
exports.call = call;
exports.fork = fork;
exports.go = go;
exports.sleep = sleep;
exports.stop = stop;

var _constants = require("./constants");

var _index = require("../index");

var _utils = require("../utils");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var noop = function noop() {};
var normalizeChannel = function normalizeChannel(id) {
  var stateOp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "READ";

  if (isChannel(id)) return id;
  if ((0, _index.isState)(id)) return (0, _index.chan)(id[stateOp]);
  return (0, _index.chan)(id);
};

// **************************************************** PUT

function put(id, item, callback) {
  var doPut = function doPut(ch, item, callback) {
    var state = ch.state();
    if (state === _constants.CLOSED || state === _constants.ENDED) {
      callback(state);
    } else {
      if ("prePut" in ch.transforms) {
        ch.transforms.prePut(item, function (newItem) {
          ch.subscribers.forEach(function (_ref) {
            var notify = _ref.notify;
            return notify(newItem);
          });
          ch.buff.put(newItem, callback);
        });
      } else {
        ch.subscribers.forEach(function (_ref2) {
          var notify = _ref2.notify;
          return notify(item);
        });
        ch.buff.put(item, callback);
      }
    }
  };

  var ch = normalizeChannel(id, "WRITE");
  if (typeof callback === "function") {
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

  var ch = normalizeChannel(id);
  if (typeof callback === "function") {
    if ((0, _index.isStateWriteChannel)(ch)) {
      console.warn("You are about to `take` from a state WRITE channel. This type of channel is using `ever` buffer which means that will resolve its takes and puts immediately. You probably want to use `sub(<channel>)`.");
    }
    doTake(ch, callback);
  } else {
    return { ch: ch, op: _constants.TAKE };
  }
}
function stake(id, callback) {
  return take(id, callback || noop);
}

// **************************************************** close, reset, call, fork

function close(id) {
  var ch = normalizeChannel(id);
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
  _constants.CHANNELS.del(ch.id);
  return { op: _constants.NOOP };
}
function sclose(id) {
  return close(id);
}
function channelReset(id) {
  var ch = normalizeChannel(id);
  ch.state(_constants.OPEN);
  ch.buff.reset();
  return { ch: ch, op: _constants.NOOP };
}
function schannelReset(id) {
  channelReset(id);
}
function call(routine) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return { op: _constants.CALL_ROUTINE, routine: routine, args: args };
}
function fork(routine) {
  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  return { op: _constants.FORK_ROUTINE, routine: routine, args: args };
}

// **************************************************** other

var isChannel = exports.isChannel = function isChannel(ch) {
  return ch && ch["@channel"] === true;
};

// **************************************************** routine

function go(func) {
  for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
    args[_key3 - 2] = arguments[_key3];
  }

  var done = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

  var RUNNING = "RUNNING";
  var STOPPED = "STOPPED";
  var state = RUNNING;

  var api = {
    children: [],
    stop: function stop() {
      state = STOPPED;
      this.children.forEach(function (r) {
        return r.stop();
      });
    },
    rerun: function rerun() {
      gen = func.apply(undefined, args);
      next();
    }
  };
  var addSubRoutine = function addSubRoutine(r) {
    return api.children.push(r);
  };

  var gen = func.apply(undefined, args);
  function next(value) {
    if (state === STOPPED) {
      return;
    }
    var i = gen.next(value);
    if (i.done === true) {
      if (done) done(i.value);
      if (i.value && i.value["@go"] === true) {
        gen = func.apply(undefined, args);
        next();
      }
      return;
    }
    if ((0, _utils.isPromise)(i.value)) {
      i.value.then(next).catch(function (err) {
        return gen.throw(err);
      });
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
      case _constants.STOP:
        state = STOPPED;
        break;
      case _constants.SUB:
        (0, _index.subOnce)(i.value.ch, next);
        break;
      case _constants.CALL_ROUTINE:
        addSubRoutine(go.apply(undefined, [i.value.routine, next].concat(args, _toConsumableArray(i.value.args))));
        break;
      case _constants.FORK_ROUTINE:
        addSubRoutine(go.apply(undefined, [i.value.routine, function () {}].concat(args, _toConsumableArray(i.value.args))));
        next();
        break;
      default:
        throw new Error("Unrecognized operation " + i.value.op + " for a routine.");
    }
  }

  next();

  return api;
}
go["@go"] = true;

function sleep(ms, callback) {
  if (typeof callback === "function") {
    setTimeout(callback, ms);
  } else {
    return { op: _constants.SLEEP, ms: ms };
  }
}

function stop() {
  return { op: _constants.STOP };
}