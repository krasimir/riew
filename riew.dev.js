(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Riew = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"./Interface":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = PersistingBuffer;

var _Interface = require('./Interface');

var _Interface2 = _interopRequireDefault(_Interface);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function PersistingBuffer() {
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
  api.put = function (item, callback) {
    if (api.takes.length === 0) {
      if (api.value.length < size) {
        api.value.push(item);
        callback(true);
      } else {
        api.puts.push(function (v) {
          api.value.push(item);
          if (api.takes.length > 0) {
            api.takes.shift()(api.value.shift());
          }
          callback(v || true);
        });
      }
    } else {
      api.value.push(item);
      api.takes.shift()(api.value.shift());
      callback(true);
    }
  };
  api.take = function (callback) {
    if (api.value.length === 0) {
      if (api.puts.length > 0) {
        api.puts.shift()();
        api.take(callback);
      } else {
        api.takes.push(callback);
      }
    } else {
      var v = api.value.shift();
      if (api.value.length < size && api.puts.length > 0) {
        api.puts.shift()();
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

var _EverBuffer = require('./EverBuffer');

var _EverBuffer2 = _interopRequireDefault(_EverBuffer);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var buffer = {
  fixed: _FixedBuffer2.default,
  dropping: _DroppingBuffer2.default,
  sliding: function sliding(size) {
    return (0, _DroppingBuffer2.default)(size, true);
  },
  ever: _EverBuffer2.default
};

exports.default = buffer;

},{"./DroppingBuffer":1,"./EverBuffer":2,"./FixedBuffer":3}],6:[function(require,module,exports){
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

exports.createChannel = createChannel;

var _utils = require('../utils');

var _constants = require('./constants');

var _index = require('../index');

var _buffer = require('./buffer');

var _buffer2 = _interopRequireDefault(_buffer);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
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
    return _index.CHANNELS.get(id);
  }

  var api = _index.CHANNELS.set(id, {
    id: id,
    '@channel': true,
    'subscribers': []
  });

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

},{"../index":17,"../utils":20,"./buffer":5,"./constants":7}],7:[function(require,module,exports){
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
var RERUN = exports.RERUN = 'RERUN';

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
exports.compose = compose;

var _index = require('../../index');

var _ops = require('../ops');

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }return arr2;
  } else {
    return Array.from(arr);
  }
}

var NOTHING = Symbol('Nothing');

function compose(to, channels) {
  var transform = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return args;
  };

  to = (0, _index.isChannel)(to) ? to : (0, _index.chan)(to, _index.buffer.ever());

  var data = channels.map(function () {
    return NOTHING;
  });
  var composedAtLeastOnce = false;
  channels.forEach(function (id, idx) {
    if ((0, _index.isState)(id)) {
      throw new Error('The second parameter of \'compose\' accepts an array of channels. You passed a state (at index ' + idx + ').');
    }
    if (!(0, _index.isChannel)(id) && !_index.CHANNELS.exists(id)) {
      throw new Error('Channel doesn\'t exists. ' + ch + ' passed to compose.');
    }
    var ch = (0, _index.isChannel)(id) ? id : (0, _index.chan)(id);
    var doComposition = function doComposition(value) {
      data[idx] = value;
      if (composedAtLeastOnce || data.length === 1 || !data.includes(NOTHING)) {
        composedAtLeastOnce = true;
        (0, _ops.sput)(to, transform.apply(undefined, _toConsumableArray(data)));
      }
    };
    (0, _index.sub)(ch, doComposition);
    if ((0, _index.isStateChannel)(ch)) {
      (0, _ops.stake)(ch, doComposition);
    }
  });
  return to;
}

},{"../../index":17,"../ops":14}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.merge = merge;

var _index = require('../../index');

function merge() {
  var newCh = (0, _index.chan)();

  for (var _len = arguments.length, channels = Array(_len), _key = 0; _key < _len; _key++) {
    channels[_key] = arguments[_key];
  }

  channels.forEach(function (ch) {
    (function taker() {
      (0, _index.stake)(ch, function (v) {
        if (v !== _index.CLOSED && v !== _index.ENDED && newCh.state() === _index.OPEN) {
          (0, _index.sput)(newCh, v, taker);
        }
      });
    })();
  });
  return newCh;
}

},{"../../index":17}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mult = mult;
exports.unmult = unmult;
exports.unmultAll = unmultAll;

