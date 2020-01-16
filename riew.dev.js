(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Riew = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('./utils');

var _index = require('../index');

/* eslint-disable no-param-reassign */
var DEFAULT_OPTIONS = { dropping: false, sliding: false, memory: false };
var NOOP = function NOOP(v, cb) {
  return cb();
};

function CSPBuffer() {
  var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_OPTIONS,
      dropping = _ref.dropping,
      sliding = _ref.sliding,
      memory = _ref.memory;

  var api = {
    value: [],
    puts: [],
    takes: [],
    hooks: {
      beforePut: [NOOP],
      afterPut: [NOOP],
      beforeTake: [NOOP],
      afterTake: [NOOP]
    },
    parent: null,
    dropping: dropping,
    sliding: sliding,
    memory: memory
  };

  function runHook(type, item, cb) {
    var hooks = api.hooks[type];
    var numOfHooksDone = 0;
    var hookDone = function hookDone() {
      numOfHooksDone += 1;
      if (numOfHooksDone === hooks.length) {
        cb();
      }
    };
    hooks.forEach(function (h) {
      return h(item, hookDone);
    });
  }

  api.beforePut = function (hook) {
    return api.hooks.beforePut.push(hook);
  };
  api.afterPut = function (hook) {
    return api.hooks.afterPut.push(hook);
  };
  api.beforeTake = function (hook) {
    return api.hooks.beforeTake.push(hook);
  };
  api.afterTake = function (hook) {
    return api.hooks.afterTake.push(hook);
  };
  api.isEmpty = function () {
    return api.value.length === 0;
  };
  api.reset = function () {
    api.value = [];
    api.puts = [];
    api.takes = [];
    api.hooks = {
      beforePut: [NOOP],
      afterPut: [NOOP],
      beforeTake: [NOOP],
      afterTake: [NOOP]
    };
  };
  api.setValue = function (v) {
    api.value = v;
  };
  api.getValue = function () {
    return api.value;
  };
  api.decomposeTakers = function () {
    return api.takes.reduce(function (res, takeObj) {
      res[takeObj.options.read ? 'readers' : 'takers'].push(takeObj);
      return res;
    }, {
      readers: [],
      takers: []
    });
  };
  api.consumeTake = function (takeObj, value) {
    if (!takeObj.options.listen) {
      var idx = api.takes.findIndex(function (t) {
        return t === takeObj;
      });
      if (idx >= 0) api.takes.splice(idx, 1);
    }
    takeObj.callback(value);
  };
  api.deleteReader = function (cb) {
    var idx = api.takes.findIndex(function (_ref2) {
      var callback = _ref2.callback;
      return callback === cb;
    });
    if (idx >= 0) {
      api.takes.splice(idx, 1);
    }
  };
  api.deleteReaders = function () {
    api.takes = api.takes.filter(function (_ref3) {
      var options = _ref3.options;
      return !options.read;
    });
  };

  api.setValue = function (v) {
    return api.value = v;
  };

  var put = function put(item, _callback) {
    var _api$decomposeTakers = api.decomposeTakers(),
        readers = _api$decomposeTakers.readers,
        takers = _api$decomposeTakers.takers;
    // console.log(
    //   `put=${item}`,
    //   `readers=${readers.length}`,
    //   `takers=${takers.length}`,
    //   `value=${api.value.length} size=${size}`
    // );

    // resolving readers


    readers.forEach(function (reader) {
      return api.consumeTake(reader, item);
    });

    // resolving takers
    if (memory) {
      api.value = [item];
      _callback(true);
      if (takers.length > 0) {
        api.consumeTake(takers[0], item);
      }
      return;
    }
    if (takers.length > 0) {
      api.consumeTake(takers[0], item);
      _callback(true);
    } else {
      if (api.value.length < size) {
        api.value.push(item);
        _callback(true);
        return;
      }
      if (dropping) {
        _callback(false);
        return;
      }
      if (sliding) {
        api.value.shift();
        api.value.push(item);
        _callback(true);
        return;
      }
      api.puts.push({
        callback: function callback(v) {
          api.value.push(item);
          _callback(v || true);
        },
        item: item
      });
    }
  };

  var take = function take(callback, options) {
    // console.log('take', `puts=${api.puts.length}`, `value=${api.value.length}`);
    options = (0, _utils.normalizeOptions)(options);
    if (api.value.length === 0) {
      if (api.puts.length > 0 && !options.read) {
        api.puts.shift().callback();
        callback(api.value.shift());
      } else {
        api.takes.push({ callback: callback, options: options });
        return function () {
          return api.deleteReader(callback);
        };
      }
    } else if (memory) {
      callback(api.value[0]);
      if (options.listen) {
        api.takes.push({ callback: callback, options: options });
        return function () {
          return api.deleteReader(callback);
        };
      }
    } else if (options.read) {
      callback(api.value[0]);
    } else {
      var v = api.value.shift();
      callback(v);
      if (api.value.length < size && api.puts.length > 0) {
        api.puts.shift().callback();
      }
    }
    return function () {};
  };

  api.put = function (item, callback) {
    _index.logger.log({ id: api.parent }, 'CHANNEL_PUT_INITIATED', item);
    runHook('beforePut', item, function () {
      put(item, function (putOpRes) {
        return runHook('afterPut', putOpRes, function () {
          _index.logger.log({ id: api.parent }, 'CHANNEL_PUT_RESOLVED', putOpRes);
          callback(putOpRes);
        });
      });
    });
  };
  api.take = function (callback, options) {
    var unsubscribe = function unsubscribe() {};
    _index.logger.log({ id: api.parent }, 'CHANNEL_TAKE_INITIATED');
    runHook('beforeTake', undefined, function () {
      return unsubscribe = take(function (takeOpRes) {
        return runHook('afterTake', takeOpRes, function () {
          _index.logger.log({ id: api.parent }, 'CHANNEL_TAKE_RESOLVED', takeOpRes);
          callback(takeOpRes);
        });
      }, options);
    });
    return function () {
      return unsubscribe();
    };
  };

  return api;
}

var buffer = {
  fixed: CSPBuffer,
  dropping: function dropping() {
    var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    if (size < 1) {
      throw new Error('The dropping buffer should have at least size of one.');
    }
    return CSPBuffer(size, { dropping: true });
  },
  sliding: function sliding() {
    var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    if (size < 1) {
      throw new Error('The sliding buffer should have at least size of one.');
    }
    return CSPBuffer(size, { sliding: true });
  },
  memory: function memory() {
    return CSPBuffer(0, { memory: true });
  }
};

exports.default = buffer;

},{"../index":7,"./utils":5}],2:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;_e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }return _arr;
  }return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

