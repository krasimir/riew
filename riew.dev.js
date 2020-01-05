(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Riew = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = DivorcedBuffer;

var _Interface = require('./Interface');

var _Interface2 = _interopRequireDefault(_Interface);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function DivorcedBuffer() {
  var api = (0, _Interface2.default)();

  api.setValue = function (v) {
    return api.value = v;
  };
  api.put = function (item, callback) {
    api.value = [item];
    callback(true);
  };
  api.take = function (callback) {
    callback(api.value[0]);
  };

  return api;
}

},{"./Interface":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = DroppingBuffer;

var _Interface = require('./Interface');

var _Interface2 = _interopRequireDefault(_Interface);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function DroppingBuffer() {
  var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  var sliding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var api = (0, _Interface2.default)();

  api.setValue = function (v) {
    return api.value = v;
  };
  api.put = function (item, callback) {
    var r = true;
    if (api.value.length < size) {
      api.value.push(item);
    } else if (sliding) {
      api.value.shift();
      api.value.push(item);
    } else {
      r = false;
    }
    if (api.takes.length > 0) {
      api.takes.shift()(api.value.shift());
    }
    callback(r);
  };
  api.take = function (callback) {
    if (api.value.length === 0) {
      api.takes.push(callback);
    } else {
      callback(api.value.shift());
    }
  };

  return api;
}

},{"./Interface":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = FixedBuffer;

var _Interface = require('./Interface');

var _Interface2 = _interopRequireDefault(_Interface);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function FixedBuffer() {
  var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

  var api = (0, _Interface2.default)();

  api.setValue = function (v) {
    return api.value = v;
  };
  api.put = function (item, _callback) {
    if (api.takes.length === 0) {
      if (api.value.length < size) {
        api.value.push(item);
        _callback(true);
      } else {
        api.puts.push({
          callback: function callback(v) {
            api.value.push(item);
            if (api.takes.length > 0) {
              api.takes.shift()(api.value.shift());
            }
            _callback(v || true);
          },
          item: item
        });
      }
    } else {
      api.value.push(item);
      api.takes.shift()(api.value.shift());
      _callback(true);
    }
  };
  api.take = function (callback) {
    if (api.value.length === 0) {
      if (api.puts.length > 0) {
        api.puts.shift().callback();
        api.take(callback);
      } else {
        api.takes.push(callback);
      }
    } else {
      var v = api.value.shift();
      if (api.value.length < size && api.puts.length > 0) {
        api.puts.shift().callback();
      }
      callback(v);
    }
  };

  return api;
}

},{"./Interface":4}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = BufferInterface;
function BufferInterface() {
  return {
    value: [],
    puts: [],
    takes: [],
    isEmpty: function isEmpty() {
      return this.value.length === 0;
    },
    reset: function reset() {
      this.value = [];
      this.puts = [];
      this.takes = [];
    },
    setValue: function setValue(v) {
      this.value = v;
    },
    getValue: function getValue() {
      return this.value;
    }
  };
}

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _FixedBuffer = require('./FixedBuffer');

var _FixedBuffer2 = _interopRequireDefault(_FixedBuffer);

var _DroppingBuffer = require('./DroppingBuffer');

var _DroppingBuffer2 = _interopRequireDefault(_DroppingBuffer);

var _DivorcedBuffer = require('./DivorcedBuffer');

var _DivorcedBuffer2 = _interopRequireDefault(_DivorcedBuffer);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var buffer = {
  fixed: _FixedBuffer2.default,
  dropping: _DroppingBuffer2.default,
  sliding: function sliding(size) {
    return (0, _DroppingBuffer2.default)(size, true);
  },
  divorced: _DivorcedBuffer2.default
};

