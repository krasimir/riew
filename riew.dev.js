(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Riew = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var STATE_DESTROY = exports.STATE_DESTROY = 'STATE_DESTROY';
var EFFECT_EXPORTED = exports.EFFECT_EXPORTED = 'EFFECT_EXPORTED';
var QUEUE_END = exports.QUEUE_END = 'QUEUE_END';
var QUEUE_STEP_IN = exports.QUEUE_STEP_IN = 'QUEUE_STEP_IN';
var QUEUE_STEP_OUT = exports.QUEUE_STEP_OUT = 'QUEUE_STEP_OUT';
var HARVESTER_PRODUCE = exports.HARVESTER_PRODUCE = 'HARVESTER_PRODUCE';
var RIEW_RENDER = exports.RIEW_RENDER = 'RIEW_RENDER';
var RIEW_UNMOUNT = exports.RIEW_UNMOUNT = 'RIEW_UNMOUNT';

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createEventBus;

var _grid = require('./grid');

var _grid2 = _interopRequireDefault(_grid);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function createEventBus() {
  var events = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var emit = function emit(type) {
    for (var _len = arguments.length, payload = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      payload[_key - 1] = arguments[_key];
    }

    if (true) _grid2.default.dispatch.apply(_grid2.default, [type].concat(payload));
    if (events[type]) {
      return events[type].apply(events, payload);
    }
  };

  return emit;
} /* eslint-disable consistent-return */
;

},{"./grid":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function Grid() {
  var api = {};
  var nodes = [];
  var listeners = [];

  api.add = function (product) {
    if (!product || !product.id) {
      throw new Error("Each node in the grid must be an object with \"id\" field. Instead \"" + product + "\" given.");
    }
    nodes.push(product);
  };;
  api.remove = function (product) {
    nodes = nodes.filter(function (_ref) {
      var id = _ref.id;
      return id !== product.id;
    });
  };;
  api.reset = function () {
    nodes = [];
    listeners = [];
  };
  api.nodes = function () {
    return nodes;
  };
  api.on = function (listener) {
    return listeners.push(listener);
  };
  api.dispatch = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return listeners.forEach(function (l) {
      return l.apply(undefined, args);
    });
  };

  return api;
}

var grid = Grid();

exports.default = grid;

},{}],4:[function(require,module,exports){
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

var _createEventBus;

var _fastDeepEqual = require('fast-deep-equal');

var _fastDeepEqual2 = _interopRequireDefault(_fastDeepEqual);

var _state = require('./state');

var _riew = require('./riew');

var _riew2 = _interopRequireDefault(_riew);

var _react = require('./react');

var _react2 = _interopRequireDefault(_react);

var _grid = require('./grid');

var _grid2 = _interopRequireDefault(_grid);

var _eventBus = require('./eventBus');

var _eventBus2 = _interopRequireDefault(_eventBus);

var _constants = require('./constants');

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

var emit = (0, _eventBus2.default)((_createEventBus = {}, _defineProperty(_createEventBus, _constants.STATE_DESTROY, function (state) {
  state.effects().forEach(function (e) {
    if ('__exportedAs' in e) {
      h.undefineProduct(e.__exportedAs);
    }
  });
  _grid2.default.remove(state);
}), _defineProperty(_createEventBus, _constants.EFFECT_EXPORTED, function (effect, name) {
  effect.__exportedAs = name;
  h.defineProduct(name, function () {
    return effect;
  });
}), _defineProperty(_createEventBus, _constants.RIEW_UNMOUNT, function (riew) {
  _grid2.default.remove(riew);
}), _createEventBus));

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
    var product = (_products = products)[type].apply(_products, args);

    emit(_constants.HARVESTER_PRODUCE, product);
    return product;
  };
  api.reset = function () {
    products = {};
    defineHarvesterBuiltInCapabilities(api);
  };

  return api;
};