exports.default = chan;

var _utils = require('../utils');

var _index = require('../index');

var _buf = require('./buf');

var _buf2 = _interopRequireDefault(_buf);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function normalizeChannelArguments(args) {
  var id = void 0;
  var buff = void 0;
  if (args.length === 2) {
    id = args[0];
    buff = args[1];
  } else if (args.length === 1 && typeof args[0] === 'string') {
    id = args[0];
    buff = _buf2.default.fixed();
  } else if (args.length === 1 && _typeof(args[0]) === 'object') {
    id = (0, _utils.getId)('ch');
    buff = args[0];
  } else {
    id = (0, _utils.getId)('ch');
    buff = _buf2.default.fixed();
  }
  return [id, buff];
}

function chan() {
  var state = _index.OPEN;

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var _normalizeChannelArgu = normalizeChannelArguments(args),
      _normalizeChannelArgu2 = _slicedToArray(_normalizeChannelArgu, 2),
      id = _normalizeChannelArgu2[0],
      buff = _normalizeChannelArgu2[1];

  if (_index.CHANNELS.exists(id)) {
    return _index.CHANNELS.get(id);
  }

  var api = _index.CHANNELS.set(id, {
    id: id,
    '@channel': true,
    subscribers: []
  });

  buff.parent = api.id;

  api.isActive = function () {
    return api.state() === _index.OPEN;
  };
  api.buff = buff;
  api.state = function (s) {
    if (typeof s !== 'undefined') state = s;
    return state;
  };
  api.value = function () {
    return buff.getValue();
  };
  api.beforePut = buff.beforePut;
  api.afterPut = buff.afterPut;
  api.beforeTake = buff.beforeTake;
  api.afterTake = buff.afterTake;
  _index.grid.add(api);
  _index.logger.log(api, 'CHANNEL_CREATED');

  return api;
}

},{"../index":7,"../utils":15,"./buf":1}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

var _index = require('../index');

var _utils = require('../utils');

var _utils2 = require('./utils');

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }return obj;
}

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }return arr2;
  } else {
    return Array.from(arr);
  }
} /* eslint-disable no-use-before-define, no-param-reassign */

var noop = function noop() {};
var ops = {};

// **************************************************** put

ops.sput = function sput(channels) {
  var item = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop;

  channels = (0, _utils2.normalizeChannels)(channels, 'WRITE');
  var result = channels.map(function () {
    return _index.NOTHING;
  });
  var setResult = function setResult(idx, value) {
    result[idx] = value;
    if (!result.includes(_index.NOTHING)) {
      callback(result.length === 1 ? result[0] : result);
    }
  };
  channels.forEach(function (channel, idx) {
    var chState = channel.state();
    if (chState !== _index.OPEN) {
      setResult(idx, chState);
    } else {
      channel.buff.put(item, function (putResult) {
        return setResult(idx, putResult);
      });
    }
  });
};
ops.put = function put(channels, item) {
  return { channels: channels, op: _index.PUT, item: item };
};

// **************************************************** take

