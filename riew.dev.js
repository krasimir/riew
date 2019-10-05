(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Riew = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var STATE_VALUE_CHANGE = exports.STATE_VALUE_CHANGE = 'STATE_VALUE_CHANGE';
var CANCEL_EFFECT = exports.CANCEL_EFFECT = 'CANCEL_EFFECT';

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('./utils');

function Subscription(name, callback) {
  return {
    name: name || (0, _utils.getId)('sub'),
    callback: callback
  };
}

function Grid() {
  var api = {};
  var nodes = [];
  var s11s = {};

  function getSourceSubscriptions(source, type) {
    if (!s11s[source.id]) s11s[source.id] = {};
    if (!s11s[source.id][type]) s11s[source.id][type] = [];
    return s11s[source.id][type];
  }
  function unsubscribe(source, type, subscriptionName) {
    if (!s11s[source.id] || !s11s[source.id][type]) {
      return;
    }
    s11s[source.id][type] = s11s[source.id][type].filter(function (_ref) {
      var name = _ref.name;
      return name !== subscriptionName;
    });
  }
  function off(source) {
    s11s[source.id] = {};
  }

  api.add = function (product) {
    if (!product || !product.id) {
      throw new Error('Each node in the grid must be an object with "id" field. Instead "' + product + '" given.');
    }
    nodes.push(product);
  };;
  api.remove = function (product) {
    nodes = nodes.filter(function (_ref2) {
      var id = _ref2.id;
      return id !== product.id;
    });
  };;
  api.reset = function () {
    nodes = [];
    s11s = {};
  };
  api.nodes = function () {
    return nodes;
  };
  api.getNodeById = function (nodeId) {
    return nodes.find(function (_ref3) {
      var id = _ref3.id;
      return id === nodeId;
    });
  };
  api.subscribe = function (source, type, callback, subscriptionName) {
    var ss = getSourceSubscriptions(source, type);
    var subscription = ss.find(function (s) {
      return s.name === subscriptionName || s.callback === callback;
    });

    if (!subscription) {
      ss.push(subscription = Subscription(subscriptionName, callback));
    }
    return function () {
      return unsubscribe(source, type, subscription.name);
    };
  };
  api.emit = function (source, type) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    getSourceSubscriptions(source, type).forEach(function (s) {
      return s.callback.apply(s, args);
    });
  };
  api.off = off;
  api.unsubscribe = unsubscribe;

  return api;
}

var grid = Grid();

