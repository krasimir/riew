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

},{"./Interface":3}],2:[function(require,module,exports){
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

},{"./Interface":3}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _FixedBuffer = require('./FixedBuffer');

var _FixedBuffer2 = _interopRequireDefault(_FixedBuffer);

var _DroppingBuffer = require('./DroppingBuffer');

var _DroppingBuffer2 = _interopRequireDefault(_DroppingBuffer);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var buffer = {
  fixed: _FixedBuffer2.default,
  dropping: _DroppingBuffer2.default,
  sliding: function sliding(size) {
    return (0, _DroppingBuffer2.default)(size, true);
  }
};

exports.default = buffer;

},{"./DroppingBuffer":1,"./FixedBuffer":2}],5:[function(require,module,exports){
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

exports.chan = chan;
exports.go = go;
exports.put = put;
exports.take = take;
exports.sleep = sleep;
exports.timeout = timeout;
exports.isChannel = isChannel;

var _utils = require('../utils');

var _constants = require('./constants');

var _index = require('../index');

var _buffer = require('./buffer');

var _buffer2 = _interopRequireDefault(_buffer);

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

  api.put = function (item, next) {
    var result = void 0;
    var callback = next;
    if (typeof next === 'undefined') {
      result = new Promise(function (resolve) {
        return callback = resolve;
      });
    }

    var state = api.state();
    if (state === chan.CLOSED || state === chan.ENDED) {
      callback(state);
    } else {
      api.buff.put(item, function (result) {
        return callback(result);
      });
    }

    return result;
  };

  api.take = function (next) {
    var result = void 0;
    var callback = next;
    if (typeof next === 'undefined') {
      result = new Promise(function (resolve) {
        return callback = resolve;
      });
    }

    var state = api.state();
    if (state === chan.ENDED) {
      callback(result = chan.ENDED);
    } else {
      // When we close a channel we do check if the buffer is empty.
      // If it is not then it is safe to take from it.
      // If it is empty the state here will be ENDED, not CLOSED.
      // So there is no way to reach this point with CLOSED state and an empty buffer.
      if (state === chan.CLOSED && api.buff.isEmpty()) {
        api.state(chan.ENDED);
        callback(result = chan.ENDED);
      } else {
        api.buff.take(function (r) {
          return callback(result = r);
        });
      }
    }

    return result;
  };

  api.close = function () {
    var newState = api.buff.isEmpty() ? _constants.ENDED : _constants.CLOSED;
    api.state(newState);
    api.buff.puts.forEach(function (put) {
      return put(newState);
    });
    api.buff.takes.forEach(function (take) {
      return take(newState);
    });
    _index.grid.remove(api);
  };

  api.reset = function () {
    api.state(_constants.OPEN);
    api.buff.reset();
  };

  api.merge = function () {
    for (var _len2 = arguments.length, channels = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      channels[_key2] = arguments[_key2];
    }

    var newCh = chan();

    [api].concat(channels).forEach(function (ch) {
      (function taker() {
        ch.take(function (v) {
          if (v !== _constants.CLOSED && v !== _constants.ENDED && newCh.state() === _constants.OPEN) {
            newCh.put(v, taker);
          }
        });
      })();
    });

    return newCh;
  };

  var isMultTakerFired = false;
  var taps = [];
  api.mult = function () {
    for (var _len3 = arguments.length, channels = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      channels[_key3] = arguments[_key3];
    }

    if (!isMultTakerFired) {
      isMultTakerFired = true;
      taps = taps.concat(channels);
      (function taker() {
        api.take(function (v) {
          if (v !== _constants.CLOSED && v !== _constants.ENDED) {
            var numOfSuccessfulPuts = 0;
            var putFinished = function putFinished(chWithSuccessfulPut) {
              numOfSuccessfulPuts += 1;
              if (numOfSuccessfulPuts >= taps.length) {
                taker();
              }
            };
            taps.forEach(function (ch, idx) {
              if (ch.state() === _constants.OPEN) {
                ch.put(v, function () {
                  return putFinished(ch);
                });
              } else {
                numOfSuccessfulPuts += 1;
                taps.splice(idx, 1);
                putFinished();
              }
            });
          }
        });
      })();
    } else {
      channels.forEach(function (ch) {
        if (!taps.find(function (c) {
          return ch.id === c.id;
        })) {
          taps.push(ch);
        }
      });
    }
  };

  api.unmult = function (ch) {
    taps = taps.filter(function (c) {
      return c.id !== ch.id;
    });
  };

  api.unmultAll = function (ch) {
    taps = [];
  };

  api.isActive = function () {
    return api.state() === _constants.OPEN;
  };

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
  (function next(value) {
    if (state === STOPPED) {
      return;
    }
    var i = gen.next(value);
    if (i.done === true) {
      if (done) done(i.value);
      return;
    }
    // pubsub topic
    if (typeof i.value.ch === 'string') {
      switch (i.value.op) {
        case _constants.PUT:
          (0, _index.pub)(i.value.ch, i.value.item, next);
          break;
        case _constants.TAKE:
          (0, _index.sub)(i.value.ch, next, true);
          break;
        default:
          throw new Error('Unrecognized operation ' + i.value.op + ' for a routine.');
      }
    } else {
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

},{"../index":12,"../utils":15,"./buffer":4,"./constants":6}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var OPEN = exports.OPEN = Symbol('OPEN');
var CLOSED = exports.CLOSED = Symbol('CLOSED');
var ENDED = exports.ENDED = Symbol('ENDED');
var PUT = exports.PUT = 'PUT';
var TAKE = exports.TAKE = 'TAKE';
var SLEEP = exports.SLEEP = 'SLEEP';

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.topicExists = exports.topic = exports.topics = exports.halt = exports.haltAll = exports.unsubAll = exports.unsub = exports.pub = exports.sub = undefined;

var _index = require('../index');

var PubSub = function PubSub() {
  var channels = {};
  var createTopic = function createTopic(topic, b, initialValue) {
    if (!channels[topic]) {
      channels[topic] = {
        ch: (0, _index.chan)(topic, b || _index.buffer.fixed()),
        subscribers: [],
        listen: false,
        initialValue: initialValue
      };
    }
    return channels[topic].ch;
  };
  var listen = function listen(topic) {
    if (channels[topic] && channels[topic].listen === false) {
      var bus = channels[topic];
      var ch = bus.ch;
      bus.listen = true;
      (function taker() {
        ch.take(function (value) {
          if (value !== _index.chan.CLOSED && value !== _index.chan.ENDED) {
            bus.subscribers = bus.subscribers.filter(function (_ref) {
              var callback = _ref.callback,
                  once = _ref.once;

              callback(value);
              return !once;
            });
            taker();
          }
        });
      })();
    }
  };

  var api = {
    subscribe: function subscribe(topic, callback) {
      var once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      createTopic(topic);
      if (!channels[topic].subscribers.find(function (_ref2) {
        var c = _ref2.callback;
        return c === callback;
      })) {
        channels[topic].subscribers.push({ callback: callback, once: once });
        if (typeof channels[topic].initialValue !== 'undefined') {
          callback(channels[topic].initialValue);
        }
      }
      listen(topic);
    },
    publish: function publish(topic, payload, callback) {
      createTopic(topic);
      channels[topic].ch.put(payload, callback);
    },
    unsubscribe: function unsubscribe(topic, callback) {
      if (channels[topic]) {
        channels[topic].subscribers = channels[topic].subscribers.filter(function (_ref3) {
          var c = _ref3.callback;
          return c !== callback;
        });
      }
    },
    haltAll: function haltAll() {
      Object.keys(channels).forEach(function (topic) {
        return channels[topic].ch.close();
      });
      channels = {};
    },
    halt: function halt(topic) {
      if (channels[topic]) {
        channels[topic].ch.close();
        delete channels[topic];
      }
    },
    getChannels: function getChannels() {
      return channels;
    },

    topic: createTopic,
    topicExists: function topicExists(topic) {
      return !!channels[topic];
    }
  };

  return api;
};
var ps = PubSub();

var sub = exports.sub = ps.subscribe;
var pub = exports.pub = ps.publish;
var unsub = exports.unsub = ps.unsubscribe;
var unsubAll = exports.unsubAll = ps.unsubscribeAll;
var haltAll = exports.haltAll = ps.haltAll;
var halt = exports.halt = ps.halt;
var topics = exports.topics = ps.getChannels;
var topic = exports.topic = ps.topic;
var topicExists = exports.topicExists = ps.topicExists;

},{"../index":9}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.state = state;
exports.isState = isState;

var _index = require('../index');

var _utils = require('../../utils');

function state() {
  var value = arguments.length <= 0 ? undefined : arguments[0];
  var id = (0, _utils.getId)('state');
  var readTopics = [];
  var writeTopics = [];
  var isThereInitialValue = arguments.length > 0;
  var api = {
    id: id,
    '@state': true,
    'READ': id + '_READ',
    'WRITE': id + '_WRITE',
    read: function read(topicName) {
      var func = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (v) {
        return v;
      };

      if ((0, _index.topicExists)(topicName)) {
        console.warn('Topic with name ' + topicName + ' already exists.');
        return false;
      }
      readTopics.push({ topicName: topicName, func: func });
      (0, _index.topic)(topicName, null, isThereInitialValue ? func(value) : undefined);
      return true;
    },
    write: function write(topicName) {
      var reducer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (_, v) {
        return v;
      };

      if ((0, _index.topicExists)(topicName)) {
        console.warn('Topic with name ' + topicName + ' already exists.');
        return false;
      }
      writeTopics.push({ topicName: topicName });
      (0, _index.sub)(topicName, function (payload) {
        value = reducer(value, payload);
        readTopics.forEach(function (r) {
          (0, _index.pub)(r.topicName, r.func(value));
        });
      });
      return true;
    },
    destroy: function destroy() {
      readTopics.forEach(function (_ref) {
        var topicName = _ref.topicName;
        return (0, _index.halt)(topicName);
      });
      writeTopics.forEach(function (_ref2) {
        var topicName = _ref2.topicName;
        return (0, _index.halt)(topicName);
      });
      value = undefined;
    },
    getValue: function getValue() {
      return value;
    }
  };

  api.read(api.READ);
  api.write(api.WRITE);

  return api;
}

function isState(s) {
  return s && s['@state'] === true;
}

},{"../../utils":15,"../index":9}],9:[function(require,module,exports){
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

var _pubsub = require('./ext/pubsub');

Object.keys(_pubsub).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _pubsub[key];
    }
  });
});

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

},{"./buffer":4,"./channel":5,"./ext/pubsub":7,"./ext/state":8}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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
};