ops.stake = function stake(channels, callback, options) {
  channels = (0, _utils2.normalizeChannels)(channels);
  options = (0, _utils2.normalizeOptions)(options);
  callback = (0, _utils2.normalizeTo)(callback);
  var unsubscribers = void 0;
  if (options.strategy === _index.ALL_REQUIRED) {
    var result = channels.map(function () {
      return _index.NOTHING;
    });
    var setResult = function setResult(idx, value) {
      result[idx] = value;
      if (!result.includes(_index.NOTHING)) {
        callback(result.length === 1 ? result[0] : [].concat(_toConsumableArray(result)));
      }
    };
    unsubscribers = channels.map(function (channel, idx) {
      var chState = channel.state();
      if (chState === _index.ENDED) {
        setResult(idx, chState);
      } else if (chState === _index.CLOSED && channel.buff.isEmpty()) {
        channel.state(_index.ENDED);
        setResult(idx, _index.ENDED);
      } else {
        return channel.buff.take(function (takeResult) {
          return setResult(idx, takeResult);
        }, options);
      }
    });
  } else if (options.strategy === _index.ONE_OF) {
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
      if (chState === _index.ENDED) {
        done(chState, idx);
      } else if (chState === _index.CLOSED && channel.buff.isEmpty()) {
        channel.state(_index.ENDED);
        done(_index.ENDED, idx);
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
};
ops.take = function take(channels, options) {
  return { channels: channels, op: _index.TAKE, options: options };
};

// **************************************************** read

ops.read = function read(channels, options) {
  return { channels: channels, op: _index.READ, options: _extends({}, options, { read: true }) };
};
ops.sread = function sread(channels, to, options) {
  return ops.stake(channels, to, _extends({}, options, { read: true }));
};
ops.unreadAll = function unreadAll(channel) {
  channel.buff.deleteReaders();
};

// **************************************************** close, reset, call, fork, merge, timeout, isChannel

ops.close = function close(channels) {
  channels = (0, _utils2.normalizeChannels)(channels);
  channels.forEach(function (ch) {
    var newState = ch.buff.isEmpty() ? _index.ENDED : _index.CLOSED;
    ch.state(newState);
    ch.buff.puts.forEach(function (p) {
      return p.callback(newState);
    });
    ch.buff.takes.forEach(function (t) {
      return t.callback(newState);
    });
    _index.grid.remove(ch);
    ch.subscribers = [];
    _index.CHANNELS.del(ch.id);
    _index.logger.log(ch, 'CHANNEL_CLOSED');
  });
  return { op: _index.NOOP };
};
ops.sclose = function sclose(id) {
  return ops.close(id);
};
ops.channelReset = function channelReset(channels) {
  channels = (0, _utils2.normalizeChannels)(channels);
  channels.forEach(function (ch) {
    ch.state(_index.OPEN);
    ch.buff.reset();
    _index.logger.log(ch, 'CHANNEL_RESET');
  });
  return { op: _index.NOOP };
};
ops.schannelReset = function schannelReset(id) {
  ops.channelReset(id);
};
ops.call = function call(routine) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return { op: _index.CALL_ROUTINE, routine: routine, args: args };
};
ops.fork = function fork(routine) {
  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  return { op: _index.FORK_ROUTINE, routine: routine, args: args };
};
ops.merge = function merge() {
  var newCh = (0, _index.chan)();

  for (var _len3 = arguments.length, channels = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    channels[_key3] = arguments[_key3];
  }

  channels.forEach(function (ch) {
    (function taker() {
      ops.stake(ch, function (v) {
        if (v !== _index.CLOSED && v !== _index.ENDED && newCh.state() === _index.OPEN) {
          ops.sput(newCh, v, taker);
        }
      });
    })();
  });
  return newCh;
};
ops.timeout = function timeout(interval) {
  var ch = (0, _index.chan)();
  setTimeout(function () {
    return ops.close(ch);
  }, interval);
  return ch;
};
ops.isChannel = function (ch) {
  return ch && ch['@channel'] === true;
};
ops.isRiew = function (r) {
  return r && r['@riew'] === true;
};
ops.isState = function (s) {
  return s && s['@state'] === true;
};
ops.isRoutine = function (r) {
  return r && r['@routine'] === true;
};
ops.isStateReadChannel = function (s) {
  return s && s['@statereadchannel'] === true;
};
ops.isStateWriteChannel = function (s) {
  return s && s['@statewritechannel'] === true;
};

// **************************************************** go/routine

ops.go = function go(func) {
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
      _index.logger.log(api, 'ROUTINE_STOPPED');
    },
    rerun: function rerun() {
      gen = func.apply(undefined, args);
      next();
      _index.logger.log(this, 'ROUTINE_RERUN');
    }
  };
  var addSubRoutine = function addSubRoutine(r) {
    return api.children.push(r);
  };

  var gen = func.apply(undefined, args);

  function processGeneratorStep(i) {
    switch (i.value.op) {
      case _index.PUT:
        ops.sput(i.value.channels, i.value.item, next);
        break;
      case _index.TAKE:
        ops.stake(i.value.channels, function () {
          for (var _len5 = arguments.length, nextArgs = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
            nextArgs[_key5] = arguments[_key5];
          }

          next(nextArgs.length === 1 ? nextArgs[0] : nextArgs);
        }, i.value.options);
        break;
      case _index.NOOP:
        next();
        break;
      case _index.SLEEP:
        setTimeout(next, i.value.ms);
        break;
      case _index.STOP:
        api.stop();
        break;
      case _index.READ:
        ops.sread(i.value.channels, next, i.value.options);
        break;
      case _index.CALL_ROUTINE:
        addSubRoutine(ops.go.apply(ops, [i.value.routine, next].concat(_toConsumableArray(i.value.args))));
        break;
      case _index.FORK_ROUTINE:
        addSubRoutine(ops.go.apply(ops, [i.value.routine, function () {}].concat(_toConsumableArray(i.value.args))));
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
      } else {
        _index.grid.remove(api);
        _index.logger.log(api, 'ROUTINE_END');
      }
    } else if ((0, _utils.isPromise)(step.value)) {
      _index.logger.log(api, 'ROUTINE_ASYNC_BEGIN');
      step.value.then(function () {
        _index.logger.log(api, 'ROUTINE_ASYNC_END');
        next.apply(undefined, arguments);
      }).catch(function (err) {
        _index.logger.log(api, 'ROUTINE_ASYNC_ERROR', err);
        processGeneratorStep(gen.throw(err));
      });
    } else {
      processGeneratorStep(step);
    }
  }

  _index.grid.add(api);
  next();
  _index.logger.log(api, 'ROUTINE_STARTED');

  return api;
};
ops.go['@go'] = true;
ops.go.with = function () {
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
    return ops.go.apply(ops, [func, done].concat(args));
  };
};

ops.sleep = function sleep(ms, callback) {
  if (typeof callback === 'function') {
    setTimeout(callback, ms);
  } else {
    return { op: _index.SLEEP, ms: ms };
  }
};

ops.stop = function stop() {
  return { op: _index.STOP };
};

exports.default = ops;

},{"../index":7,"../utils":15,"./utils":5}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = state;

var _index = require('../index');

var _utils = require('../utils');