exports.default = grid;

},{"./utils":15}],3:[function(require,module,exports){
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

var _fastDeepEqual = require('fast-deep-equal');

var _fastDeepEqual2 = _interopRequireDefault(_fastDeepEqual);

var _state = require('./state');

var _riew = require('./riew');

var _riew2 = _interopRequireDefault(_riew);

var _react = require('./react');

var _react2 = _interopRequireDefault(_react);

var _grid = require('./grid');

var _grid2 = _interopRequireDefault(_grid);

var _constants = require('./constants');

var _index = require('./index');

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

  return api;
};

var defineHarvesterBuiltInCapabilities = function defineHarvesterBuiltInCapabilities(h) {

  // ------------------------------------------------------------------ state
  h.defineProduct('state', function (initialValue) {
    var state = (0, _state.State)(initialValue);

    _grid2.default.add(state);
    return h.produce('effect', state);
  });

  // ------------------------------------------------------------------ effect
  h.defineProduct('effect', function (state) {
    var items = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var effect = state.createEffect(items);

    _grid2.default.add(effect);
    return effect;
  });

  // ------------------------------------------------------------------ mergeStates
  h.defineProduct('mergeStates', function (statesMap) {
    var fetchSourceValues = function fetchSourceValues() {
      return Object.keys(statesMap).reduce(function (result, key) {
        var _statesMap$key = _slicedToArray(statesMap[key], 1),
            s = _statesMap$key[0];

        result[key] = s();
        return result;
      }, {});
    };
    var effect = h.produce('state');
    var sInstance = _grid2.default.getNodeById(effect.stateId);

    sInstance.get = fetchSourceValues;
    sInstance.set = function (newValue) {
      if ((typeof newValue === 'undefined' ? 'undefined' : _typeof(newValue)) !== 'object') {
        throw new Error('Wrong merged state value. Must be key-value pairs.');
      }
      Object.keys(newValue).forEach(function (key) {
        if (!statesMap[key]) {
          throw new Error('There is no state with key "' + key + '".');
        }

        var _statesMap$key2 = _slicedToArray(statesMap[key], 2),
            setChildState = _statesMap$key2[1];

        setChildState(newValue[key]);
      }, {});
    };

    Object.keys(statesMap).forEach(function (key) {
      (0, _index.subscribe)(statesMap[key].pipe(function () {
        sInstance.emit(_constants.STATE_VALUE_CHANGE, fetchSourceValues());
      }));
    });

    return effect;
  });

  // ------------------------------------------------------------------ riew
  h.defineProduct('riew', function (viewFunc) {
    for (var _len2 = arguments.length, controllers = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      controllers[_key2 - 1] = arguments[_key2];
    }

    var riew = _riew2.default.apply(undefined, [viewFunc].concat(controllers));

    _grid2.default.add(riew);
    return riew;
  });

  // ------------------------------------------------------------------ reactRiew
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

},{"./constants":1,"./grid":2,"./index":4,"./react":12,"./riew":13,"./state":14,"fast-deep-equal":16}],4:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.grid = exports.harvester = exports.parallel = exports.serial = exports.compose = exports._fork = exports.test = exports.destroy = exports.unsubscribe = exports.subscribe = exports.cancel = exports.reset = exports.register = exports.use = exports.react = exports.riew = exports.merge = exports.state = undefined;

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

var _utils = require('./utils');

Object.defineProperty(exports, 'compose', {
  enumerable: true,
  get: function get() {
    return _utils.compose;
  }
});
Object.defineProperty(exports, 'serial', {
  enumerable: true,
  get: function get() {
    return _utils.serial;
  }
});
Object.defineProperty(exports, 'parallel', {
  enumerable: true,
  get: function get() {
    return _utils.parallel;
  }
});

var _harvester = require('./harvester');

var _harvester2 = _interopRequireDefault(_harvester);

var _grid = require('./grid');

var _grid2 = _interopRequireDefault(_grid);

var _constants = require('./constants');

var _state = require('./state');

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

var state = exports.state = function state(initialValue) {
  return _harvester2.default.produce('state', initialValue);
};
var merge = exports.merge = function merge(statesMap) {
  return _harvester2.default.produce('mergeStates', statesMap);
};
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
  return _harvester2.default.defineProduct(name, function () {
    return whatever;
  });
};
var reset = exports.reset = function reset() {
  return _grid2.default.reset(), _harvester2.default.reset();
};
var cancel = exports.cancel = function cancel(effect) {
  return effect.emit(_constants.CANCEL_EFFECT);
};
var subscribe = exports.subscribe = function subscribe(effect, initialCall) {
  if (effect.isMutating()) {
    throw new Error('You should not subscribe an effect that mutates the state. This will lead to endless recursion.');
  }
  if (!(0, _state.isEffect)(effect)) {
    throw new Error('You must pass an effect to the subscribe function.');
  }

  if (initialCall) effect();
  var state = grid.getNodeById(effect.stateId);

  return grid.subscribe(state, _constants.STATE_VALUE_CHANGE, function () {
    return effect();
  }, state.id + '_' + effect.id);
};
var unsubscribe = exports.unsubscribe = function unsubscribe(effect) {
  var state = grid.getNodeById(effect.stateId);

  return grid.unsubscribe(state, _constants.STATE_VALUE_CHANGE, state.id + '_' + effect.id);
};
var destroy = exports.destroy = function destroy(effect) {
  grid.nodes().filter(function (node) {
    return node.id === effect.stateId || node.stateId === effect.stateId;
  }).forEach(function (node) {
    node.destroy();
    grid.remove(node);
    if ('__registered' in node) {
      // in case of exported effect
      _harvester2.default.undefineProduct(node.__registered);
    }
  });
};
var test = exports.test = function test(effect, callback) {
  var state = grid.getNodeById(effect.stateId);
  var test = _fork(state, effect);
  var tools = {
    setValue: function setValue(newValue) {
      test.items = [{ type: 'map', func: [function () {
          return newValue;
        }] }].concat(_toConsumableArray(test.items));
    },
    swap: function swap(index, funcs, type) {
      if (!Array.isArray(funcs)) funcs = [funcs];
      test.items[index].func = funcs;
      if (type) {
        test.items[index].type = type;
      }
    },
    swapFirst: function swapFirst(funcs, type) {
      tools.swap(0, funcs, type);
    },
    swapLast: function swapLast(funcs, type) {
      tools.swap(test.items.length - 1, funcs, type);
    }
  };

  callback(tools);
  return test;
};
var _fork = exports._fork = function _fork(state, effect, newItem) {
  var newItems = [].concat(_toConsumableArray(effect.items));

  if (newItem) {
    newItems.push(newItem);
  }
  return _harvester2.default.produce('effect', state, newItems);
};

