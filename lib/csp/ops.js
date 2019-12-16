'use strict';

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
exports.sub = sub;
exports.subOnce = subOnce;
exports.unsub = unsub;
exports.onSubscriberAdded = onSubscriberAdded;
exports.onSubscriberRemoved = onSubscriberRemoved;
exports.go = go;
exports.sleep = sleep;
exports.stop = stop;
exports.rerun = rerun;

var _constants = require('./constants');

var _index = require('../index');

var _utils = require('../utils');

var noop = function noop() {};

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
  if ((0, _index.isState)(id)) {
    throw new Error('\'put\' accepts a channel as first argument. You passed a state.');
  }

  var ch = isChannel(id) ? id : (0, _index.chan)(id);
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

  var ch = isChannel(id) ? id : (0, _index.chan)(id);
  if (typeof callback === 'function') {
    if ((0, _index.isStateWriteChannel)(ch)) {
      console.warn('You are about to `take` from a state WRITE channel. This type of channel is using `ever` buffer which means that will resolve its takes and puts immediately. You probably want to use `sub(<channel>)`.');
    }
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
  var ch = isChannel(id) ? id : (0, _index.chan)(id);
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
  var ch = isChannel(id) ? id : (0, _index.chan)(id);
  ch.state(_constants.OPEN);
  ch.buff.reset();
  return { ch: ch, op: _constants.NOOP };
}
function schannelReset(id) {
  channelReset(id);
}

// **************************************************** pubsub

function sub(id, callback) {
  var ch = isChannel(id) ? id : (0, _index.chan)(id);
  if (typeof callback === 'undefined') {
    return { ch: ch, op: _constants.SUB };
  }
  if (!ch.subscribers.find(function (c) {
    return c === callback;
  })) {
    ch.subscribers.push(callback);
  }
}
function subOnce(id, callback) {
  var ch = isChannel(id) ? id : (0, _index.chan)(id);
  var c = function c(v) {
    callback(v);
    unsub(id, c);
  };
  if (!ch.subscribers.find(function (s) {
    return s === c;
  })) {
    ch.subscribers.push(c);
  }
}
function unsub(id, callback) {
  var ch = isChannel(id) ? id : (0, _index.chan)(id);
  ch.subscribers = ch.subscribers.filter(function (c) {
    if (c !== callback) {
      return true;
    }
    return false;
  });
}
function onSubscriberAdded(id, callback) {
  var ch = isChannel(id) ? id : (0, _index.chan)(id);
  ch.onSubscriberAddedCallback = callback;
}
function onSubscriberRemoved(id, callback) {
  var ch = isChannel(id) ? id : (0, _index.chan)(id);
  ch.onSubscriberRemovedCallback = callback;
}

// **************************************************** other

var isChannel = exports.isChannel = function isChannel(ch) {
  return ch && ch['@channel'] === true;
};

// **************************************************** routine

function go(func) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  var done = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

  var RUNNING = 'RUNNING';
  var STOPPED = 'STOPPED';
  var state = RUNNING;

  var routineApi = {
    stop: function stop() {
      state = STOPPED;
    },
    rerun: function rerun() {
      gen = func.apply(undefined, args);
      next();
    }
  };

  var gen = func.apply(undefined, args);
  function next(value) {
    if (state === STOPPED) {
      return;
    }
    var i = gen.next(value);
    if (i.done === true) {
      if (done) done(i.value);
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
      case _constants.RERUN:
        gen = func.apply(undefined, args);
        next();
        break;
      case _constants.SUB:
        subOnce(i.value.ch, next);
        break;
      default:
        throw new Error('Unrecognized operation ' + i.value.op + ' for a routine.');
    }
  }

  next();

  return routineApi;
}

function sleep(ms, callback) {
  if (typeof callback === 'function') {
    setTimeout(callback, ms);
  } else {
    return { op: _constants.SLEEP, ms: ms };
  }
}

function stop() {
  return { op: _constants.STOP };
}

function rerun() {
  return { op: _constants.RERUN };
}