function state() {
  var value = arguments.length <= 0 ? undefined : arguments[0];
  var id = (0, _utils.getId)('state');
  var readChannels = [];
  var writeChannels = [];
  var isThereInitialValue = arguments.length > 0;
  var READ_CHANNEL = id + '_read';
  var WRITE_CHANNEL = id + '_write';

  function handleError(onError) {
    return function (e) {
      if (onError === null) {
        throw e;
      }
      onError(e);
    };
  }
  function runReader(_ref, v) {
    var ch = _ref.ch,
        selector = _ref.selector,
        onError = _ref.onError;

    try {
      if ((0, _utils.isGeneratorFunction)(selector)) {
        (0, _index.go)(selector, function (routineRes) {
          return (0, _index.sput)(ch, routineRes);
        }, value);
        return;
      }
      (0, _index.sput)(ch, selector(v));
    } catch (e) {
      handleError(onError)(e);
    }
  }

  var api = {
    id: id,
    '@state': true,
    children: function children() {
      return readChannels.map(function (_ref2) {
        var ch = _ref2.ch;
        return ch;
      }).concat(writeChannels.map(function (_ref3) {
        var ch = _ref3.ch;
        return ch;
      }));
    },

    READ: READ_CHANNEL,
    WRITE: WRITE_CHANNEL,
    select: function select(c) {
      var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (v) {
        return v;
      };
      var onError = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var ch = (0, _index.isChannel)(c) ? c : (0, _index.chan)(c, _index.buffer.memory());
      ch['@statereadchannel'] = true;
      var reader = { ch: ch, selector: selector, onError: onError };
      readChannels.push(reader);
      if (isThereInitialValue) {
        runReader(reader, value);
      }
      return this;
    },
    mutate: function mutate(c) {
      var reducer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (_, v) {
        return v;
      };
      var onError = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var ch = (0, _index.isChannel)(c) ? c : (0, _index.chan)(c, _index.buffer.memory());
      ch['@statewritechannel'] = true;
      var writer = { ch: ch };
      writeChannels.push(writer);
      ch.beforePut(function (payload, resolveBeforePutHook) {
        try {
          if ((0, _utils.isGeneratorFunction)(reducer)) {
            (0, _index.go)(reducer, function (genResult) {
              value = genResult;
              readChannels.forEach(function (r) {
                return runReader(r, value);
              });
              resolveBeforePutHook(value);
              _index.logger.log(api, 'STATE_VALUE_SET', value);
            }, value, payload);
            return;
          }
          value = reducer(value, payload);
          readChannels.forEach(function (r) {
            return runReader(r, value);
          });
          resolveBeforePutHook(value);
          _index.logger.log(api, 'STATE_VALUE_SET', value);
        } catch (e) {
          handleError(onError)(e);
        }
      });
      return this;
    },
    destroy: function destroy() {
      readChannels.forEach(function (_ref4) {
        var ch = _ref4.ch;
        return (0, _index.sclose)(ch);
      });
      writeChannels.forEach(function (_ref5) {
        var ch = _ref5.ch;
        return (0, _index.sclose)(ch);
      });
      value = undefined;
      _index.grid.remove(api);
      _index.logger.log(api, 'STATE_DESTROYED');
      return this;
    },
    get: function get() {
      return value;
    },
    set: function set(newValue) {
      value = newValue;
      readChannels.forEach(function (r) {
        runReader(r, value);
      });
      _index.logger.log(api, 'STATE_VALUE_SET', newValue);
      return newValue;
    }
  };

  api.select(api.READ);
  api.mutate(api.WRITE);

  _index.grid.add(api);
  _index.logger.log(api, 'STATE_CREATED');

  return api;
}

},{"../index":7,"../utils":15}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeChannels = normalizeChannels;
exports.normalizeTo = normalizeTo;
exports.normalizeOptions = normalizeOptions;

var _index = require('../index');

function normalizeChannels(channels) {
  var stateOp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'READ';

  if (!Array.isArray(channels)) channels = [channels];
  return channels.map(function (ch) {
    if ((0, _index.isState)(ch)) ch = ch[stateOp];
    return (0, _index.isChannel)(ch) ? ch : (0, _index.chan)(ch);
  });
} /* eslint-disable no-param-reassign, no-multi-assign */

var DEFAULT_OPTIONS = {
  onError: null,
  initialCall: true
};

function normalizeTo(to) {
  if (typeof to === 'function') {
    return to;
  }
  if ((0, _index.isChannel)(to)) {
    return function (v) {
      return (0, _index.sput)(to, v);
    };
  }
  if (typeof to === 'string') {
    var ch = (0, _index.chan)(to, _index.buffer.memory());
    return function (v) {
      return (0, _index.sput)(ch, v);
    };
  }
  throw new Error('\'read\' accepts string, channel or a function as a second argument. ' + to + ' given.');
}
function normalizeOptions(options) {
  options = options || DEFAULT_OPTIONS;
  var onError = options.onError || DEFAULT_OPTIONS.onError;
  var strategy = options.strategy || _index.ALL_REQUIRED;
  var listen = 'listen' in options ? options.listen : false;
  var read = 'read' in options ? options.read : false;
  var initialCall = 'initialCall' in options ? options.initialCall : DEFAULT_OPTIONS.initialCall;

  return {
    onError: onError,
    strategy: strategy,
    initialCall: initialCall,
    listen: listen,
    read: read,
    userTakeCallback: options.userTakeCallback
  };
}

},{"../index":7}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Grid;
function Grid() {
  var gridAPI = {};
  var nodes = [];

  gridAPI.add = function (product) {
    if (!product || !product.id) {
      throw new Error("Each node in the grid must be an object with \"id\" field. Instead \"" + product + "\" given.");
    }
    nodes.push(product);
  };
  gridAPI.remove = function (product) {
    var idx = nodes.findIndex(function (_ref) {
      var id = _ref.id;
      return id === product.id;
    });

    if (idx >= 0) {
      // splice because of https://krasimirtsonev.com/blog/article/foreach-or-not-to-foreach
      nodes.splice(idx, 1);
    }
  };
  gridAPI.reset = function () {
    nodes = [];
  };
  gridAPI.nodes = function () {
    return nodes;
  };
  gridAPI.getNodeById = function (nodeId) {
    return nodes.find(function (_ref2) {
      var id = _ref2.id;
      return id === nodeId;
    });
  };

  return gridAPI;
}

},{}],7:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stop = exports.sleep = exports.go = exports.isStateWriteChannel = exports.isStateReadChannel = exports.isRoutine = exports.isState = exports.isRiew = exports.isChannel = exports.timeout = exports.merge = exports.fork = exports.call = exports.schannelReset = exports.channelReset = exports.sclose = exports.close = exports.unreadAll = exports.sread = exports.read = exports.take = exports.stake = exports.put = exports.sput = exports.registry = exports.reset = exports.grid = exports.logger = exports.register = exports.use = exports.react = exports.state = exports.chan = exports.buffer = exports.CHANNELS = exports.ONE_OF = exports.ALL_REQUIRED = exports.NOTHING = exports.FORK_ROUTINE = exports.CALL_ROUTINE = exports.READ = exports.STOP = exports.SLEEP = exports.NOOP = exports.TAKE = exports.PUT = exports.ENDED = exports.CLOSED = exports.OPEN = undefined;

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

