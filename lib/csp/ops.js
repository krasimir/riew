'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isChannel = undefined;
exports.put = put;
exports.sput = sput;
exports.take = take;
exports.stake = stake;
exports.read = read;
exports.sread = sread;
exports.unread = unread;
exports.unreadAll = unreadAll;
exports.close = close;
exports.sclose = sclose;
exports.channelReset = channelReset;
exports.schannelReset = schannelReset;
exports.call = call;
exports.fork = fork;
exports.merge = merge;
exports.timeout = timeout;
exports.go = go;
exports.sleep = sleep;
exports.stop = stop;

var _constants = require('./constants');

var _index = require('../index');

var _utils = require('../utils');

var _utils2 = require('./utils');

var _pubsub = require('./pubsub');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /* eslint-disable no-use-before-define, no-param-reassign */


var noop = function noop() {};

// **************************************************** put

function put(channels, item) {
  return { channels: channels, op: _constants.PUT, item: item };
}
function sput(channels, item) {
  var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop;

  channels = (0, _utils2.normalizeChannels)(channels, 'WRITE');
  var data = channels.map(function () {
    return _constants.NOTHING;
  });
  var putDone = function putDone(value, idx) {
    data[idx] = value;
    if (!data.includes(_constants.NOTHING)) {
      callback(data.length === 1 ? data[0] : data);
    }
  };
  channels.forEach(function (channel, idx) {
    var state = channel.state();
    if (state === _constants.CLOSED || state === _constants.ENDED) {
      callback(state);
    } else {
      callSubscribers(channel, item, function () {
        return channel.buff.put(item, function (res) {
          return putDone(res, idx);
        });
      });
    }
  });
}
function callSubscribers(ch, item, callback) {
  var subscribers = ch.subscribers.map(function () {
    return 1;
  });
  if (subscribers.length === 0) return callback();
  var subscriptions = [].concat(_toConsumableArray(ch.subscribers));
  ch.subscribers = [];
  subscriptions.forEach(function (s) {
    var notify = s.notify,
        listen = s.listen;

    if (listen) {
      ch.subscribers.push(s);
    }
    notify(item, function () {
      return subscribers.shift(), subscribers.length === 0 ? callback() : null;
    });
  });
}

// **************************************************** take

function take(channels, options) {
  return { channels: channels, op: _constants.TAKE, options: options };
}
function stake(channels, callback, options) {
  channels = (0, _utils2.normalizeChannels)(channels);
  options = (0, _utils2.normalizeOptions)(options);
  var data = channels.map(function () {
    return _constants.NOTHING;
  });
  var takeDone = function takeDone(value, idx) {
    data[idx] = value;
    if (options.strategy === _constants.ONE_OF) {
      callback(value);
    } else if (!data.includes(_constants.NOTHING)) {
      callback(data.length === 1 ? data[0] : data);
    }
  };
  channels.forEach(function (channel, idx) {
    var state = channel.state();
    if (state === _constants.ENDED) {
      takeDone(_constants.ENDED, idx);
    } else if (state === _constants.CLOSED && channel.buff.isEmpty()) {
      channel.state(_constants.ENDED);
      takeDone(_constants.ENDED, idx);
    } else {
      channel.buff.take(function (r) {
        return takeDone(r, idx);
      });
    }
  });
}

// **************************************************** read

function read(channels, options) {
  return { channels: channels, op: _constants.READ, options: options };
}
function sread(channels, to, options) {
  channels = (0, _utils2.normalizeChannels)(channels);
  options = (0, _utils2.normalizeOptions)(options);
  var f = void 0;
  options = (0, _utils2.normalizeOptions)(options);
  switch (options.strategy) {
    case _constants.ALL_REQUIRED:
      f = _pubsub.waitAllStrategy;
      break;
    case _constants.ONE_OF:
      f = _pubsub.waitOneStrategy;
      break;
    default:
      throw new Error('Subscription strategy not recognized. Expecting ALL_REQUIRED or ONE_OF but "' + options.strategy + '" given.');
  }
  return f(channels, (0, _utils2.normalizeTo)(to), options);
}
function unread(channels, callback) {
  channels = (0, _utils2.normalizeChannels)(channels);
  channels.forEach(function (ch) {
    if (isChannel(callback)) {
      callback = callback.__subFunc;
    }
    ch.subscribers = ch.subscribers.filter(function (_ref) {
      var to = _ref.to;

      if (to !== callback) {
        return true;
      }
      return false;
    });
  });
}
function unreadAll(channels) {
  (0, _utils2.normalizeChannels)(channels).forEach(function (ch) {
    ch.subscribers = [];
  });
}

read.ALL_REQUIRED = _constants.ALL_REQUIRED;
read.ONE_OF = _constants.ONE_OF;

// **************************************************** close, reset, call, fork, merge, timeout

function close(channels) {
  channels = (0, _utils2.normalizeChannels)(channels);
  channels.forEach(function (ch) {
    var newState = ch.buff.isEmpty() ? _constants.ENDED : _constants.CLOSED;
    ch.state(newState);
    ch.buff.puts.forEach(function (p) {
      return p(newState);
    });
    ch.buff.takes.forEach(function (t) {
      return t(newState);
    });
    _index.grid.remove(ch);
    ch.subscribers = [];
    _constants.CHANNELS.del(ch.id);
  });
  return { op: _constants.NOOP };
}
function sclose(id) {
  return close(id);
}
function channelReset(channels) {
  channels = (0, _utils2.normalizeChannels)(channels);
  channels.forEach(function (ch) {
    ch.state(_constants.OPEN);
    ch.buff.reset();
  });
  return { op: _constants.NOOP };
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
function merge() {
  var newCh = (0, _index.chan)();

  for (var _len3 = arguments.length, channels = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    channels[_key3] = arguments[_key3];
  }

  channels.forEach(function (ch) {
    (function taker() {
      stake(ch, function (v) {
        if (v !== _constants.CLOSED && v !== _constants.ENDED && newCh.state() === _constants.OPEN) {
          sput(newCh, v, taker);
        }
      });
    })();
  });
  return newCh;
}
function timeout(interval) {
  var ch = (0, _index.chan)();
  setTimeout(function () {
    return close(ch);
  }, interval);
  return ch;
}

// **************************************************** other

var isChannel = exports.isChannel = function isChannel(ch) {
  return ch && ch['@channel'] === true;
};

// **************************************************** routine

function go(func) {
  for (var _len4 = arguments.length, args = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
    args[_key4 - 2] = arguments[_key4];
  }

  var done = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

  var RUNNING = 'RUNNING';
  var STOPPED = 'STOPPED';
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
      if (i.value && i.value['@go'] === true) {
        api.rerun();
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
        sput(i.value.channels, i.value.item, next);
        break;
      case _constants.TAKE:
        stake(i.value.channels, next, i.value.options);
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
      case _constants.READ:
        sread(i.value.channels, next, i.value.options);
        break;
      case _constants.CALL_ROUTINE:
        addSubRoutine(go.apply(undefined, [i.value.routine, next].concat(_toConsumableArray(i.value.args), args)));
        break;
      case _constants.FORK_ROUTINE:
        addSubRoutine(go.apply(undefined, [i.value.routine, function () {}].concat(args, _toConsumableArray(i.value.args))));
        next();
        break;
      default:
        throw new Error('Unrecognized operation ' + i.value.op + ' for a routine.');
    }
  }

  next();

  return api;
}
go['@go'] = true;

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