var harvester = exports.harvester = _harvester2.default;
var grid = exports.grid = _grid2.default;

},{"./constants":1,"./grid":2,"./harvester":3,"./state":14,"./utils":15}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.implementObservableInterface = implementObservableInterface;
exports.implementLoggableInterface = implementLoggableInterface;
exports.implementIterableProtocol = implementIterableProtocol;

var _grid = require('./grid');

var _grid2 = _interopRequireDefault(_grid);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function implementObservableInterface(obj) {
  obj.on = function (type, callback) {
    return _grid2.default.subscribe(obj, type, callback);
  };
  obj.emit = function (type) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return _grid2.default.emit.apply(_grid2.default, [obj, type].concat(args));
  };
  obj.off = function () {
    return _grid2.default.off(obj);
  };
}

function implementLoggableInterface(obj) {
  var initialValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  obj.loggable = initialValue;
  obj.loggability = function (value) {
    obj.loggable = value;
    return obj;
  };
}

function implementIterableProtocol(event) {
  if (typeof Symbol !== 'undefined' && typeof Symbol.iterator !== 'undefined') {
    event[Symbol.iterator] = function () {
      var values = [event.map(), event.mutate()];
      var i = 0;

      return {
        next: function next() {
          return {
            value: values[i++],
            done: i > values.length
          };
        }
      };
    };
  }
};

},{"./grid":2}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QueueAPI = undefined;
exports.createQueue = createQueue;

var _utils = require('./utils');

var _pipe = require('./queueMethods/pipe');

var _pipe2 = _interopRequireDefault(_pipe);

var _map = require('./queueMethods/map');

var _map2 = _interopRequireDefault(_map);

var _mapToKey = require('./queueMethods/mapToKey');

var _mapToKey2 = _interopRequireDefault(_mapToKey);

var _mutate = require('./queueMethods/mutate');

var _mutate2 = _interopRequireDefault(_mutate);

var _filter = require('./queueMethods/filter');

var _filter2 = _interopRequireDefault(_filter);

var _constants = require('./constants');

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

var QueueAPI = exports.QueueAPI = {
  define: function define(methodName, func) {
    this[methodName] = function (q, args, payload, next) {
      var result = func.apply(undefined, _toConsumableArray(args))(q.result, payload, q);

      if ((0, _utils.isPromise)(result)) {
        return result.then(next);
      }
      return next(result);
    };
  }
};

QueueAPI.define('pipe', _pipe2.default);
QueueAPI.define('map', _map2.default);
QueueAPI.define('mapToKey', _mapToKey2.default);
QueueAPI.define('mutate', _mutate2.default);
QueueAPI.define('filter', _filter2.default);