var _riew = require('./riew');

Object.keys(_riew).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _riew[key];
    }
  });
});

var _registry = require('./registry');

var _registry2 = _interopRequireDefault(_registry);

var _grid = require('./grid');

var _grid2 = _interopRequireDefault(_grid);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _utils = require('./utils');

var _react = require('./react');

var _react2 = _interopRequireDefault(_react);

var _buf = require('./csp/buf');

var _buf2 = _interopRequireDefault(_buf);

var _channel = require('./csp/channel');

var _channel2 = _interopRequireDefault(_channel);

var _ops = require('./csp/ops');

var _ops2 = _interopRequireDefault(_ops);

var _state = require('./csp/state');

var _state2 = _interopRequireDefault(_state);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var OPEN = exports.OPEN = Symbol('OPEN');
var CLOSED = exports.CLOSED = Symbol('CLOSED');
var ENDED = exports.ENDED = Symbol('ENDED');
var PUT = exports.PUT = 'PUT';
var TAKE = exports.TAKE = 'TAKE';
var NOOP = exports.NOOP = 'NOOP';
var SLEEP = exports.SLEEP = 'SLEEP';
var STOP = exports.STOP = 'STOP';
var READ = exports.READ = 'READ';
var CALL_ROUTINE = exports.CALL_ROUTINE = 'CALL_ROUTINE';
var FORK_ROUTINE = exports.FORK_ROUTINE = 'FORK_ROUTINE';
var NOTHING = exports.NOTHING = Symbol('NOTHING');
var ALL_REQUIRED = exports.ALL_REQUIRED = Symbol('ALL_REQUIRED');
var ONE_OF = exports.ONE_OF = Symbol('ONE_OF');

var CHANNELS = exports.CHANNELS = {
  channels: {},
  getAll: function getAll() {
    return this.channels;
  },
  get: function get(id) {
    return this.channels[id];
  },
  set: function set(id, ch) {
    this.channels[id] = ch;
    return ch;
  },
  del: function del(id) {
    delete this.channels[id];
  },
  exists: function exists(id) {
    return !!this.channels[id];
  },
  reset: function reset() {
    this.channels = {};
  }
};

var buffer = exports.buffer = _buf2.default;
var chan = exports.chan = _channel2.default;
var state = exports.state = _state2.default;

var react = exports.react = {
  riew: function riew() {
    return _react2.default.apply(undefined, arguments);
  }
};
var use = exports.use = function use(name) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return _registry2.default.produce.apply(_registry2.default, [name].concat(args));
};
var register = exports.register = function register(name, whatever) {
  if ((typeof whatever === 'undefined' ? 'undefined' : _typeof(whatever)) === 'object' || typeof whatever === 'function') {
    whatever.__registered = name;
  }
  _registry2.default.defineProduct(name, function () {
    return whatever;
  });
  return whatever;
};
var logger = exports.logger = new _logger2.default();
var grid = exports.grid = new _grid2.default();
var reset = exports.reset = function reset() {
  return (0, _utils.resetIds)(), grid.reset(), _registry2.default.reset(), CHANNELS.reset(), logger.reset();
};
var registry = exports.registry = _registry2.default;

var sput = exports.sput = _ops2.default.sput;
var put = exports.put = _ops2.default.put;
var stake = exports.stake = _ops2.default.stake;
var take = exports.take = _ops2.default.take;
var read = exports.read = _ops2.default.read;
var sread = exports.sread = _ops2.default.sread;
var unreadAll = exports.unreadAll = _ops2.default.unreadAll;
var close = exports.close = _ops2.default.close;
var sclose = exports.sclose = _ops2.default.sclose;
var channelReset = exports.channelReset = _ops2.default.channelReset;
var schannelReset = exports.schannelReset = _ops2.default.schannelReset;
var call = exports.call = _ops2.default.call;
var fork = exports.fork = _ops2.default.fork;
var merge = exports.merge = _ops2.default.merge;
var timeout = exports.timeout = _ops2.default.timeout;
var isChannel = exports.isChannel = _ops2.default.isChannel;
var isRiew = exports.isRiew = _ops2.default.isRiew;
var isState = exports.isState = _ops2.default.isState;
var isRoutine = exports.isRoutine = _ops2.default.isRoutine;
var isStateReadChannel = exports.isStateReadChannel = _ops2.default.isStateReadChannel;
var isStateWriteChannel = exports.isStateWriteChannel = _ops2.default.isStateWriteChannel;
var go = exports.go = _ops2.default.go;
var sleep = exports.sleep = _ops2.default.sleep;
var stop = exports.stop = _ops2.default.stop;

},{"./csp/buf":1,"./csp/channel":2,"./csp/ops":3,"./csp/state":4,"./grid":6,"./logger":8,"./react":9,"./registry":10,"./riew":11,"./utils":15}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Logger;

var _index = require('./index');

var _sanitize = require('./sanitize');

var _sanitize2 = _interopRequireDefault(_sanitize);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }return arr2;
  } else {
    return Array.from(arr);
  }
} /* eslint-disable no-use-before-define */

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
  if ((0, _index.isStateWriteChannel)(c)) {
    o.stateWrite = true;
  }
  if ((0, _index.isStateReadChannel)(c)) {
    o.stateRead = true;
  }
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

  api.log = function (who, what, meta) {
    if (!enabled) return null;
    data.push({
      who: who.id,
      what: what,
      meta: (0, _sanitize2.default)(meta)
    });
    if (!inProgress) {
      inProgress = true;
      Promise.resolve().then(function () {
        api.snapshot(data);
        inProgress = false;
        data = [];
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

},{"./index":7,"./sanitize":12}],9:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;_e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }return _arr;
  }return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}(); /* eslint-disable */