var _index = require('../index');

function mult(ch, to) {
  if (!ch._taps) ch._taps = [];
  if (!ch._isMultTakerFired) {
    ch._isMultTakerFired = true;
    ch._taps = ch._taps.concat(to);
    (function taker() {
      (0, _index.stake)(ch, function (v) {
        if (v !== _index.CLOSED && v !== _index.ENDED) {
          var numOfSuccessfulPuts = 0;
          var putFinished = function putFinished(chWithSuccessfulPut) {
            numOfSuccessfulPuts += 1;
            if (numOfSuccessfulPuts >= ch._taps.length) {
              taker();
            }
          };
          ch._taps.forEach(function (tapCh, idx) {
            if (ch.state() === _index.OPEN) {
              (0, _index.sput)(tapCh, v, function () {
                return putFinished(tapCh);
              });
            } else {
              numOfSuccessfulPuts += 1;
              ch._taps.splice(idx, 1);
              putFinished();
            }
          });
        }
      });
    })();
  } else {
    to.forEach(function (toCh) {
      if (!ch._taps.find(function (c) {
        return toCh.id === c.id;
      })) {
        ch._taps.push(toCh);
      }
    });
  }
}

function unmult(source, ch) {
  source._taps = (source._taps || []).filter(function (c) {
    return c.id !== ch.id;
  });
}
function unmultAll(ch) {
  ch._taps = [];
}

},{"../index":13}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.state = state;
exports.isState = isState;
exports.isStateChannel = isStateChannel;

var _index = require('../../index');

var _utils = require('../../utils');

function state() {
  var value = arguments.length <= 0 ? undefined : arguments[0];
  var id = (0, _utils.getId)('state');
  var readChannels = [];
  var writeChannels = [];
  var isThereInitialValue = arguments.length > 0;

  function verifyChannel(id) {
    if (_index.CHANNELS.exists(id)) {
      throw new Error('Channel with name ' + id + ' already exists.');
    }
  }
  function handleError(onError) {
    return function (e) {
      if (onError !== null) {
        onError(e);
      } else {
        throw e;
      }
    };
  }
  function runSelector(_ref, v) {
    var ch = _ref.ch,
        selector = _ref.selector,
        onError = _ref.onError;

    var selectorValue = void 0;
    try {
      selectorValue = selector(v);
    } catch (e) {
      handleError(onError)(e);
    }
    (0, _index.sput)(ch, selectorValue);
  }
  function runWriter(_ref2, payload) {
    var ch = _ref2.ch,
        reducer = _ref2.reducer,
        onError = _ref2.onError;

    if ((0, _utils.isGeneratorFunction)(reducer)) {
      (0, _index.go)(reducer, function (v) {
        return readChannels.forEach(function (r) {
          return runSelector(r, v);
        });
      }, value, payload);
    } else {
      try {
        value = reducer(value, payload);
      } catch (e) {
        handleError(onError)(e);
      }
    }
    if ((0, _utils.isPromise)(value)) {
      value.then(function (v) {
        return readChannels.forEach(function (r) {
          return runSelector(r, v);
        });
      }).catch(handleError(onError));
    } else {
      readChannels.forEach(function (r) {
        return runSelector(r, value);
      });
    }
  }

  var api = {
    id: id,
    '@state': true,
    'READ': id + '_read',
    'WRITE': id + '_write',
    select: function select(id) {
      var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (v) {
        return v;
      };
      var onError = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      verifyChannel(id);
      var ch = (0, _index.chan)(id, _index.buffer.ever());
      ch['@statechannel'] = true;
      var reader = { ch: ch, selector: selector, onError: onError };
      readChannels.push(reader);
      if (isThereInitialValue) {
        runSelector(reader, value);
      }
    },
    mutate: function mutate(id) {
      var reducer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (_, v) {
        return v;
      };
      var onError = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      verifyChannel(id);
      var ch = (0, _index.chan)(id, _index.buffer.ever());
      ch['@statechannel'] = true;
      var writer = { ch: ch, reducer: reducer, onError: onError };
      writeChannels.push(writer);
      (0, _index.sub)(ch, function (payload) {
        return runWriter(writer, payload);
      });
    },
    destroy: function destroy() {
      readChannels.forEach(function (_ref3) {
        var ch = _ref3.ch;
        return (0, _index.sclose)(ch);
      });
      writeChannels.forEach(function (_ref4) {
        var ch = _ref4.ch;
        return (0, _index.sclose)(ch);
      });
      value = undefined;
      _index.grid.remove(api);
    },
    get: function get() {
      return value;
    },
    set: function set(newValue) {
      value = newValue;
      readChannels.forEach(function (r) {
        runSelector(r, value);
      });
    }
  };

  api.select(api.READ);
  api.mutate(api.WRITE);

  _index.grid.add(api);
  return api;
}