exports.default = buffer;

},{"./DivorcedBuffer":1,"./DroppingBuffer":2,"./FixedBuffer":3}],6:[function(require,module,exports){
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

exports.createChannel = createChannel;

var _utils = require('../utils');

var _constants = require('./constants');

var _index = require('../index');

var _buffer = require('./buffer');

var _buffer2 = _interopRequireDefault(_buffer);

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

function createChannel() {
  var state = _constants.OPEN;

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var _normalizeChannelArgu = normalizeChannelArguments(args),
      _normalizeChannelArgu2 = _slicedToArray(_normalizeChannelArgu, 2),
      id = _normalizeChannelArgu2[0],
      buff = _normalizeChannelArgu2[1];

  if (_index.CHANNELS.exists(id)) {
    return [_index.CHANNELS.get(id), true];
  }

  var api = _index.CHANNELS.set(id, {
    id: id,
    '@channel': true,
    subscribers: []
  });

  api.isActive = function () {
    return api.state() === _constants.OPEN;
  };
  api.buff = buff;
  api.state = function (s) {
    if (typeof s !== 'undefined') state = s;
    return state;
  };
  api.value = function () {
    return buff.getValue();
  };

  return [api, false];
}

},{"../index":14,"../utils":21,"./buffer":5,"./constants":7}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
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

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _buffer = require('./buffer');

Object.defineProperty(exports, 'buffer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_buffer).default;
  }
});

var _channel = require('./channel');

Object.keys(_channel).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _channel[key];
    }
  });
});

var _ops = require('./ops');

Object.keys(_ops).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _ops[key];
    }
  });
});

var _state = require('./state');

Object.keys(_state).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _state[key];
    }
  });
});

var _constants = require('./constants');

Object.keys(_constants).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _constants[key];
    }
  });
});

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

},{"./buffer":5,"./channel":6,"./constants":7,"./ops":9,"./state":10}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isStateWriteChannel = exports.isStateReadChannel = exports.isState = exports.isRiew = exports.isChannel = undefined;

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

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

},{"../index":14,"../utils":21,"./constants":7,"./utils":11}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createState = createState;

var _index = require('../index');

var _utils = require('../utils');

function createState() {
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
  function runSelector(_ref, v) {
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

      var ch = (0, _index.isChannel)(c) ? c : (0, _index.chan)(c, _index.buffer.divorced());
      ch['@statereadchannel'] = true;
      var reader = { ch: ch, selector: selector, onError: onError };
      readChannels.push(reader);
      if (isThereInitialValue) {
        runSelector(reader, value);
      }
      return this;
    },
    mutate: function mutate(c) {
      var reducer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (_, v) {
        return v;
      };
      var onError = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var ch = (0, _index.isChannel)(c) ? c : (0, _index.chan)(c, _index.buffer.divorced());
      ch['@statewritechannel'] = true;
      var writer = { ch: ch };
      writeChannels.push(writer);
      (0, _index.sread)(ch, function (v) {
        value = v;
        readChannels.forEach(function (r) {
          return runSelector(r, value);
        });
      }, {
        transform: /*#__PURE__*/regeneratorRuntime.mark(function transform(payload) {
          return regeneratorRuntime.wrap(function transform$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;

                  if (!(0, _utils.isGeneratorFunction)(reducer)) {
                    _context.next = 5;
                    break;
                  }

                  _context.next = 4;
                  return (0, _index.call)(reducer, value, payload);

                case 4:
                  return _context.abrupt('return', _context.sent);

                case 5:
                  return _context.abrupt('return', reducer(value, payload));

                case 8:
                  _context.prev = 8;
                  _context.t0 = _context['catch'](0);

                  handleError(onError)(_context.t0);

                case 11:
                case 'end':
                  return _context.stop();
              }
            }
          }, transform, this, [[0, 8]]);
        }),

        onError: handleError(onError),
        initialCall: true,
        listen: true
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
      return this;
    },
    get: function get() {
      return value;
    },
    set: function set(newValue) {
      value = newValue;
      readChannels.forEach(function (r) {
        runSelector(r, value);
      });
      return newValue;
    }
  };

  api.select(api.READ);
  api.mutate(api.WRITE);

  return api;
}

},{"../index":14,"../utils":21}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeChannels = normalizeChannels;
exports.normalizeTo = normalizeTo;
exports.normalizeOptions = normalizeOptions;