exports.default = riew;

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _utils = require('../utils');

var _index = require('../index');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }return arr2;
  } else {
    return Array.from(arr);
  }
}

function riew(View) {
  for (var _len = arguments.length, routines = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    routines[_key - 1] = arguments[_key];
  }

  var name = (0, _utils.getFuncName)(View);
  var createBridge = function createBridge() {
    var externals = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var comp = function comp(outerProps) {
      var _useState = (0, _react.useState)(null),
          _useState2 = _slicedToArray(_useState, 2),
          instance = _useState2[0],
          setInstance = _useState2[1];

      var _useState3 = (0, _react.useState)(null),
          _useState4 = _slicedToArray(_useState3, 2),
          content = _useState4[0],
          setContent = _useState4[1];

      var mounted = (0, _react.useRef)(true);

      // updating props
      (0, _react.useEffect)(function () {
        if (instance) {
          instance.update(outerProps);
        }
      }, [outerProps]);

      // mounting
      (0, _react.useEffect)(function () {
        instance = _index.namedRiew.apply(undefined, [name, function (props) {
          if (!mounted) return;
          if (props === null) {
            setContent(null);
          } else {
            setContent(props);
          }
        }].concat(routines));

        if (externals && externals.length > 0) {
          var _instance;

          instance = (_instance = instance).with.apply(_instance, _toConsumableArray(externals));
        }
        instance.name = name;

        setInstance(instance);
        instance.mount(outerProps);
        mounted.current = true;

        return function () {
          mounted.current = false;
          instance.unmount();
        };
      }, []);

      return content === null ? null : _react2.default.createElement(View, content);
    };

    comp.displayName = 'Riew_' + name;
    comp.with = function () {
      for (var _len2 = arguments.length, maps = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        maps[_key2] = arguments[_key2];
      }

      return createBridge(maps);
    };

    return comp;
  };

  return createBridge();
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../index":7,"../utils":15}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint-disable no-use-before-define */
function Harvester() {
  var api = {};
  var products = {};

  api.defineProduct = function (type, func) {
    if (products[type]) {
      throw new Error("A product with type \"" + type + "\" already exists.");
    }
    products[type] = func;
  };
  api.undefineProduct = function (type) {
    if (!products[type]) {
      throw new Error("There is no product with type \"" + type + "\" to be removed.");
    }
    delete products[type];
  };
  api.produce = function (type) {
    var _products;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (!products[type]) {
      throw new Error("There is no product with type \"" + type + "\".");
    }
    return (_products = products)[type].apply(_products, args);
  };
  api.reset = function () {
    products = {};
  };
  api.debug = function () {
    return {
      productNames: Object.keys(products)
    };
  };

  return api;
}

var h = Harvester();

exports.default = h;

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

exports.riew = riew;
exports.namedRiew = namedRiew;

var _index = require('./index');

var _utils = require('./utils');

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }return obj;
} /* eslint-disable no-param-reassign, no-use-before-define */

var Renderer = function Renderer(pushDataToView) {
  var _data = {};
  var inProgress = false;
  var active = true;

  return {
    push: function push(newData) {
      if (newData === _index.chan.CLOSED || newData === _index.chan.ENDED) {
        return;
      }
      _data = (0, _utils.accumulate)(_data, newData);
      if (!inProgress) {
        inProgress = true;
        Promise.resolve().then(function () {
          if (active) {
            pushDataToView(_data);
          }
          inProgress = false;
        });
      }
    },
    destroy: function destroy() {
      active = false;
    },
    data: function data() {
      return _data;
    }
  };
};
function riew(viewFunc) {
  var name = (0, _utils.getFuncName)(viewFunc);

  for (var _len = arguments.length, routines = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    routines[_key - 1] = arguments[_key];
  }

  return namedRiew.apply(undefined, [name, viewFunc].concat(routines));
}

