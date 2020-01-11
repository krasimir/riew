'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isStateWriteChannel = exports.isStateReadChannel = exports.isRoutine = exports.isState = exports.isRiew = exports.isChannel = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.sput = sput;
exports.put = put;
exports.stake = stake;
exports.take = take;
exports.read = read;
exports.sread = sread;
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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /* eslint-disable no-use-before-define, no-param-reassign */


var noop = function noop() {};

// **************************************************** put

function sput(channels, item) {
  var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop;

  channels = (0, _utils2.normalizeChannels)(channels, 'WRITE');
  var result = channels.map(function () {
    return _constants.NOTHING;
  });
  var setResult = function setResult(idx, value) {
    result[idx] = value;
    if (!result.includes(_constants.NOTHING)) {
      callback(result.length === 1 ? result[0] : result);
    }
  };
  channels.forEach(function (channel, idx) {
    var chState = channel.state();
    if (chState !== _constants.OPEN) {
      setResult(idx, chState);
    } else {
      channel.buff.put(item, function (putResult) {
        return setResult(idx, putResult);
      });
    }
  });
}
function put(channels, item) {
  return { channels: channels, op: _constants.PUT, item: item };
}

// **************************************************** take

function stake(channels, callback, options) {
  channels = (0, _utils2.normalizeChannels)(channels);
  options = (0, _utils2.normalizeOptions)(options);
  callback = (0, _utils2.normalizeTo)(callback);
  var unsubscribers = void 0;
  if (options.strategy === _constants.ALL_REQUIRED) {
    var result = channels.map(function () {
      return _constants.NOTHING;
    });
    var setResult = function setResult(idx, value) {
      result[idx] = value;
      if (!result.includes(_constants.NOTHING)) {
        callback(result.length === 1 ? result[0] : [].concat(_toConsumableArray(result)));
      }
    };
    unsubscribers = channels.map(function (channel, idx) {
      var chState = channel.state();
      if (chState === _constants.ENDED) {
        setResult(idx, chState);
      } else if (chState === _constants.CLOSED && channel.buff.isEmpty()) {
        channel.state(_constants.ENDED);
        setResult(idx, _constants.ENDED);
      } else {
        return channel.buff.take(function (takeResult) {
          return setResult(idx, takeResult);
        }, options);
      }
    });
  } else if (options.strategy === _constants.ONE_OF) {
    var done = function done() {
      // This function is here to clean up the unresolved buffer readers.
      // In the ONE_OF strategy there are pending readers that should be
      // killed since one of the others in the list is called. And this
      // should happen only if we are not listening.
      if (!options.listen) {
        unsubscribers.filter(function (f) {
          return f;
        }).forEach(function (f) {
          return f();
        });
      }
      callback.apply(undefined, arguments);
    };
    unsubscribers = channels.map(function (channel, idx) {
      var chState = channel.state();
      if (chState === _constants.ENDED) {
        done(chState, idx);
      } else if (chState === _constants.CLOSED && channel.buff.isEmpty()) {
        channel.state(_constants.ENDED);
        done(_constants.ENDED, idx);
      } else {
        return channel.buff.take(function (takeResult) {
          return done(takeResult, idx);
        }, options);
      }
    });
  } else {
    throw new Error('Unrecognized strategy "' + options.strategy + '"');
  }
  return function unsubscribe() {
    unsubscribers.filter(function (f) {
      return f;
    }).forEach(function (f) {
      return f();
    });
  };
}
function take(channels, options) {
  return { channels: channels, op: _constants.TAKE, options: options };
}

// **************************************************** read

function read(channels, options) {
  return { channels: channels, op: _constants.READ, options: _extends({}, options, { read: true }) };
}
function sread(channels, to, options) {
  return stake(channels, to, _extends({}, options, { read: true }));
}
function unreadAll(channel) {
  channel.buff.deleteReaders();
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
      return t.callback(newState);
    });
    _index.grid.remove(ch);
    ch.subscribers = [];
    _constants.CHANNELS.del(ch.id);
    if (__DEV__) _index.logger.log(ch, 'CHANNEL_CLOSED');
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
    if (__DEV__) _index.logger.log(ch, 'CHANNEL_RESET');
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
var isRoutine = exports.isRoutine = function isRoutine(r) {
  return r && r['@routine'] === true;
};
var isStateReadChannel = exports.isStateReadChannel = function isStateReadChannel(s) {
  return s && s['@statereadchannel'] === true;
};
var isStateWriteChannel = exports.isStateWriteChannel = function isStateWriteChannel(s) {
  return s && s['@statewritechannel'] === true;
};

// **************************************************** go/routine

function go(func) {
  for (var _len4 = arguments.length, args = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
    args[_key4 - 2] = arguments[_key4];
  }

  var done = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

  var RUNNING = 'RUNNING';
  var STOPPED = 'STOPPED';
  var state = RUNNING;
  var name = (0, _utils.getFuncName)(func);

  var api = {
    id: (0, _utils.getId)('routine_' + name),
    '@routine': true,
    name: name,
    children: [],
    stop: function stop() {
      state = STOPPED;
      this.children.forEach(function (r) {
        return r.stop();
      });
      _index.grid.remove(api);
      if (__DEV__) _index.logger.log(api, 'ROUTINE_STOPPED');
    },
    rerun: function rerun() {
      gen = func.apply(undefined, args);
      next();
      if (__DEV__) _index.logger.log(this, 'ROUTINE_RERUN');
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
        api.stop();
        break;
      case _constants.READ:
        sread(i.value.channels, next, i.value.options);
        break;
      case _constants.CALL_ROUTINE:
        addSubRoutine(go.apply(undefined, [i.value.routine, next].concat(_toConsumableArray(i.value.args))));
        break;
      case _constants.FORK_ROUTINE:
        addSubRoutine(go.apply(undefined, [i.value.routine, function () {}].concat(_toConsumableArray(i.value.args))));
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
      } else if (__DEV__) _index.logger.log(api, 'ROUTINE_END');
    } else if ((0, _utils.isPromise)(step.value)) {
      if (__DEV__) _index.logger.log(api, 'ROUTINE_ASYNC_BEGIN');
      step.value.then(function () {
        if (__DEV__) _index.logger.log(api, 'ROUTINE_ASYNC_END');
        next.apply(undefined, arguments);
      }).catch(function (err) {
        if (__DEV__) _index.logger.log(api, 'ROUTINE_ASYNC_ERROR', err);
        processGeneratorStep(gen.throw(err));
      });
    } else {
      processGeneratorStep(step);
    }
  }

  next();
  _index.grid.add(api);
  if (__DEV__) _index.logger.log(api, 'ROUTINE_STARTED');

  return api;
}
go['@go'] = true;
go.with = function () {
  for (var _len6 = arguments.length, maps = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    maps[_key6] = arguments[_key6];
  }

  var reducedMaps = maps.reduce(function (res, item) {
    if (typeof item === 'string') {
      res = _extends({}, res, _defineProperty({}, item, (0, _index.use)(item)));
    } else {
      res = _extends({}, res, item);
    }
    return res;
  }, {});
  return function (func) {
    for (var _len7 = arguments.length, args = Array(_len7 > 2 ? _len7 - 2 : 0), _key7 = 2; _key7 < _len7; _key7++) {
      args[_key7 - 2] = arguments[_key7];
    }

    var done = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

    args.push(reducedMaps);
    return go.apply(undefined, [func, done].concat(args));
  };
};

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