var defineHarvesterBuiltInCapabilities = function defineHarvesterBuiltInCapabilities(h) {

  // ------------------------------------------------------------------ state
  h.defineProduct('state', function (initialValue, loggable) {
    var state = (0, _state.State)(initialValue, emit, loggable);
    var effect = state.createEffect([]);

    _grid2.default.add(state);
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

    var _h$produce = h.produce('state'),
        _h$produce2 = _slicedToArray(_h$produce, 3),
        effect = _h$produce2[0],
        sInstance = _h$produce2[2];

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
            getChildState = _statesMap$key2[0],
            setChildState = _statesMap$key2[1];

        if (!(0, _fastDeepEqual2.default)(newValue[key], getChildState())) {
          setChildState(newValue[key]);
        }
      }, {});
    };

    Object.keys(statesMap).forEach(function (key) {
      statesMap[key].pipe(sInstance.triggerListeners).subscribe();
    });

    return effect;
  });

  // ------------------------------------------------------------------ riew
  h.defineProduct('riew', function (viewFunc) {
    for (var _len2 = arguments.length, controllers = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      controllers[_key2 - 1] = arguments[_key2];
    }

    var riew = _riew2.default.apply(undefined, [emit, viewFunc].concat(controllers));

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

},{"./constants":1,"./eventBus":2,"./grid":3,"./react":13,"./riew":14,"./state":15,"fast-deep-equal":17}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.grid = exports.harvester = exports.parallel = exports.serial = exports.compose = exports.reset = exports.register = exports.use = exports.react = exports.riew = exports.merge = exports.state = undefined;

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

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var state = exports.state = function state(initialValue) {
  var loggable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  return _harvester2.default.produce('state', initialValue, loggable);
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
  return _harvester2.default.defineProduct(name, function () {
    return whatever;
  });
};
var reset = exports.reset = function reset() {
  _harvester2.default.reset();
  _grid2.default.reset();
};

var harvester = exports.harvester = _harvester2.default;
var grid = exports.grid = _grid2.default;

},{"./grid":3,"./harvester":4,"./utils":16}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.implementLoggableInterface = implementLoggableInterface;
function implementLoggableInterface(obj) {
  var initialValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  obj.loggable = initialValue;
  obj.loggability = function (value) {
    obj.loggable = value;
    return obj;
  };
}

},{}],7:[function(require,module,exports){
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

exports.createQueueAPI = createQueueAPI;
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

var queueAPI = {
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

queueAPI.define('pipe', _pipe2.default);
queueAPI.define('map', _map2.default);
queueAPI.define('mapToKey', _mapToKey2.default);
queueAPI.define('mutate', _mutate2.default);
queueAPI.define('filter', _filter2.default);

function createQueueAPI() {
  return _extends({}, queueAPI);
};

function createQueue(state, effect, lifecycle) {
  var setStateValue = state.set;
  var getStateValue = state.get;
  var queueAPI = state.queueAPI;
  var q = {
    id: (0, _utils.getId)('q'),
    index: null,
    causedBy: effect.id,
    setStateValue: setStateValue,
    getStateValue: getStateValue,
    result: getStateValue(),
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
        lifecycle.end(q);
        return q.result;
      };
      function loop() {
        lifecycle.stepIn(q);
        var _q$items$q$index = q.items[q.index],
            type = _q$items$q$index.type,
            func = _q$items$q$index.func;

        var logic = queueAPI[type];

        if (logic) {
          var r = logic(q, func, payload, function (lastResult) {
            q.result = lastResult;
            lifecycle.stepOut(q);
            q.index++;
            return next();
          });

          return r;
        }
        throw new Error('Unsupported method "' + type + '".');
      };

      lifecycle.start(q);
      if (q.items.length > 0) {
        return loop();
      }
      lifecycle.end(q);
      return q.result;
    },
    cancel: function cancel() {
      q.items = [];
    }
  };

  effect.items.forEach(function (_ref) {
    var type = _ref.type,
        func = _ref.func;
    return q.add(type, func);
  });

  return q;
}

},{"./queueMethods/filter":8,"./queueMethods/map":9,"./queueMethods/mapToKey":10,"./queueMethods/mutate":11,"./queueMethods/pipe":12,"./utils":16}],8:[function(require,module,exports){
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

},{"../utils":16}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{"../utils":16}],12:[function(require,module,exports){
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

},{"../utils":16}],13:[function(require,module,exports){
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
},{"../index":5,"../utils":16}],14:[function(require,module,exports){
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

var _state8 = require('./state');

var _utils = require('./utils');

var _constants = require('./constants');

var _interfaces = require('./interfaces');

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

function createRiew(emit, viewFunc) {
  for (var _len = arguments.length, controllers = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    controllers[_key - 2] = arguments[_key];
  }

  var instance = { id: (0, _utils.getId)('r'), name: (0, _utils.getFuncName)(viewFunc) };
  var active = false;
  var internalStates = [];
  var subscriptions = [];
  var onUnmountCallbacks = [];
  var externals = {};

  var _state = (0, _index.state)({}, false),
      _state2 = _slicedToArray(_state, 1),
      input = _state2[0];

  var _state3 = (0, _index.state)({}, false),
      _state4 = _slicedToArray(_state3, 1),
      output = _state4[0];

  var _state5 = (0, _index.state)({}, false),
      _state6 = _slicedToArray(_state5, 1),
      api = _state6[0];

  var isActive = function isActive() {
    return active;
  };
  var isSubscribedTo = function isSubscribedTo(id) {
    return subscriptions.find(function (_ref) {
      var stateId = _ref.stateId;
      return id === stateId;
    });
  };

  (0, _interfaces.implementLoggableInterface)(instance);

  // effects
  var updateOutput = output.mutate(function (current, newStuff) {
    var result = _extends({}, current);

    if (newStuff) {
      Object.keys(newStuff).forEach(function (key) {
        if ((0, _state8.isEffect)(newStuff[key]) && !newStuff[key].isMutating()) {
          var _newStuff$key = _slicedToArray(newStuff[key], 3),
              effect = _newStuff$key[0],
              sInstance = _newStuff$key[2];

          effect.loggability(false);
          result[key] = effect();
          if (!isSubscribedTo(sInstance.id)) {
            subscriptions.push({
              stateId: sInstance.id,
              effect: effect.pipe(function () {
                return _render2(_defineProperty({}, key, effect()));
              }).subscribe()
            });
          }
        } else {
          result[key] = newStuff[key];
        }
      });
    }
    return result;
  });
  var _render2 = updateOutput.filter(isActive).pipe(function (value) {
    viewFunc(value);
    emit(_constants.RIEW_RENDER, instance, value);
  });
  var updateAPI = api.mutate(accumulate);
  var updateInput = input.mutate(accumulate);

  // defining the controller api
  updateAPI({
    state: function state() {
      var s = _index.state.apply(undefined, arguments);

      internalStates.push(s);
      return s;
    },
    render: function render(newProps) {
      ensureObject(newProps, 'The `render` method');
      return _render2(newProps);
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
      updateAPI(_defineProperty({}, key, external));
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
    _render2();
    return instance;
  };
  instance.update = function (newProps) {
    _render2(newProps);
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
    subscriptions.forEach(function (s) {
      return s.effect.unsubscribe();
    });
    subscriptions = [];
    emit(_constants.RIEW_UNMOUNT, instance, output());
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
    var newInstance = createRiew.apply(undefined, [emit, viewFunc].concat(controllers));

    newInstance.__setExternals([map]);
    return newInstance;
  };
  instance.__setExternals = function (maps) {
    externals = _extends({}, externals, normalizeExternalsMap(maps));
  };
  instance.__output = output;

  return instance;
};

},{"./constants":1,"./index":5,"./interfaces":6,"./state":15,"./utils":16}],15:[function(require,module,exports){
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

function isEffect(effect) {
  return effect && effect.id && effect.id.split('_').shift() === 'e';
}

function State(initialValue, emit, loggable) {
  var state = {};
  var value = initialValue;
  var listeners = [];
  var queues = [];
  var effects = [];
  var active = true;

  (0, _interfaces.implementLoggableInterface)(state, loggable);

  state.id = (0, _utils.getId)('s');
  state.queues = function () {
    return queues;
  };
  state.effects = function () {
    return effects;
  };
  state.queueAPI = (0, _queue.createQueueAPI)();
  state.triggerListeners = function () {
    return listeners.forEach(function (l) {
      return l();
    });
  };
  state.get = function () {
    return value;
  };
  state.set = function (newValue) {
    if ((0, _fastDeepEqual2.default)(value, newValue)) return;
    value = newValue;
    state.triggerListeners();
  };
  state.cancel = function () {
    queues.forEach(function (q) {
      return q.cancel();
    });
    queues = [];
  };
  state.destroy = function () {
    active = false;
    state.cancel();
    listeners = [];
    emit(_constants.STATE_DESTROY, state);
    effects = [];
  };
  state.listeners = function () {
    return listeners;
  };
  state.addListener = function (effect) {
    return listeners.push(effect);
  };
  state.removeListener = function (effect) {
    return listeners = listeners.filter(function (_ref) {
      var id = _ref.id;
      return id !== effect.id;
    });
  };
  state.runQueue = function (effect, payload) {
    if (!active) return value;
    var queue = (0, _queue.createQueue)(state, effect, {
      start: function start(q) {},
      stepIn: function stepIn(q) {
        emit(_constants.QUEUE_STEP_IN, effect);
      },
      stepOut: function stepOut(q) {
        emit(_constants.QUEUE_STEP_OUT, effect);
      },
      end: function end(q) {
        emit(_constants.QUEUE_END, effect);
        queues = queues.filter(function (_ref2) {
          var id = _ref2.id;
          return id !== q.id;
        });
      }
    });

    queues.push(queue);
    return queue.process.apply(queue, _toConsumableArray(payload));
  };
  state.createEffect = function () {
    var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var effect = function effect() {
      for (var _len = arguments.length, payload = Array(_len), _key = 0; _key < _len; _key++) {
        payload[_key] = arguments[_key];
      }

      return state.runQueue(effect, payload);
    };

    effect.id = (0, _utils.getId)('e');
    effect.items = items;
    effect.parent = state.id;
    effects.push(effect);

    (0, _interfaces.implementLoggableInterface)(effect, state.loggable);
    implementIterableProtocol(effect);
    implementQueueProtocol(effect);

    // effect direct methods
    effect.define = function (methodName, func) {
      state.queueAPI.define(methodName, func);
      effects.forEach(implementQueueProtocol);
      return effect;
    };
    effect.isMutating = function () {
      return !!effect.items.find(function (_ref3) {
        var type = _ref3.type;
        return type === 'mutate';
      });
    };
    effect.subscribe = function () {
      var initialCall = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (effect.isMutating()) {
        throw new Error('You should not subscribe a effect that mutates the state. This will lead to endless recursion.');
      }
      if (initialCall) effect();
      state.addListener(effect);
      return effect;
    };
    effect.unsubscribe = function () {
      state.removeListener(effect);
      return effect;
    };
    effect.destroy = function () {
      state.destroy();
      return effect;
    };
    effect.cancel = function () {
      queues = queues.filter(function (q) {
        if (q.causedBy === effect.id) {
          q.cancel();
          return false;
        }
        return true;
      });
    };
    effect.export = function (name) {
      emit(_constants.EFFECT_EXPORTED, effect, name);
      return effect;
    };
    effect.test = function (callback) {
      var test = forkEffect(effect);
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
    effect.setParent = function (id) {
      return effect.parent = id;
    };

    return effect;
  };

  function forkEffect(effect, newItem) {
    var newItems = [].concat(_toConsumableArray(effect.items));

    if (newItem) {
      newItems.push(newItem);
    }

    var newEffect = state.createEffect(newItems);

    newEffect.loggability(effect.loggable);
    newEffect.setParent(effect.id);
    return newEffect;
  };
  function implementIterableProtocol(effect) {
    if (typeof Symbol !== 'undefined' && typeof Symbol.iterator !== 'undefined') {
      effect[Symbol.iterator] = function () {
        var values = [effect.map(), effect.mutate(), state];
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
  function implementQueueProtocol(effect) {
    Object.keys(state.queueAPI).forEach(function (m) {
      effect[m] = function () {
        for (var _len2 = arguments.length, methodArgs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          methodArgs[_key2] = arguments[_key2];
        }

        return forkEffect(effect, { type: m, func: methodArgs });
      };
    });
  }

  return state;
};

},{"./constants":1,"./interfaces":6,"./queue":7,"./utils":16,"fast-deep-equal":17}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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

},{}]},{},[5])(5)
});