function namedRiew(name, viewFunc) {
  for (var _len2 = arguments.length, routines = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    routines[_key2 - 2] = arguments[_key2];
  }

  var renderer = Renderer(function (value) {
    viewFunc(value);
    _index.logger.log(api, 'RIEW_RENDERED', value);
  });
  var api = {
    id: (0, _utils.getId)(name + '_riew'),
    name: name,
    '@riew': true,
    children: [],
    renderer: renderer
  };
  var cleanups = [];
  var externals = {};
  var subscriptions = {};
  var state = function state() {
    var s = _index.state.apply(undefined, arguments);
    api.children.push(s);
    return s;
  };
  var subscribe = function subscribe(to, func) {
    if (!(to in subscriptions)) {
      subscriptions[to] = true;
      (0, _index.sread)(to, func, { listen: true });
    }
  };
  var VIEW_CHANNEL = (0, _utils.getId)(name + '_view');
  var PROPS_CHANNEL = (0, _utils.getId)(name + '_props');

  api.children.push((0, _index.chan)(VIEW_CHANNEL, _index.buffer.memory()));
  api.children.push((0, _index.chan)(PROPS_CHANNEL, _index.buffer.memory()));

  var normalizeRenderData = function normalizeRenderData(value) {
    return Object.keys(value).reduce(function (obj, key) {
      if (_index.CHANNELS.exists(value[key]) || (0, _index.isChannel)(value[key])) {
        subscribe(value[key], function (v) {
          (0, _index.sput)(VIEW_CHANNEL, _defineProperty({}, key, v));
        });
        (0, _index.stake)(value[key], function (v) {
          return (0, _index.sput)(VIEW_CHANNEL, _defineProperty({}, key, v));
        });
      } else if ((0, _index.isState)(value[key])) {
        subscribe(value[key].READ, function (v) {
          return (0, _index.sput)(VIEW_CHANNEL, _defineProperty({}, key, v));
        });
        (0, _index.stake)(value[key].READ, function (v) {
          return (0, _index.sput)(VIEW_CHANNEL, _defineProperty({}, key, v));
        });
      } else {
        obj[key] = value[key];
      }
      return obj;
    }, {});
  };

  api.mount = function () {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    (0, _utils.requireObject)(props);
    (0, _index.sput)(PROPS_CHANNEL, props);
    subscribe(PROPS_CHANNEL, function (newProps) {
      return (0, _index.sput)(VIEW_CHANNEL, newProps);
    });
    subscribe(VIEW_CHANNEL, renderer.push);
    api.children = api.children.concat(routines.map(function (r) {
      return (0, _index.go)(r, function (result) {
        if (typeof result === 'function') {
          cleanups.push(result);
        }
      }, _extends({
        render: function render(value) {
          (0, _utils.requireObject)(value);
          (0, _index.sput)(VIEW_CHANNEL, normalizeRenderData(value));
        },
        state: state,
        props: PROPS_CHANNEL
      }, externals));
    }));
    if (!(0, _utils.isObjectEmpty)(externals)) {
      (0, _index.sput)(VIEW_CHANNEL, normalizeRenderData(externals));
    }
    _index.logger.log(api, 'RIEW_MOUNTED', props);
  };

  api.unmount = function () {
    cleanups.forEach(function (c) {
      return c();
    });
    cleanups = [];
    api.children.forEach(function (c) {
      if ((0, _index.isState)(c)) {
        c.destroy();
      } else if ((0, _index.isRoutine)(c)) {
        c.stop();
      }
    });
    api.children = [];
    renderer.destroy();
    (0, _index.close)(PROPS_CHANNEL);
    (0, _index.close)(VIEW_CHANNEL);
    _index.grid.remove(api);
    _index.logger.log(api, 'RIEW_UNMOUNTED');
  };

  api.update = function () {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    (0, _utils.requireObject)(props);
    (0, _index.sput)(PROPS_CHANNEL, props);
    _index.logger.log(api, 'RIEW_UPDATED', props);
  };

  api.with = function () {
    for (var _len3 = arguments.length, maps = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      maps[_key3] = arguments[_key3];
    }

    api.__setExternals(maps);
    return api;
  };

  api.test = function (map) {
    var newInstance = riew.apply(undefined, [viewFunc].concat(routines));

    newInstance.__setExternals([map]);
    return newInstance;
  };

  api.__setExternals = function (maps) {
    var reducedMaps = maps.reduce(function (res, item) {
      if (typeof item === 'string') {
        res = _extends({}, res, _defineProperty({}, item, (0, _index.use)(item)));
      } else {
        res = _extends({}, res, item);
      }
      return res;
    }, {});
    externals = _extends({}, externals, reducedMaps);
  };

  _index.grid.add(api);
  _index.logger.log(api, 'RIEW_CREATED');

  return api;
}

},{"./index":7,"./utils":15}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sanitize;

var _CircularJSON = require('./vendors/CircularJSON');

var _CircularJSON2 = _interopRequireDefault(_CircularJSON);

var _SerializeError = require('./vendors/SerializeError');

var _SerializeError2 = _interopRequireDefault(_SerializeError);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function sanitize(something) {
  var showErrorInConsole = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var result = void 0;

  try {
    result = JSON.parse(_CircularJSON2.default.stringify(something, function (key, value) {
      if (typeof value === 'function') {
        return value.name === '' ? '<anonymous>' : 'function ' + value.name + '()';
      }
      if (value instanceof Error) {
        return (0, _SerializeError2.default)(value);
      }
      return value;
    }, undefined, true));
  } catch (error) {
    if (showErrorInConsole) {
      console.log(error);
    }
    result = null;
  }
  return result;
}

},{"./vendors/CircularJSON":13,"./vendors/SerializeError":14}],13:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