var _index = require('../index');

var _constants = require('./constants');

/* eslint-disable no-param-reassign, no-multi-assign */
function normalizeChannels(channels) {
  var stateOp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'READ';

  if (!Array.isArray(channels)) channels = [channels];
  return channels.map(function (ch) {
    if ((0, _index.isState)(ch)) ch = ch[stateOp];
    return (0, _index.isChannel)(ch) ? ch : (0, _index.chan)(ch);
  });
}

var DEFAULT_OPTIONS = {
  transform: null,
  onError: null,
  initialCall: true
};

function normalizeTo(to) {
  if (typeof to === 'function') {
    return to;
  }
  if ((0, _index.isChannel)(to)) {
    return to.__subFunc || (to.__subFunc = function (v) {
      return (0, _index.sput)(to, v);
    });
  }
  if (typeof to === 'string') {
    var ch = (0, _index.chan)(to, _index.buffer.divorced());
    return ch.__subFunc = function (v) {
      return (0, _index.sput)(to, v);
    };
  }
  throw new Error('\'read\' accepts string, channel or a function as a second argument. ' + to + ' given.');
}
function normalizeOptions(options) {
  options = options || DEFAULT_OPTIONS;
  var transform = options.transform || DEFAULT_OPTIONS.transform;
  var onError = options.onError || DEFAULT_OPTIONS.onError;
  var strategy = options.strategy || _constants.ALL_REQUIRED;
  var listen = 'listen' in options ? options.listen : false;
  var read = 'read' in options ? options.read : false;
  var initialCall = 'initialCall' in options ? options.initialCall : DEFAULT_OPTIONS.initialCall;

  return { transform: transform, onError: onError, strategy: strategy, initialCall: initialCall, listen: listen, read: read };
}

},{"../index":14,"./constants":7}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Grid;
function Grid(logger) {
  var gridAPI = {};
  var nodes = [];

  gridAPI.add = function (product) {
    if (!product || !product.id) {
      throw new Error("Each node in the grid must be an object with \"id\" field. Instead \"" + product + "\" given.");
    }
    nodes.push(product);
    logger.snapshot();
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
    logger.snapshot();
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

},{}],13:[function(require,module,exports){
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
}(); /* eslint-disable no-use-before-define */

var _riew = require('./riew');

var _riew2 = _interopRequireDefault(_riew);

var _react = require('./react');

var _react2 = _interopRequireDefault(_react);

var _index = require('./index');

var _csp = require('./csp');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function Harvester() {
  var api = {};
  var products = {};

  api.defineProduct = function (type, func) {
    if (products[type]) {
      throw new Error('A product with type "' + type + '" already exists.');
    }
    products[type] = func;
  };
  api.undefineProduct = function (type) {
    if (!products[type]) {
      throw new Error('There is no product with type "' + type + '" to be removed.');
    }
    delete products[type];
  };
  api.produce = function (type) {
    var _products;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (!products[type]) {
      throw new Error('There is no product with type "' + type + '".');
    }
    return (_products = products)[type].apply(_products, args);
  };
  api.reset = function () {
    products = {};
    defineHarvesterBuiltInCapabilities(api);
  };
  api.debug = function () {
    return {
      productNames: Object.keys(products)
    };
  };

  return api;
}

var defineHarvesterBuiltInCapabilities = function defineHarvesterBuiltInCapabilities(hInstance) {
  hInstance.defineProduct('riew', function (viewFunc) {
    for (var _len2 = arguments.length, controllers = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      controllers[_key2 - 1] = arguments[_key2];
    }

    var riew = _riew2.default.apply(undefined, [viewFunc].concat(controllers));

    _index.grid.add(riew);
    return riew;
  });
  hInstance.defineProduct('reactRiew', function (viewFunc) {
    for (var _len3 = arguments.length, controllers = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      controllers[_key3 - 1] = arguments[_key3];
    }

    return _react2.default.apply(undefined, [viewFunc].concat(controllers));
  });
  hInstance.defineProduct('channel', function () {
    var _createChannel = _csp.createChannel.apply(undefined, arguments),
        _createChannel2 = _slicedToArray(_createChannel, 2),
        channel = _createChannel2[0],
        exists = _createChannel2[1];

    if (!exists) {
      _index.grid.add(channel);
    }
    return channel;
  });
  hInstance.defineProduct('state', function () {
    var state = _csp.createState.apply(undefined, arguments);

    _index.grid.add(state);
    return state;
  });
  hInstance.defineProduct('routine', function () {
    var r = _csp.runRoutine.apply(undefined, arguments);

    _index.grid.add(r);
    return r;
  });
};

var h = Harvester();

defineHarvesterBuiltInCapabilities(h);

exports.default = h;

},{"./csp":8,"./index":14,"./react":16,"./riew":17}],14:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.harvester = exports.reset = exports.grid = exports.logger = exports.register = exports.use = exports.go = exports.state = exports.chan = exports.react = exports.riew = undefined;

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
}; /* eslint-disable no-param-reassign */