function createQueue(initialStateValue, setStateValue) {
  var q = {
    id: (0, _utils.getId)('q'),
    index: null,
    setStateValue: setStateValue,
    result: initialStateValue,
    items: [],
    add: function add(type, func) {
      this.items.push({ type: type, func: func });
    },
    process: function process() {
      for (var _len = arguments.length, payload = Array(_len), _key = 0; _key < _len; _key++) {
        payload[_key] = arguments[_key];
      }

      q.index = 0;

      function next() {
        if (q.index < q.items.length) {
          return loop();
        }
        q.index = null;
        return q.result;
      };
      function loop() {
        var _q$items$q$index = q.items[q.index],
            type = _q$items$q$index.type,
            func = _q$items$q$index.func;

        var logic = QueueAPI[type];

        if (logic) {
          var r = logic(q, func, payload, function (lastResult) {
            q.result = lastResult;
            q.index++;
            return next();
          });

          return r;
        }
        throw new Error('Unsupported method "' + type + '".');
      };

      if (q.items.length > 0) {
        return loop();
      }
      return q.result;
    },
    cancel: function cancel() {
      q.items = [];
    }
  };

  return q;
}

},{"./constants":1,"./queueMethods/filter":7,"./queueMethods/map":8,"./queueMethods/mapToKey":9,"./queueMethods/mutate":10,"./queueMethods/pipe":11,"./utils":15}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = filter;

var _utils = require('../utils');

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }return arr2;
  } else {
    return Array.from(arr);
  }
}

function filter(func) {
  return function (intermediateValue, payload, q) {
    var filterResult = func.apply(undefined, [intermediateValue].concat(_toConsumableArray(payload)));

    if ((0, _utils.isPromise)(filterResult)) {
      return filterResult.then(function (asyncResult) {
        if (!asyncResult) {
          q.index = q.items.length;
        }
        return intermediateValue;
      });
    }
    if (!filterResult) {
      q.index = q.items.length;
    }
    return intermediateValue;
  };
}

},{"../utils":15}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = map;

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }return arr2;
  } else {
    return Array.from(arr);
  }
}

function map(func) {
  return function (intermediateValue, payload) {
    return (func || function (value) {
      return value;
    }).apply(undefined, [intermediateValue].concat(_toConsumableArray(payload)));
  };
};

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mapToKey;

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }return arr2;
  } else {
    return Array.from(arr);
  }
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }return obj;
}

function mapToKey(key) {
  return function (intermediateValue, payload) {
    var mappingFunc = function mappingFunc(value) {
      return _defineProperty({}, key, value);
    };

    return mappingFunc.apply(undefined, [intermediateValue].concat(_toConsumableArray(payload)));
  };
};

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mutate;

var _utils = require('../utils');

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }return arr2;
  } else {
    return Array.from(arr);
  }
}

function mutate(func) {
  return function (intermediateValue, payload, q) {
    var result = (func || function (current, payload) {
      return payload;
    }).apply(undefined, [intermediateValue].concat(_toConsumableArray(payload)));

    if ((0, _utils.isPromise)(result)) {
      return result.then(function (asyncResult) {
        q.setStateValue(asyncResult);
        return asyncResult;
      });
    }
    q.setStateValue(result);
    return result;
  };
};

},{"../utils":15}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pipe;

var _utils = require('../utils');

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }return arr2;
  } else {
    return Array.from(arr);
  }
}