/* eslint-disable */
/*!
Copyright (C) 2013-2017 by Andrea Giammarchi - @WebReflection

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
var
// should be a not so common char
// possibly one JSON does not encode
// possibly one encodeURIComponent does not encode
// right now this char is '~' but this might change in the future
specialChar = '~',
    safeSpecialChar = '\\x' + ('0' + specialChar.charCodeAt(0).toString(16)).slice(-2),
    escapedSafeSpecialChar = '\\' + safeSpecialChar,
    specialCharRG = new RegExp(safeSpecialChar, 'g'),
    safeSpecialCharRG = new RegExp(escapedSafeSpecialChar, 'g'),
    safeStartWithSpecialCharRG = new RegExp('(?:^|([^\\\\]))' + escapedSafeSpecialChar),
    indexOf = [].indexOf || function (v) {
  for (var i = this.length; i-- && this[i] !== v;) {}
  return i;
},
    $String = String // there's no way to drop warnings in JSHint
// about new String ... well, I need that here!
// faked, and happy linter!
;

function generateReplacer(value, replacer, resolve) {
  var inspect = !!replacer,
      path = [],
      all = [value],
      seen = [value],
      mapp = [resolve ? specialChar : '<circular>'],
      last = value,
      lvl = 1,
      i,
      fn;
  if (inspect) {
    fn = (typeof replacer === 'undefined' ? 'undefined' : _typeof(replacer)) === 'object' ? function (key, value) {
      return key !== '' && replacer.indexOf(key) < 0 ? void 0 : value;
    } : replacer;
  }
  return function (key, value) {
    // the replacer has rights to decide
    // if a new object should be returned
    // or if there's some key to drop
    // let's call it here rather than "too late"
    if (inspect) value = fn.call(this, key, value);

    // did you know ? Safari passes keys as integers for arrays
    // which means if (key) when key === 0 won't pass the check
    if (key !== '') {
      if (last !== this) {
        i = lvl - indexOf.call(all, this) - 1;
        lvl -= i;
        all.splice(lvl, all.length);
        path.splice(lvl - 1, path.length);
        last = this;
      }
      // console.log(lvl, key, path);
      if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value) {
        // if object isn't referring to parent object, add to the
        // object path stack. Otherwise it is already there.
        if (indexOf.call(all, value) < 0) {
          all.push(last = value);
        }
        lvl = all.length;
        i = indexOf.call(seen, value);
        if (i < 0) {
          i = seen.push(value) - 1;
          if (resolve) {
            // key cannot contain specialChar but could be not a string
            path.push(('' + key).replace(specialCharRG, safeSpecialChar));
            mapp[i] = specialChar + path.join(specialChar);
          } else {
            mapp[i] = mapp[0];
          }
        } else {
          value = mapp[i];
        }
      } else {
        if (typeof value === 'string' && resolve) {
          // ensure no special char involved on deserialization
          // in this case only first char is important
          // no need to replace all value (better performance)
          value = value.replace(safeSpecialChar, escapedSafeSpecialChar).replace(specialChar, safeSpecialChar);
        }
      }
    }
    return value;
  };
}

function retrieveFromPath(current, keys) {
  for (var i = 0, length = keys.length; i < length; current = current[
  // keys should be normalized back here
  keys[i++].replace(safeSpecialCharRG, specialChar)]) {}
  return current;
}

function generateReviver(reviver) {
  return function (key, value) {
    var isString = typeof value === 'string';
    if (isString && value.charAt(0) === specialChar) {
      return new $String(value.slice(1));
    }
    if (key === '') value = regenerate(value, value, {});
    // again, only one needed, do not use the RegExp for this replacement
    // only keys need the RegExp
    if (isString) value = value.replace(safeStartWithSpecialCharRG, '$1' + specialChar).replace(escapedSafeSpecialChar, safeSpecialChar);
    return reviver ? reviver.call(this, key, value) : value;
  };
}

function regenerateArray(root, current, retrieve) {
  for (var i = 0, length = current.length; i < length; i++) {
    current[i] = regenerate(root, current[i], retrieve);
  }
  return current;
}

function regenerateObject(root, current, retrieve) {
  for (var key in current) {
    if (current.hasOwnProperty(key)) {
      current[key] = regenerate(root, current[key], retrieve);
    }
  }
  return current;
}

function regenerate(root, current, retrieve) {
  return current instanceof Array ?
  // fast Array reconstruction
  regenerateArray(root, current, retrieve) : current instanceof $String ?
  // root is an empty string
  current.length ? retrieve.hasOwnProperty(current) ? retrieve[current] : retrieve[current] = retrieveFromPath(root, current.split(specialChar)) : root : current instanceof Object ?
  // dedicated Object parser
  regenerateObject(root, current, retrieve) :
  // value as it is
  current;
}

function stringifyRecursion(value, replacer, space, doNotResolve) {
  return JSON.stringify(value, generateReplacer(value, replacer, !doNotResolve), space);
}

function parseRecursion(text, reviver) {
  return JSON.parse(text, generateReviver(reviver));
}

exports.default = {
  stringify: stringifyRecursion,
  parse: parseRecursion
};

},{}],14:[function(require,module,exports){
/* eslint-disable */
// Credits: https://github.com/sindresorhus/serialize-error

'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
	return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
	return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

module.exports = function (value) {
	if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
		return destroyCircular(value, []);
	}

	// People sometimes throw things besides Error objects, so…

	if (typeof value === 'function') {
		// JSON.stringify discards functions. We do too, unless a function is thrown directly.
		return '[Function: ' + (value.name || 'anonymous') + ']';
	}

	return value;
};

// https://www.npmjs.com/package/destroy-circular
function destroyCircular(from, seen) {
	var to = Array.isArray(from) ? [] : {};

	seen.push(from);

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = Object.keys(from)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var key = _step.value;

			var value = from[key];

			if (typeof value === 'function') {
				continue;
			}

			if (!value || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
				to[key] = value;
				continue;
			}

			if (seen.indexOf(from[key]) === -1) {
				to[key] = destroyCircular(from[key], seen.slice(0));
				continue;
			}

			to[key] = '[Circular]';
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	if (typeof from.name === 'string') {
		to.name = from.name;
	}

	if (typeof from.message === 'string') {
		to.message = from.message;
	}

	if (typeof from.stack === 'string') {
		to.stack = from.stack;
	}

	return to;
}

},{}],15:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

exports.isObjectEmpty = isObjectEmpty;
exports.requireObject = requireObject;
exports.resetIds = resetIds;
var getFuncName = exports.getFuncName = function getFuncName(func) {
  if (func.name) return func.name;
  var result = /^function\s+([\w\$]+)\s*\(/.exec(func.toString());

  return result ? result[1] : 'unknown';
};

var ids = 0;

var getId = exports.getId = function getId(prefix) {
  return prefix + '_' + ++ids;
};

function isObjectEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }
  return true;
}
function requireObject(obj) {
  if (typeof obj === 'undefined' || obj === null || typeof obj !== 'undefined' && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
    throw new Error('A key-value object expected. Instead "' + obj + '" passed.');
  }
}
var accumulate = exports.accumulate = function accumulate(current, newData) {
  return _extends({}, current, newData);
};
var isPromise = exports.isPromise = function isPromise(obj) {
  return obj && typeof obj.then === 'function';
};
var isObjectLiteral = exports.isObjectLiteral = function isObjectLiteral(obj) {
  return obj ? obj.constructor === {}.constructor : false;
};
var isGenerator = exports.isGenerator = function isGenerator(obj) {
  return obj && typeof obj.next === 'function' && typeof obj.throw === 'function';
};
var isGeneratorFunction = exports.isGeneratorFunction = function isGeneratorFunction(fn) {
  var constructor = fn.constructor;

  if (!constructor) return false;
  if (constructor.name === 'GeneratorFunction' || constructor.displayName === 'GeneratorFunction') {
    return true;
  }
  return isGenerator(constructor.prototype);
};
function resetIds() {
  ids = 0;
}

},{}]},{},[7])(7)
});