var _csp = require('./csp');

Object.keys(_csp).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _csp[key];
    }
  });
});

var _harvester = require('./harvester');

var _harvester2 = _interopRequireDefault(_harvester);

var _grid = require('./grid');

var _grid2 = _interopRequireDefault(_grid);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }return obj;
}

var riew = exports.riew = function riew() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return _harvester2.default.produce.apply(_harvester2.default, ['riew'].concat(args));
};
var react = exports.react = {
  riew: function riew() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _harvester2.default.produce.apply(_harvester2.default, ['reactRiew'].concat(args));
  }
};
var chan = exports.chan = function chan() {
  for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  return _harvester2.default.produce.apply(_harvester2.default, ['channel'].concat(args));
};
var state = exports.state = function state() {
  for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    args[_key4] = arguments[_key4];
  }

  return _harvester2.default.produce.apply(_harvester2.default, ['state'].concat(args));
};
var go = exports.go = function go() {
  for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    args[_key5] = arguments[_key5];
  }

  return _harvester2.default.produce.apply(_harvester2.default, ['routine'].concat(args));
};
var use = exports.use = function use(name) {
  for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
    args[_key6 - 1] = arguments[_key6];
  }

  return _harvester2.default.produce.apply(_harvester2.default, [name].concat(args));
};
var register = exports.register = function register(name, whatever) {
  if ((typeof whatever === 'undefined' ? 'undefined' : _typeof(whatever)) === 'object' || typeof whatever === 'function') {
    whatever.__registered = name;
  }
  _harvester2.default.defineProduct(name, function () {
    return whatever;
  });
  return whatever;
};
var logger = exports.logger = new _logger2.default();
var grid = exports.grid = new _grid2.default(logger);
var reset = exports.reset = function reset() {
  return grid.reset(), _harvester2.default.reset(), _csp.CHANNELS.reset(), logger.reset();
};
var harvester = exports.harvester = _harvester2.default;

