'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isStateWriteChannel = exports.isStateReadChannel = exports.isState = exports.isRiew = exports.isChannel = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
exports.runRoutine = runRoutine;
exports.sleep = sleep;
exports.stop = stop;

var _constants = require('./constants');

var _index = require('../index');

var _utils = require('../utils');

var _utils2 = require('./utils');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /* eslint-disable no-use-before-define, no-param-reassign */


var noop = function noop() {};

// **************************************************** put

function put(channels, item) {
  return { channels: channels, op: _constants.PUT, item: item };
}
function sput(channels, item) {
  var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop;

  channels = (0, _utils2.normalizeChannels)(channels, 'WRITE');
  var result = channels.map(function () {
    return _constants.NOTHING;
  });
  var items = channels.length > 1 ? item : [item];
  channels.forEach(function (channel, idx) {
    var state = channel.state();
    if (state === _constants.CLOSED || state === _constants.ENDED) {
      callback(state);
    } else {
      callSubscribers(channel, items[idx], function () {
        channel.buff.put(items[idx], function (value) {
          result[idx] = value;
          if (!result.includes(_constants.NOTHING)) {
            callback(result.length === 1 ? result[0] : result);
          }
        });
      });
    }
  });
}
function callSubscribers(channel, item, callback) {
  var notificationProcess = channel.subscribers.map(function () {
    return 1;
  }); // just to count the notified channels
  if (notificationProcess.length === 0) return callback();
  var subscriptions = [].concat(_toConsumableArray(channel.subscribers));
  channel.subscribers = [];
  subscriptions.forEach(function (s) {
    var notify = s.notify,
        listen = s.listen;

    if (listen) {
      channel.subscribers.push(s);
    }
    notify(item, function () {
      notificationProcess.shift();
      if (notificationProcess.length === 0) {
        callback();
      }
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
  var _options = options,
      transform = _options.transform,
      onError = _options.onError,
      initialCall = _options.initialCall,
      listen = _options.listen;


  var takeDone = function takeDone(value, idx) {
    var done = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop;

    data[idx] = value;
    var result = null;
    if (options.strategy === _constants.ONE_OF) {
      result = [value, idx];
    } else if (!data.includes(_constants.NOTHING)) {
      result = [].concat(_toConsumableArray(data));
    }
    if (result !== null) {
      if (transform) {
        try {
          if ((0, _utils.isGeneratorFunction)(transform)) {
            _index.go.apply(undefined, [transform, function (v) {
              return callback(v), done();
            }].concat(_toConsumableArray(result)));
          } else {
            callback(transform.apply(undefined, _toConsumableArray(result)));
            done();
          }
        } catch (e) {
          if (onError === null) {
            throw e;
          }
          onError(e);
        }
      } else {
        if (options.strategy === _constants.ONE_OF) {
          callback.apply(undefined, _toConsumableArray(result));
        } else {
          callback(result.length === 1 ? result[0] : result);
        }
        done();
      }
    }
  };

  var subscriptions = channels.map(function (channel, idx) {
    var state = channel.state();
    var subscription = {};
    if (state === _constants.ENDED) {
      takeDone(_constants.ENDED, idx);
    } else if (state === _constants.CLOSED && channel.buff.isEmpty()) {
      channel.state(_constants.ENDED);
      takeDone(_constants.ENDED, idx);
    } else if (options.read) {
      // reading
      if (!channel.subscribers.find(function (_ref) {
        var c = _ref.callback;
        return c === callback;
      })) {
        channel.subscribers.push(subscription = {
          callback: callback,
          notify: function notify(value, done) {
            return takeDone(value, idx, done);
          },
          listen: listen
        });
      }
      var currentChannelBufValue = channel.value();
      if (initialCall && currentChannelBufValue.length > 0) {
        takeDone(currentChannelBufValue[0], idx);
      }
    } else {
      // taking
      channel.buff.take(function (r) {
        return takeDone(r, idx);
      });
    }
    return subscription;
  });

  return {
    listen: function listen() {
      subscriptions.forEach(function (s) {
        return s.listen = true;
      });
    }
  };
}

// **************************************************** read

function read(channels, options) {
  return { channels: channels, op: _constants.READ, options: _extends({}, options, { read: true }) };
}
function sread(channels, to, options) {
  return stake(channels, (0, _utils2.normalizeTo)(to), _extends({}, options, { read: true }));
}
function unread(channels, callback) {
  channels = (0, _utils2.normalizeChannels)(channels);
  channels.forEach(function (ch) {
    if (isChannel(callback)) {
      callback = callback.__subFunc;
    }
    ch.subscribers = ch.subscribers.filter(function (_ref2) {
      var c = _ref2.callback;

      if (c !== callback) {
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

// **************************************************** close, reset, call, fork, merge, timeout, isChannel

function close(channels) {
  channels = (0, _utils2.normalizeChannels)(channels);
  channels.forEach(function (ch) {
    var newState = ch.buff.isEmpty() ? _constants.ENDED : _constants.CLOSED;
    ch.state(newState);
    ch.buff.puts.forEach(function (p) {
      return p.callback(newState);
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
var isChannel = exports.isChannel = function isChannel(ch) {
  return ch && ch['@channel'] === true;
};
var isRiew = exports.isRiew = function isRiew(r) {
  return r && r['@riew'] === true;
};
var isState = exports.isState = function isState(s) {
  return s && s['@state'] === true;
};
var isStateReadChannel = exports.isStateReadChannel = function isStateReadChannel(s) {
  return s && s['@statereadchannel'] === true;
};
var isStateWriteChannel = exports.isStateWriteChannel = function isStateWriteChannel(s) {
  return s && s['@statewritechannel'] === true;
};

// **************************************************** go/routine

function runRoutine(func) {
  for (var _len4 = arguments.length, args = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
    args[_key4 - 2] = arguments[_key4];
  }

  var done = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

  var RUNNING = 'RUNNING';
  var STOPPED = 'STOPPED';
  var state = RUNNING;

  var api = {
    id: 'routine_' + (0, _utils.getId)(),
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

  function processGeneratorStep(i) {
    switch (i.value.op) {
      case _constants.PUT:
        sput(i.value.channels, i.value.item, next);
        break;
      case _constants.TAKE:
        stake(i.value.channels, function () {
          for (var _len5 = arguments.length, nextArgs = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
            nextArgs[_key5] = arguments[_key5];
          }

          next(nextArgs.length === 1 ? nextArgs[0] : nextArgs);
        }, i.value.options);
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
        addSubRoutine(_index.go.apply(undefined, [i.value.routine, next].concat(_toConsumableArray(i.value.args))));
        break;
      case _constants.FORK_ROUTINE:
        addSubRoutine(_index.go.apply(undefined, [i.value.routine, function () {}].concat(_toConsumableArray(i.value.args))));
        next();
        break;
      default:
        throw new Error('Unrecognized operation ' + i.value.op + ' for a routine.');
    }
  }

  function next(value) {
    if (state === STOPPED) return;
    var step = gen.next(value);
    if (step.done === true) {
      if (done) done(step.value);
      if (step.value && step.value['@go'] === true) {
        api.rerun();
      }
    } else if ((0, _utils.isPromise)(step.value)) {
      step.value.then(next).catch(function (err) {
        return processGeneratorStep(gen.throw(err));
      });
    } else {
      processGeneratorStep(step);
    }
  }

  next();

  return api;
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