(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Riew = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var STATE_DESTROY = exports.STATE_DESTROY = 'STATE_DESTROY';

var EFFECT_EXPORTED = exports.EFFECT_EXPORTED = 'EFFECT_EXPORTED';

var QUEUE_START = exports.QUEUE_START = 'QUEUE_START';
var QUEUE_END = exports.QUEUE_END = 'QUEUE_END';
var QUEUE_STEP_IN = exports.QUEUE_STEP_IN = 'QUEUE_STEP_IN';
var QUEUE_STEP_OUT = exports.QUEUE_STEP_OUT = 'QUEUE_STEP_OUT';

var RIEW_CREATED = exports.RIEW_CREATED = 'RIEW_CREATED';
var RIEW_RENDER = exports.RIEW_RENDER = 'RIEW_RENDER';
var RIEW_UNMOUNT = exports.RIEW_UNMOUNT = 'RIEW_UNMOUNT';

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createEventBus;

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function createEventBus() {
  var events = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var emit = function emit(type) {
    for (var _len = arguments.length, payload = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      payload[_key - 1] = arguments[_key];
    }

    if (true) _logger2.default.log.apply(_logger2.default, [type].concat(payload));
    if (events[type]) {
      return events[type].apply(events, payload);
    }
  };

  return emit;
} /* eslint-disable consistent-return */
;

},{"./logger":7}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function Grid() {
  var api = {};
  var nodes = [];

  var add = function add(product) {
    if (!product || !product.id) {
      throw new Error("Each node in the grid must be an object with \"id\" field. Instead \"" + product + "\" given.");
    }
    nodes.push(product);
  };
  var remove = function remove(product) {
    nodes = nodes.filter(function (_ref) {
      var id = _ref.id;
      return id !== product.id;
    });
  };

  api.add = add;
  api.remove = remove;
  api.reset = function () {
    return nodes = [];
  };
  api.nodes = function () {
    return nodes;
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
    var _createEventBus;

    var emit = (0, _eventBus2.default)((_createEventBus = {}, _defineProperty(_createEventBus, _constants.STATE_DESTROY, function () {
      state.effects().forEach(function (e) {
        if ('__exportedAs' in effect) {
          h.undefineProduct(effect.__exportedAs);
        }
      });
      _grid2.default.remove(state);
    }), _defineProperty(_createEventBus, _constants.EFFECT_EXPORTED, function (effect, name) {
      effect.__exportedAs = name;
      h.defineProduct(name, function () {
        return effect;
      });
    }), _createEventBus));
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
        _h$produce2 = _slicedToArray(_h$produce, 4),
        effect = _h$produce2[0],
        sInstance = _h$produce2[3];

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

    return _riew2.default.apply(undefined, [viewFunc].concat(controllers));
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

},{"./constants":1,"./eventBus":2,"./grid":3,"./react":14,"./riew":15,"./state":19,"fast-deep-equal":21}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logger = exports.harvester = exports.parallel = exports.serial = exports.compose = exports.reset = exports.register = exports.use = exports.react = exports.riew = exports.merge = exports.state = undefined;

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

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

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
  _logger2.default.reset();
  _harvester2.default.reset();
  _grid2.default.reset();
};