function isState(s) {
  return s && s['@state'] === true;
}
function isStateChannel(s) {
  return s && s['@statechannel'] === true;
}

},{"../../index":17,"../../utils":20}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timeout = timeout;

var _index = require('../../index');

function timeout(interval) {
  var ch = (0, _index.chan)();
  setTimeout(function () {
    return (0, _index.close)(ch);
  }, interval);
  return ch;
}

},{"../../index":17}],13:[function(require,module,exports){
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

var _merge = require('./ext/merge');

Object.keys(_merge).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _merge[key];
    }
  });
});

var _mult = require('./ext/mult');

Object.keys(_mult).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _mult[key];
    }
  });
});

var _timeout = require('./ext/timeout');

Object.keys(_timeout).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _timeout[key];
    }
  });
});

var _state = require('./ext/state');

Object.keys(_state).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _state[key];
    }
  });
});

var _compose = require('./ext/compose');

Object.keys(_compose).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _compose[key];
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

},{"./buffer":5,"./channel":6,"./constants":7,"./ext/compose":8,"./ext/merge":9,"./ext/mult":10,"./ext/state":11,"./ext/timeout":12,"./ops":14}],14:[function(require,module,exports){
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
  if (!ch.subscribers.find(function (c) {
    return c === callback;
  })) {
    ch.subscribers.push(callback);
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

},{"../index":17,"../utils":20,"./constants":7}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
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

var grid = Grid();

exports.default = grid;

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _riew = require('./riew');

var _riew2 = _interopRequireDefault(_riew);

var _react = require('./react');

var _react2 = _interopRequireDefault(_react);

var _grid = require('./grid');

var _grid2 = _interopRequireDefault(_grid);

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

var defineHarvesterBuiltInCapabilities = function defineHarvesterBuiltInCapabilities(h) {
  h.defineProduct('riew', function (viewFunc) {
    for (var _len2 = arguments.length, controllers = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      controllers[_key2 - 1] = arguments[_key2];
    }

    var riew = _riew2.default.apply(undefined, [viewFunc].concat(controllers));

    _grid2.default.add(riew);
    return riew;
  });
  h.defineProduct('reactRiew', function (viewFunc) {
    for (var _len3 = arguments.length, controllers = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      controllers[_key3 - 1] = arguments[_key3];
    }

    return _react2.default.apply(undefined, [viewFunc].concat(controllers));
  });
  h.defineProduct('channel', function () {
    var channel = _csp.createChannel.apply(undefined, arguments);

    _grid2.default.add(channel);
    return channel;
  });
};

var h = Harvester();

defineHarvesterBuiltInCapabilities(h);

exports.default = h;

},{"./csp":13,"./grid":15,"./react":18,"./riew":19}],17:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.grid = exports.harvester = exports.reset = exports.register = exports.use = exports.chan = exports.react = exports.riew = undefined;

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

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

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
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
var use = exports.use = function use(name) {
  for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    args[_key4 - 1] = arguments[_key4];
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
var reset = exports.reset = function reset() {
  return _grid2.default.reset(), _harvester2.default.reset(), _csp.CHANNELS.reset();
};
var harvester = exports.harvester = _harvester2.default;
var grid = exports.grid = _grid2.default;

},{"./csp":13,"./grid":15,"./harvester":16}],18:[function(require,module,exports){
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
}(); /* eslint-disable no-new-func */

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
  for (var _len = arguments.length, controllers = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    controllers[_key - 1] = arguments[_key];
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
        }].concat(controllers));

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
},{"../index":17,"../utils":20}],19:[function(require,module,exports){
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
}

var Renderer = function Renderer(viewFunc) {
  var data = {};
  var inProgress = false;
  var active = true;

  return {
    push: function push(newData) {
      if (newData === _index.chan.CLOSED || newData === _index.chan.ENDED) {
        return;
      }
      data = (0, _utils.accumulate)(data, newData);
      if (!inProgress) {
        inProgress = true;
        Promise.resolve().then(function () {
          if (active) {
            viewFunc(data);
          }
          inProgress = false;
        });
      }
    },
    destroy: function destroy() {
      active = false;
    }
  };
};

function createRiew(viewFunc) {
  for (var _len = arguments.length, routines = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    routines[_key - 1] = arguments[_key];
  }

  var name = (0, _utils.getFuncName)(viewFunc);
  var riew = { id: (0, _utils.getId)(name), name: name };
  var renderer = Renderer(viewFunc);
  var states = [];
  var cleanups = [];
  var runningRoutines = [];
  var externals = {};
  var subscriptions = {};
  var state = function state() {
    var s = _index.state.apply(undefined, arguments);
    states.push(s);
    return s;
  };
  var sub = function sub(to, func) {
    if (!(to in subscriptions)) {
      subscriptions[to] = true;
      (0, _index.sub)(to, func);
    }
  };
  var VIEW_CHANNEL = riew.id + '_view';
  var PROPS_CHANNEL = riew.id + '_props';

  var normalizeRenderData = function normalizeRenderData(value) {
    return Object.keys(value).reduce(function (obj, key) {
      if ((0, _index.isState)(value[key])) {
        sub(value[key].READ, function (v) {
          return (0, _index.sput)(VIEW_CHANNEL, _defineProperty({}, key, v));
        });
        (0, _index.stake)(value[key].READ, function (v) {
          return (0, _index.sput)(VIEW_CHANNEL, _defineProperty({}, key, v));
        });
      } else if (key.charAt(0) === '$') {
        var viewKey = key.substr(1, key.length);
        sub(value[key], function (v) {
          (0, _index.sput)(VIEW_CHANNEL, _defineProperty({}, viewKey, v));
        });
        (0, _index.stake)(value[key], function (v) {
          return (0, _index.sput)(VIEW_CHANNEL, _defineProperty({}, viewKey, v));
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
    sub(PROPS_CHANNEL, function (newProps) {
      return (0, _index.sput)(VIEW_CHANNEL, newProps);
    });
    sub(VIEW_CHANNEL, renderer.push);
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
    (0, _index.sput)(PROPS_CHANNEL, props);
  };

  riew.unmount = function () {
    cleanups.forEach(function (c) {
      return c();
    });
    cleanups = [];
    states.forEach(function (s) {
      return s.destroy();
    });
    states = [];
    runningRoutines.forEach(function (r) {
      return r.stop();
    });
    runningRoutines = [];
    renderer.destroy();
    (0, _index.close)(PROPS_CHANNEL);
    (0, _index.close)(VIEW_CHANNEL);
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
    maps = maps.reduce(function (map, item) {
      if (typeof item === 'string') {
        map = _extends({}, map, _defineProperty({}, item, (0, _index.use)(item)));
      } else {
        map = _extends({}, map, item);
      }
      return map;
    }, {});
    externals = _extends({}, externals, maps);
  };

  return riew;
}

},{"./index":17,"./utils":20}],20:[function(require,module,exports){
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
  return obj && typeof obj['then'] === 'function';
};
var isObjectLiteral = exports.isObjectLiteral = function isObjectLiteral(obj) {
  return obj ? obj.constructor === {}.constructor : false;
};
var isGenerator = exports.isGenerator = function isGenerator(obj) {
  return obj && typeof obj['next'] === 'function' && typeof obj['throw'] === 'function';
};
var isGeneratorFunction = exports.isGeneratorFunction = function isGeneratorFunction(obj) {
  var constructor = obj.constructor;
  if (!constructor) return false;
  if (constructor.name === 'GeneratorFunction' || constructor.displayName === 'GeneratorFunction') return true;
  return isGenerator(constructor.prototype);
};

},{}]},{},[17])(17)
});