var h = Harvester();

defineHarvesterBuiltInCapabilities(h);

exports.default = h;

},{"./grid":10,"./react":13,"./riew":14}],12:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.grid = exports.harvester = exports.reset = exports.register = exports.use = exports.react = exports.riew = undefined;

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
var use = exports.use = function use(name) {
  for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
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
  return _grid2.default.reset(), _harvester2.default.reset(), (0, _csp.haltAll)();
};
var harvester = exports.harvester = _harvester2.default;
var grid = exports.grid = _grid2.default;

},{"./csp":9,"./grid":10,"./harvester":11}],13:[function(require,module,exports){
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
},{"../index":12,"../utils":15}],14:[function(require,module,exports){
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
  var riew = {
    id: (0, _utils.getId)(name),
    name: name
  };
  var renderer = Renderer(viewFunc);
  var states = [];
  var cleanups = [];
  var runningRoutines = [];
  var externals = {};
  var state = function state() {
    var s = _index.state.apply(undefined, arguments);
    states.push(s);
    return s;
  };
  var VIEW_TOPIC = riew.id + '_view';
  var PROPS_TOPIC = riew.id + '_props';

  var normalizeRenderData = function normalizeRenderData(value) {
    return Object.keys(value).reduce(function (obj, key) {
      if ((0, _index.isState)(value[key])) {
        (0, _index.sub)(value[key].READ, function (v) {
          (0, _index.pub)(VIEW_TOPIC, _defineProperty({}, key, v));
        });
      } else if (key.charAt(0) === '$') {
        var viewKey = key.substr(1, key.length);
        (0, _index.sub)(value[key], function (v) {
          (0, _index.pub)(VIEW_TOPIC, _defineProperty({}, viewKey, v));
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
    (0, _index.sub)(PROPS_TOPIC, function (newProps) {
      return (0, _index.pub)(VIEW_TOPIC, newProps);
    });
    (0, _index.sub)(VIEW_TOPIC, renderer.push);
    runningRoutines = routines.map(function (r) {
      return (0, _index.go)(r, [_extends({
        render: function render(value) {
          (0, _utils.requireObject)(value);
          (0, _index.pub)(VIEW_TOPIC, normalizeRenderData(value));
        },
        state: state,
        props: PROPS_TOPIC
      }, externals)], function (result) {
        if (typeof result === 'function') {
          cleanups.push(result);
        }
      });
    });
    if (!(0, _utils.isObjectEmpty)(externals)) {
      (0, _index.pub)(VIEW_TOPIC, normalizeRenderData(externals));
    }
    (0, _index.pub)(PROPS_TOPIC, props);
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
    (0, _index.halt)(PROPS_TOPIC);
    (0, _index.halt)(VIEW_TOPIC);
  };

  riew.update = function () {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    (0, _utils.requireObject)(props);
    (0, _index.pub)(PROPS_TOPIC, props);
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

},{"./index":12,"./utils":15}],15:[function(require,module,exports){
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
exports.accumulate = accumulate;
var isPromise = exports.isPromise = function isPromise(obj) {
  return obj && typeof obj['then'] === 'function';
};
var isGenerator = exports.isGenerator = function isGenerator(obj) {
  return obj && typeof obj['next'] === 'function';
};
var isObjectLiteral = exports.isObjectLiteral = function isObjectLiteral(obj) {
  return obj ? obj.constructor === {}.constructor : false;
};
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

function accumulate(current, newData) {
  return _extends({}, current, newData);
}

},{}]},{},[12])(12)
});