var harvester = exports.harvester = _harvester2.default;
var logger = exports.logger = _logger2.default;

},{"./grid":3,"./harvester":4,"./logger":7,"./utils":20}],6:[function(require,module,exports){
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
}; /* eslint-disable consistent-return */

var _sanitize = require('./sanitize');

var _sanitize2 = _interopRequireDefault(_sanitize);

var _utils = require('./utils');

var _state = require('./state');

var _riew = require('./riew');

var _constants = require('./constants');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var MAX_NUM_OF_EVENTS = 850;
var INDENT = 12;

function formatQueueItem(_ref) {
  var type = _ref.type,
      func = _ref.func;

  var name = (0, _utils.getFuncName)(func);

  return '' + type + (name !== 'unknown' ? ':' + name : '');
}

function normalizeState(state) {
  return {
    id: state.id,
    value: (0, _sanitize2.default)(state.get()),
    queues: state.queues().map(normalizeQueue)
  };
}
function normalizeEffect(effect) {
  return {
    id: effect.id,
    items: effect.items.map(function (_ref2) {
      var type = _ref2.type;
      return type;
    }),
    state: normalizeState(effect.state)
  };
}
function normalizeQueue(q) {
  var items = q.items.map(formatQueueItem);

  return {
    id: q.id,
    effectId: q.effectId,
    result: (0, _sanitize2.default)(q.result),
    items: items,
    index: q.index,
    currentItem: items[q.index]
  };
}
function normalizeRiew(riew, props) {
  return {
    id: riew.id,
    name: riew.name,
    active: riew.isActive(),
    props: (0, _sanitize2.default)(props)
  };
}

function normalize(product, type, payload) {
  var state = void 0,
      effect = void 0,
      gridNode = void 0,
      riew = void 0,
      queue = void 0;

  if (product && product.loggable === false) return;

  if ((0, _state.isState)(product)) {
    state = normalizeState(product);
  } else if ((0, _state.isEffect)(product)) {
    effect = normalizeEffect(product);
    if (type === _constants.QUEUE_END || type === _constants.QUEUE_START || type === _constants.QUEUE_STEP_IN || type === _constants.QUEUE_STEP_OUT) {
      queue = normalizeQueue(payload[0]);
    }
  } else if ((0, _riew.isRiew)(product)) {
    riew = normalizeRiew(product, payload[0]);
  }

  return Object.assign({}, state && { state: state }, effect && { effect: effect }, gridNode && { gridNode: gridNode }, riew && { riew: riew }, queue && { queue: queue });
}

function Logger() {
  var api = {};
  var events = [];

  api.log = function (type) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return;
    var product = args[0],
        payload = args.slice(1);

    if (Array.isArray(product)) {
      product.forEach(function (x) {
        return api.log(type, x);
      });
      return;
    };
    var normalizedProduct = normalize(product, type, payload);

    if (normalizedProduct) {
      events.push(_extends({ type: type }, normalizedProduct));
    }
  };
  api.reset = function () {
    events = [];
  };
  api.events = function () {
    return events;
  };

  return api;
}

var logger = Logger();

exports.default = logger;