go['@go'] = true;
go.with = function () {
  for (var _len7 = arguments.length, maps = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
    maps[_key7] = arguments[_key7];
  }

  var reducedMaps = maps.reduce(function (res, item) {
    if (typeof item === 'string') {
      res = _extends({}, res, _defineProperty({}, item, use(item)));
    } else {
      res = _extends({}, res, item);
    }
    return res;
  }, {});
  return function (func) {
    for (var _len8 = arguments.length, args = Array(_len8 > 2 ? _len8 - 2 : 0), _key8 = 2; _key8 < _len8; _key8++) {
      args[_key8 - 2] = arguments[_key8];
    }

    var done = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

    args.push(reducedMaps);
    return go.apply(undefined, [func, done].concat(args));
  };
};

},{"./csp":8,"./grid":12,"./harvester":13,"./logger":15}],15:[function(require,module,exports){
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

},{"./index":14,"./sanitize":18}],16:[function(require,module,exports){
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
        instance = _index.riew.apply(undefined, [function (props) {
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

    comp.displayName = 'Riew_' + (0, _utils.getFuncName)(View);
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
},{"../index":14,"../utils":21}],17:[function(require,module,exports){
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

exports.default = createRiew;

var _index = require('./index');

var _utils = require('./utils');

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }return obj;
} /* eslint-disable no-param-reassign */

var Renderer = function Renderer(viewFunc) {
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
            viewFunc(_data);
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

function createRiew(viewFunc) {
  for (var _len = arguments.length, routines = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    routines[_key - 1] = arguments[_key];
  }

  var name = (0, _utils.getFuncName)(viewFunc);
  var renderer = Renderer(viewFunc);
  var riew = {
    id: (0, _utils.getId)(name),
    name: name,
    '@riew': true,
    children: [],
    renderer: renderer
  };
  var cleanups = [];
  var runningRoutines = [];
  var externals = {};
  var subscriptions = {};
  var state = function state() {
    var s = _index.state.apply(undefined, arguments);
    riew.children.push(s);
    return s;
  };
  var subscribe = function subscribe(to, func) {
    if (!(to in subscriptions)) {
      subscriptions[to] = true;
      (0, _index.sread)(to, func, { listen: true });
    }
  };
  var VIEW_CHANNEL = riew.id + '_view';
  var PROPS_CHANNEL = riew.id + '_props';

  riew.children.push((0, _index.chan)(VIEW_CHANNEL, _index.buffer.divorced()));
  riew.children.push((0, _index.chan)(PROPS_CHANNEL, _index.buffer.divorced()));

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

  riew.mount = function () {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    (0, _utils.requireObject)(props);
    (0, _index.sput)(PROPS_CHANNEL, props);
    subscribe(PROPS_CHANNEL, function (newProps) {
      return (0, _index.sput)(VIEW_CHANNEL, newProps);
    });
    subscribe(VIEW_CHANNEL, renderer.push);
    runningRoutines = routines.map(function (r) {
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
    });
    if (!(0, _utils.isObjectEmpty)(externals)) {
      (0, _index.sput)(VIEW_CHANNEL, normalizeRenderData(externals));
    }
  };

  riew.unmount = function () {
    cleanups.forEach(function (c) {
      return c();
    });
    cleanups = [];
    riew.children.forEach(function (c) {
      if ((0, _index.isState)(c)) {
        c.destroy();
      }
    });
    riew.children = [];
    runningRoutines.forEach(function (r) {
      return r.stop();
    });
    runningRoutines = [];
    renderer.destroy();
    (0, _index.close)(PROPS_CHANNEL);
    (0, _index.close)(VIEW_CHANNEL);
    _index.grid.remove(riew);
  };

  riew.update = function () {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    (0, _utils.requireObject)(props);
    (0, _index.sput)(PROPS_CHANNEL, props);
  };

  riew.with = function () {
    for (var _len2 = arguments.length, maps = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      maps[_key2] = arguments[_key2];
    }

    riew.__setExternals(maps);
    return riew;
  };

  riew.test = function (map) {
    var newInstance = createRiew.apply(undefined, [viewFunc].concat(routines));

    newInstance.__setExternals([map]);
    return newInstance;
  };

  riew.__setExternals = function (maps) {
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

  return riew;
}

},{"./index":14,"./utils":21}],18:[function(require,module,exports){
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

},{"./vendors/CircularJSON":19,"./vendors/SerializeError":20}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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

},{}]},{},[14])(14)
});