function pipe(func) {
  return function (intermediateValue, payload) {
    var result = (func || function () {}).apply(undefined, [intermediateValue].concat(_toConsumableArray(payload)));

    if ((0, _utils.isPromise)(result)) {
      return result.then(function () {
        return intermediateValue;
      });
    }
    return intermediateValue;
  };
};

},{"../utils":15}],12:[function(require,module,exports){
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
}();

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

      // updating props


      (0, _react.useEffect)(function () {
        if (instance) instance.update(outerProps);
      }, [outerProps]);

      // mounting
      (0, _react.useEffect)(function () {
        instance = _index.riew.apply(undefined, [function (props) {
          if (props === null) {
            setContent(null);
          } else {
            setContent(_react2.default.createElement(View, props));
          }
        }].concat(controllers));

        if (externals && externals.length > 0) {
          var _instance;

          instance = (_instance = instance).with.apply(_instance, _toConsumableArray(externals));
        }

        setInstance(instance);
        instance.mount(outerProps);

        return function () {
          instance.unmount();
        };
      }, []);

      return content;
    };

    comp.displayName = 'Riew(' + (0, _utils.getFuncName)(View) + ')';
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
},{"../index":4,"../utils":15}],13:[function(require,module,exports){
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

exports.default = createRiew;

var _index = require('./index');

var _state3 = require('./state');

var _utils = require('./utils');

var _constants = require('./constants');

var _grid = require('./grid');

var _grid2 = _interopRequireDefault(_grid);

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

function ensureObject(value, context) {
  if (value === null || typeof value !== 'undefined' && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
    throw new Error(context + ' must be called with a key-value object. Instead "' + value + '" passed.');
  }
  return value;
}
function normalizeExternalsMap(arr) {
  return arr.reduce(function (map, item) {
    if (typeof item === 'string') {
      map = _extends({}, map, _defineProperty({}, '@' + item, true));
    } else {
      map = _extends({}, map, item);
    }
    return map;
  }, {});
}
var accumulate = function accumulate(current, newStuff) {
  return _extends({}, current, newStuff);
};

function createRiew(viewFunc) {
  for (var _len = arguments.length, controllers = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    controllers[_key - 1] = arguments[_key];
  }

  var instance = {
    id: (0, _utils.getId)('r'),
    name: (0, _utils.getFuncName)(viewFunc)
  };
  var active = false;
  var internalStates = [];
  var onUnmountCallbacks = [];
  var subscriptions = {};
  var externals = {};

  var input = (0, _index.state)({}, false);
  var output = (0, _index.state)({}, false);
  var api = (0, _index.state)({}, false);

  var isActive = function isActive() {
    return active;
  };
  var generateSubscriptionName = function generateSubscriptionName(stateId) {
    return stateId + '_' + instance.id;
  };

  // effects
  var updateOutput = output.mutate(function (current, newStuff) {
    var result = _extends({}, current);

    if (newStuff) {
      Object.keys(newStuff).forEach(function (key) {
        if ((0, _state3.isEffect)(newStuff[key]) && !newStuff[key].isMutating()) {
          var effect = newStuff[key];
          var _state = _grid2.default.getNodeById(effect.stateId);

          result[key] = effect();
          if (!subscriptions[effect.stateId]) subscriptions[effect.stateId] = {};
          subscriptions[effect.stateId][key] = effect;
          _grid2.default.subscribe(_state, _constants.STATE_VALUE_CHANGE, function () {
            return _render(Object.keys(subscriptions[effect.stateId]).reduce(function (effectsResult, key) {
              effectsResult[key] = subscriptions[effect.stateId][key]();
              return effectsResult;
            }, {}));
          }, generateSubscriptionName(_state.id));
        } else {
          result[key] = newStuff[key];
        }
      });
    }
    return result;
  });
  var _render = updateOutput.filter(isActive).pipe(function (value) {
    return viewFunc(value);
  });
  var updateControllerAPI = api.mutate(accumulate);
  var updateInput = input.mutate(accumulate);

  // defining the controller api
  updateControllerAPI({
    state: function state() {
      var s = _index.state.apply(undefined, arguments);

      internalStates.push(s);
      return s;
    },
    render: function render(newProps) {
      ensureObject(newProps, 'The `render` method');
      return _render(newProps);
    },

    isActive: isActive,
    props: input
  });

  function processExternals() {
    Object.keys(externals).forEach(function (key) {
      var external = void 0;

      if (key.charAt(0) === '@') {
        key = key.substr(1, key.length);
        external = (0, _index.use)(key);
      } else {
        external = externals[key];
      }

      updateOutput(_defineProperty({}, key, external));
      updateControllerAPI(_defineProperty({}, key, external));
    });
  }

  instance.isActive = isActive;
  instance.mount = function () {
    var initialProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    ensureObject(initialProps, 'The `mount` method');
    updateInput(initialProps);
    updateOutput(initialProps);
    processExternals();

    var controllersResult = _utils.parallel.apply(undefined, controllers)(api());
    var done = function done(result) {
      return onUnmountCallbacks = result || [];
    };

    if ((0, _utils.isPromise)(controllersResult)) {
      controllersResult.then(done);
    } else {
      done(controllersResult);
    }

    active = true;
    _render();
    return instance;
  };
  instance.update = function (newProps) {
    _render(newProps);
    updateInput(newProps);
  };
  instance.unmount = function () {
    active = false;
    output.destroy();
    api.destroy();
    internalStates.forEach(function (s) {
      return s.destroy();
    });
    internalStates = [];
    onUnmountCallbacks.filter(function (f) {
      return typeof f === 'function';
    }).forEach(function (f) {
      return f();
    });
    onUnmountCallbacks = [];
    Object.keys(subscriptions).forEach(function (stateId) {
      _grid2.default.unsubscribe(_grid2.default.getNodeById(stateId), _constants.STATE_VALUE_CHANGE, generateSubscriptionName(stateId));
    });
    subscriptions = {};
    return instance;
  };
  instance.with = function () {
    for (var _len2 = arguments.length, maps = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      maps[_key2] = arguments[_key2];
    }

    instance.__setExternals(maps);
    return instance;
  };
  instance.test = function (map) {
    var newInstance = createRiew.apply(undefined, [viewFunc].concat(controllers));

    newInstance.__setExternals([map]);
    return newInstance;
  };
  instance.__setExternals = function (maps) {
    externals = _extends({}, externals, normalizeExternalsMap(maps));
  };
  instance.__output = output;

  return instance;
};

},{"./constants":1,"./grid":2,"./index":4,"./state":14,"./utils":15}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isEffect = isEffect;
exports.State = State;

var _fastDeepEqual = require('fast-deep-equal');

var _fastDeepEqual2 = _interopRequireDefault(_fastDeepEqual);

var _utils = require('./utils');

var _queue = require('./queue');

var _constants = require('./constants');

var _interfaces = require('./interfaces');

var _index = require('./index');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function isEffect(effect) {
  return effect && effect.id && effect.id.substr(0, 1) === 'e';
}

function State(initialValue, loggable) {
  var state = {};
  var value = initialValue;
  var active = true;

  (0, _interfaces.implementObservableInterface)(state);

  state.id = (0, _utils.getId)('s');
  state.get = function () {
    return value;
  };
  state.set = function (newValue) {
    if ((0, _fastDeepEqual2.default)(value, newValue) || active === false) return;
    value = newValue;
    state.emit(_constants.STATE_VALUE_CHANGE, value);
  };
  state.destroy = function () {
    active = false;
    state.off();
  };
  state.createEffect = function () {
    var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var effect = function effect() {
      if (active === false) return value;
      var q = (0, _queue.createQueue)(state.get(), state.set);

      effect.on(_constants.CANCEL_EFFECT, q.cancel);
      effect.items.forEach(function (_ref) {
        var type = _ref.type,
            func = _ref.func;
        return q.add(type, func);
      });
      return q.process.apply(q, arguments);
    };

    effect.id = (0, _utils.getId)('e');
    effect.stateId = state.id;
    effect.items = items;

    (0, _interfaces.implementIterableProtocol)(effect);
    (0, _interfaces.implementObservableInterface)(effect);

    effect.isMutating = function () {
      return !!effect.items.find(function (_ref2) {
        var type = _ref2.type;
        return type === 'mutate';
      });
    };
    effect.destroy = function () {
      (0, _index.cancel)(effect);
      effect.off();
    };

    Object.keys(_queue.QueueAPI).forEach(function (m) {
      effect[m] = function () {
        for (var _len = arguments.length, methodArgs = Array(_len), _key = 0; _key < _len; _key++) {
          methodArgs[_key] = arguments[_key];
        }

        return (0, _index._fork)(state, effect, { type: m, func: methodArgs });
      };
    });

    return effect;
  };

  return state;
};

},{"./constants":1,"./index":4,"./interfaces":5,"./queue":6,"./utils":15,"fast-deep-equal":16}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var isPromise = exports.isPromise = function isPromise(obj) {
  return obj && typeof obj['then'] === 'function';
};
var isObjectLiteral = exports.isObjectLiteral = function isObjectLiteral(obj) {
  return obj ? obj.constructor === {}.constructor : false;
};
var getFuncName = exports.getFuncName = function getFuncName(func) {
  if (func.name) return func.name;
  var result = /^function\s+([\w\$]+)\s*\(/.exec(func.toString());

  return result ? result[1] : 'unknown';
};
var compose = exports.compose = function compose() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return function (lastResult) {
    var isAsync = false;
    var done = function done() {};
    var funcs = [].concat(args);

    (function loop() {
      if (funcs.length === 0) {
        done(lastResult);return;
      }
      var f = funcs.shift();
      var result = f(lastResult);

      if (isPromise(result)) {
        isAsync = true;
        result.then(function (r) {
          lastResult = r;
          loop();
        });
      } else {
        lastResult = result;
        loop();
      }
    })();

    if (isAsync) {
      return new Promise(function (d) {
        return done = d;
      });
    }
    return lastResult;
  };
};
var serial = exports.serial = function serial() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return function (arg) {
    var isAsync = false;
    var done = function done() {};
    var results = [];
    var funcs = [].concat(args);

    (function loop() {
      if (funcs.length === 0) {
        done(results);return;
      }
      var f = funcs.shift();
      var result = f(arg);

      if (isPromise(result)) {
        isAsync = true;
        result.then(function (r) {
          results.push(r);
          loop();
        });
      } else {
        results.push(result);
        loop();
      }
    })();

    if (isAsync) {
      return new Promise(function (d) {
        return done = d;
      });
    }
    return results;
  };
};
var parallel = exports.parallel = function parallel() {
  for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  return function (arg) {
    var isAsync = false;
    var results = [];
    var funcs = [].concat(args);

    (function loop() {
      if (funcs.length === 0) {
        return;
      }
      var f = funcs.shift();
      var result = f(arg);

      if (isPromise(result)) isAsync = true;
      results.push(result);
      loop();
    })();

    if (isAsync) {
      return Promise.all(results.map(function (r) {
        if (isPromise(r)) return r;
        return Promise.resolve(r);
      }));
    }
    return results;
  };
};