/*

function normalizeState(state) {
  return {
    id: state.id,
    value: sanitize(state.get())
  };
}
function normalizeEffect(effect) {
  return {
    id: effect.id,
    state: normalizeState(effect.state),
    queueItems: effect.__items.map(({ type, func }) => ({
      type,
      name: getFuncName(func)
    })),
    queues: effect.__queues.map(normalizeQueue)
  };
}
function normalizeRiew(r, props, view, controllers) {
  return {
    id: r.id,
    props: sanitize(props),
    view: getFuncName(view),
    controllers: controllers.map(getFuncName)
  };
}
function normalizeQueue(q) {
  return {
    index: q.index,
    result: sanitize(q.result),
    items: q.items.map(({ type, func }) => ({ type, name: getFuncName(func) }))
  };
}

function getSpaces(n) {
  let str = '';

  for (let i = 0; i < n; i++) str += ' ';
  return str;
};
function formatQueueItem({ type, name }) {
  return `${ type }${ name !== 'unknown' ? `(${ name })` : ''}`;
}
function formatId(obj, noSpaces = false) {
  if (!obj.id) return getSpaces(INDENT);
  const [ type, n ] = obj.id.split('_');
  const what = (function () {
    if (type === 's') return `$${ n }`;
    if (type === 'r') return `<${ n }>`;
    if (type === 'e') return `effect#${ n }`;
    return type;
  })();
  const text = `${ what }`;

  if (noSpaces) {
    return text;
  }

  if (text.length < INDENT) {
    return getSpaces(INDENT - text.length) + text + ' ';
  }
  return text + ' ';
}
function formatQueueItems(effect) {
  return effect.queueItems.map(formatQueueItem).join(', ');
}

const normalizers = {
  [ STATE_CREATED ]: normalizeState,
  [ STATE_TEARDOWN ]: normalizeState,
  [ EFFECT_ADDED ]: normalizeEffect,
  [ EFFECT_REMOVED ]: normalizeEffect,
  [ EFFECT_TEARDOWN ]: normalizeEffect,
  [ EFFECT_STEP ]: (effect, q, phase) => {
    return {
      ...normalizeEffect(effect),
      queue: normalizeQueue(q),
      phase
    };
  },
  [ EFFECT_EXPORTED ]: normalizeEffect,
  [ RIEW_CREATED ]: normalizeRiew,
  [ RIEW_RENDER ]: normalizeRiew,
  [ RIEW_UNMOUNT ]: normalizeRiew
};

function createSimpleStorage() {
  const api = {};
  let items = [];

  api.add = item => {
    const found = items.findIndex(({ id }) => item.id === id);

    if (found >= 0) {
      items[found] = item;
    } else {
      items.push(item);
    }
  };
  api.get = () => items;
  api.remove = item => (items = items.filter(({ id }) => item.id !== id));
  api.clear = () => (items = []);

  return api;
}

function createLogger() {
  const api = {};
  let events = [];
  let states = createSimpleStorage();
  let effects = createSimpleStorage();
  let riews = createSimpleStorage();

  api.log = (type, ...payload) => {
    if ('loggable' in payload[0] && payload[0].loggable === false) {
      return;
    }
    if (events.length > MAX_NUM_OF_EVENTS) {
      events.shift();
    }

    let item = {};

    if (normalizers[type]) {
      item = normalizers[type](...payload);
      events.push({ type, ...item });
    } else {
      events.push({ type });
    }

    switch (type) {
      case STATE_CREATED: states.add(item); break;
      case STATE_TEARDOWN: states.remove(item); break;
      case EFFECT_ADDED:
      case EFFECT_STEP:
        effects.add(item);
        break;
      case EFFECT_REMOVED:
      case EFFECT_TEARDOWN:
        // effects.remove(item);
        break;
      case RIEW_CREATED:
      case RIEW_RENDER:
        riews.add(item);
        break;
      case RIEW_UNMOUNT: riews.remove(item); break;
    }
  };
  api.events = () => {
    events.forEach(event => {
      switch (event.type) {
        case STATE_CREATED:
          console.log(`${ formatId(event) } +`, event.value);
          break;
        case STATE_TEARDOWN:
          console.log(`${ formatId(event) } ✖`, event.value);
          break;
        case RIEW_CREATED:
          // console.log(`${ formatId(event) } + ${ event.view } | ${ event.controllers.join(', ')}`);
          break;
        case RIEW_UNMOUNT:
          console.log(`${ formatId(event) } ✖ ${ event.name }`);
          break;
        case RIEW_RENDER:
          console.log(`${ formatId(event) } ✔ ${ event.name }`, event.props);
          break;
        case EFFECT_ADDED:
          console.log(`${ formatId(event) } + [${ formatQueueItems(event) }]`);
          break;
        case EFFECT_STEP:
          const queue = event.queue;
          const text = formatQueueItem(queue.items[queue.index]);

          if (event.phase === 'in') {
            console.log(`${ formatId(event) } > ${ text }`, queue.result);
          } else {
            console.log(`${ formatId(event) } < ${ text }`, queue.result);
          }
          break;
        case EFFECT_REMOVED:
          console.log(`${ formatId(event) } ✖`);
          break;
        case EFFECT_TEARDOWN:
          // console.log(`${ formatId(event) } ✖`);
          break;
        default:
          console.log(getSpaces(INDENT) + '  ' + event.type);
      }
    });
  };
  api.grid = () => {
    const grid = api.data.grid();

    riews.get().forEach(riew => {
      console.log(`${ formatId(riew) } ${ riew.view }`, riew.props);
    });
    console.log(getSpaces(INDENT) + '  ~~~');
    grid.states.forEach(state => {
      console.log(formatId(state), state.value);
      state.effects.forEach(effect => {
        console.log(`${ getSpaces(INDENT) }  ↳ ${ formatId(effect, true) }`);
        console.log(effect);
      });
    });

    // console.log(JSON.stringify(grid, null, 2));
  };
  api.clear = () => {
    events = [];
    states.clear();
    effects.clear();
    riews.clear();
  };
  api.data = {
    events() { return events; },
    grid() {
      const ss = states.get().map((state) => ({ ...state, effects: [] }));

      effects.get().forEach(effect => {
        const state = ss.find(({ id }) => effect.state.id);

        if (state) {
          state.effects.push(effect);
        } else {
          ss.push({ ...effect.state, effects: [ effect ]});
        }
      });
      // console.log(JSON.stringify(states.get(), null, 2));
      // return {
      //   states: states.get().
      // }
      // console.log(JSON.stringify(effects.get(), null, 2));

      return {
        states: ss
      };
    }
  };

  return api;
};

const logger = createLogger();

export default logger;
*/

},{"./constants":1,"./riew":15,"./sanitize":16,"./state":19,"./utils":20}],8:[function(require,module,exports){
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

function createQueue(state, lifecycle) {
  var setStateValue = state.set;
  var getStateValue = state.get;
  var queueAPI = state.queueAPI;
  var q = {
    id: (0, _utils.getId)('q'),
    index: null,
    setStateValue: setStateValue,
    getStateValue: getStateValue,
    result: getStateValue(),
    items: [],
    add: function add(type, func) {
      this.items.push({ type: type, func: func, name: func.map(_utils.getFuncName) });
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

  return q;
}

},{"./queueMethods/filter":9,"./queueMethods/map":10,"./queueMethods/mapToKey":11,"./queueMethods/mutate":12,"./queueMethods/pipe":13,"./utils":20}],9:[function(require,module,exports){
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

},{"../utils":20}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{"../utils":20}],13:[function(require,module,exports){
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

},{"../utils":20}],14:[function(require,module,exports){
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
},{"../index":5,"../utils":20}],15:[function(require,module,exports){
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

exports.isRiew = isRiew;
exports.default = createRiew;

var _index = require('./index');

var _state8 = require('./state');

var _utils = require('./utils');

var _eventBus = require('./eventBus');

var _eventBus2 = _interopRequireDefault(_eventBus);

var _constants = require('./constants');

var _interfaces = require('./interfaces');

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

function isRiew(riew) {
  return riew && riew.mount && riew.unmount;
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
var emit = (0, _eventBus2.default)();

function createRiew(viewFunc) {
  for (var _len = arguments.length, controllers = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    controllers[_key - 1] = arguments[_key];
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
          var _newStuff$key = _slicedToArray(newStuff[key], 4),
              effect = _newStuff$key[0],
              sInstance = _newStuff$key[3];

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
  instance.__setExternals = function (maps) {
    externals = _extends({}, externals, normalizeExternalsMap(maps));
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

  emit(_constants.RIEW_CREATED, instance, output());
  return instance;
};

},{"./constants":1,"./eventBus":2,"./index":5,"./interfaces":6,"./state":19,"./utils":20}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sanitize;

var _CircularJSON = require('./vendor/CircularJSON');

var _CircularJSON2 = _interopRequireDefault(_CircularJSON);

var _SerializeError = require('./vendor/SerializeError');

var _SerializeError2 = _interopRequireDefault(_SerializeError);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function sanitize(something) {
  var showErrorInConsole = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var result;

  if (typeof something === 'undefined') {
    return undefined;
  }

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

},{"./vendor/CircularJSON":17,"./vendor/SerializeError":18}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isState = isState;
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

function isState(state) {
  return state && state.id && state.id.split('_').shift() === 's';
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
    var queue = (0, _queue.createQueue)(state, {
      start: function start(q) {
        emit(_constants.QUEUE_START, effect, q);
      },
      end: function end(q) {
        queues = queues.filter(function (_ref2) {
          var id = _ref2.id;
          return id !== q.id;
        });
        emit(_constants.QUEUE_END, effect, q);
      },
      stepIn: function stepIn(q) {
        emit(_constants.QUEUE_STEP_IN, effect, q);
      },
      stepOut: function stepOut(q) {
        emit(_constants.QUEUE_STEP_OUT, effect, q);
      }
    });

    effect.items.forEach(function (_ref3) {
      var type = _ref3.type,
          func = _ref3.func;
      return queue.add(type, func);
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
      return !!effect.items.find(function (_ref4) {
        var type = _ref4.type;
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
        var values = [effect.map(), effect.mutate(), state.cancel, state];
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

},{"./constants":1,"./interfaces":6,"./queue":8,"./utils":20,"fast-deep-equal":21}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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