var ids = 0;

var getId = exports.getId = function getId(prefix) {
  return prefix + '_' + ++ids;
};

},{}],16:[function(require,module,exports){
'use strict';

var isArray = Array.isArray;
var keyList = Object.keys;
var hasProp = Object.prototype.hasOwnProperty;

module.exports = function equal(a, b) {
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    var arrA = isArray(a)
      , arrB = isArray(b)
      , i
      , length
      , key;

    if (arrA && arrB) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (!equal(a[i], b[i])) return false;
      return true;
    }

    if (arrA != arrB) return false;

    var dateA = a instanceof Date
      , dateB = b instanceof Date;
    if (dateA != dateB) return false;
    if (dateA && dateB) return a.getTime() == b.getTime();

    var regexpA = a instanceof RegExp
      , regexpB = b instanceof RegExp;
    if (regexpA != regexpB) return false;
    if (regexpA && regexpB) return a.toString() == b.toString();

    var keys = keyList(a);
    length = keys.length;

    if (length !== keyList(b).length)
      return false;

    for (i = length; i-- !== 0;)
      if (!hasProp.call(b, keys[i])) return false;

    for (i = length; i-- !== 0;) {
      key = keys[i];
      if (!equal(a[key], b[key])) return false;
    }

    return true;
  }

  return a!==a && b!==b;
};

},{}]},{},[4])(4)
});
