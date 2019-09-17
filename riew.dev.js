(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Riew = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var NAME = '__@@name';
var MAX_NUM_OF_EVENTS = 500;

var ADD_STATE = 'ADD_STATE';
var ADD_NODE = 'ADD_NODE';
var ADD_EFFECT = 'ADD_EFFECT';
var FREE = 'FREE';
var RESET = 'RESET';
var SET_NAME = 'SET_NAME';
var EFFECT_QUEUE_STEP = 'EFFECT_QUEUE_STEP';
var RIEW_RENDER = 'RIEW_RENDER';

function Grid() {
  var api = {};
  var nodes = [];
  var events = [];

  var add = function add(obj) {
    if (!obj || !obj.id) {
      throw new Error('Each node in the grid must be an object with "id" field. Instead "' + obj + '" given.');
    }

    nodes.push(obj);
    return api;
  };
  var free = function free(identifier) {
    nodes = nodes.filter(function (n) {
      return n[NAME] !== identifier && n.id !== identifier;
    });
    return api;
  };
  var get = function get(identifier) {
    var node = nodes.find(function (n) {
      return n[NAME] === identifier || n.id === identifier;
    });

    if (node) {
      return node;
    }
    throw new Error('A node with identifier "' + identifier + '" is missing in the grid.');
  };

  api.dispatch = function (type, payload) {
    switch (type) {
      case ADD_STATE:
      case ADD_NODE:
      case ADD_EFFECT:
        add(payload);
        break;
      case FREE:
        free(payload);
        break;
      case RESET:
        nodes = [];
        break;
      case SET_NAME:
        var node = get(payload[0].id);

        node[NAME] = payload[1];
        break;
    }
    if (true) {
      events.push([type, payload]);
      if (events.length > MAX_NUM_OF_EVENTS) {
        events.shift();
      }
    }
  };
  api.get = get;
  api.nodes = function () {
    return nodes;
  };

  return api;
}

var grid = Grid();

var gridAdd = exports.gridAdd = function gridAdd(node) {
  return grid.dispatch(ADD_NODE, node);
};
var gridAddState = exports.gridAddState = function gridAddState(state) {
  return grid.dispatch(ADD_STATE, state);
};
var gridAddEffect = exports.gridAddEffect = function gridAddEffect(node) {
  return grid.dispatch(ADD_EFFECT, node);
};
var gridFreeNode = exports.gridFreeNode = function gridFreeNode(identifier) {
  return grid.dispatch(FREE, identifier);
};
var gridReset = exports.gridReset = function gridReset() {
  return grid.dispatch(RESET);
};
var gridSetNodeName = exports.gridSetNodeName = function gridSetNodeName(node, name) {
  return grid.dispatch(SET_NAME, [node, name]);
};
var gridEffectQueueStep = exports.gridEffectQueueStep = function gridEffectQueueStep(payload) {
  return grid.dispatch(EFFECT_QUEUE_STEP, payload);
};
var gridRiewRender = exports.gridRiewRender = function gridRiewRender(payload) {
  return grid.dispatch(RIEW_RENDER, payload);
};
var gridGetNode = exports.gridGetNode = function gridGetNode(identifier) {
  return grid.get(identifier);
};
var gridGetNodes = exports.gridGetNodes = function gridGetNodes() {
  return grid.nodes();
};

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parallel = exports.serial = exports.compose = exports.grid = exports.react = exports.riew = exports.merge = exports.state = undefined;

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

var _state = require('./state');

var _riew = require('./riew');

var _riew2 = _interopRequireDefault(_riew);

var _react = require('./react');

var _react2 = _interopRequireDefault(_react);

var _grid = require('./grid');

var _grid2 = _interopRequireDefault(_grid);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var state = exports.state = _state.createState;
var merge = exports.merge = _state.mergeStates;
var riew = exports.riew = _riew2.default;
var react = exports.react = { riew: _react2.default };
var grid = exports.grid = _grid2.default;

},{"./grid":1,"./react":3,"./riew":4,"./state":7,"./utils":13}],3:[function(require,module,exports){
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

var _riew = require('../riew');

var _riew2 = _interopRequireDefault(_riew);

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
  for (var _len = arguments.length, effects = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    effects[_key - 1] = arguments[_key];
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
        instance = _riew2.default.apply(undefined, [function (props) {
          if (props === null) {
            setContent(null);
          } else {
            setContent(_react2.default.createElement(View, props));
          }
        }].concat(effects));

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
},{"../riew":4,"../utils":13}],4:[function(require,module,exports){
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

var _state8 = require('./state');

var _grid = require('./grid');

var _utils = require('./utils');

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

  var instance = { id: (0, _utils.getId)('r'), name: (0, _utils.getFuncName)(viewFunc) };
  var active = false;
  var internalStates = [];
  var subscriptions = [];
  var onUnmountCallbacks = [];
  var externals = {};

  var _state = (0, _state8.createState)({}),
      _state2 = _slicedToArray(_state, 1),
      input = _state2[0];

  var _state3 = (0, _state8.createState)({}),
      _state4 = _slicedToArray(_state3, 1),
      output = _state4[0];

  var _state5 = (0, _state8.createState)({}),
      _state6 = _slicedToArray(_state5, 1),
      api = _state6[0];

  var isActive = function isActive() {
    return active;
  };
  var isSubscribed = function isSubscribed(s) {
    return !!subscriptions.find(function (effect) {
      return effect.state.id === s.id;
    });
  };

  // effects
  var updateOutput = output.mutate(function (current, newStuff) {
    var result = _extends({}, current);

    if (newStuff) {
      Object.keys(newStuff).forEach(function (key) {
        if ((0, _state8.isRiewQueueEffect)(newStuff[key]) && !newStuff[key].isMutating()) {
          var effect = newStuff[key];

          result[key] = effect();
          if (!isSubscribed(effect.state)) {
            subscriptions.push(effect.pipe(function () {
              return _render2(_defineProperty({}, key, effect()));
            }).subscribe());
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
    (0, _grid.gridRiewRender)([instance, value]);
  });
  var updateAPI = api.mutate(accumulate);
  var updateInput = input.mutate(accumulate);

  // defining the controller api
  updateAPI({
    state: function state() {
      var s = _state8.createState.apply(undefined, arguments);

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
        external = (0, _grid.gridGetNode)(key);
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
    output.teardown();
    api.teardown();
    internalStates.forEach(function (s) {
      return s.teardown();
    });
    internalStates = [];
    onUnmountCallbacks.filter(function (f) {
      return typeof f === 'function';
    }).forEach(function (f) {
      return f();
    });
    onUnmountCallbacks = [];
    subscriptions.forEach(function (s) {
      return s.unsubscribe();
    });
    subscriptions = [];
    return instance;
  };
  instance.__setExternals = function (maps) {
    externals = _extends({}, externals, normalizeExternalsMap(maps));
  };

  instance.with = function () {
    for (var _len2 = arguments.length, maps = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      maps[_key2] = arguments[_key2];
    }

    var newInstance = createRiew.apply(undefined, [viewFunc].concat(controllers));

    newInstance.__setExternals(maps);
    return newInstance;
  };
  instance.test = function (map) {
    var newInstance = createRiew.apply(undefined, [viewFunc].concat(controllers));

    newInstance.__setExternals([map]);
    return newInstance;
  };

  return instance;
}

},{"./grid":1,"./state":7,"./utils":13}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.implementIterable = undefined;

exports.default = function (state) {
  var queueMethods = [];
  var queueAPI = {};
  var effects = [];
  var active = true;

  function createNewEffect() {
    var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var exportedAs = void 0;

    var effect = function effect() {
      if (!active || effect.__itemsToCreate.length === 0) return state.get();
      var queue = (0, _queue2.default)(state.set, state.get, function () {
        effect.__queues = effect.__queues.filter(function (_ref) {
          var id = _ref.id;
          return queue.id !== id;
        });
      }, function (q) {
        (0, _grid.gridEffectQueueStep)([effect, q]);
      }, queueAPI);

      effect.__queues.push(queue);
      effect.__itemsToCreate.forEach(function (_ref2) {
        var type = _ref2.type,
            func = _ref2.func;
        return queue.add(type, func);
      });
      return queue.process.apply(queue, arguments);
    };

    effects.push(effect);
    implementIterable(effect);

    effect.id = (0, _utils.getId)('e');
    effect.state = state;
    effect.__queues = [];
    effect.__riewEffect = true;
    effect.__itemsToCreate = [].concat(_toConsumableArray(items));
    effect.__listeners = state.listeners;

    // queue methods
    queueMethods.forEach(function (m) {
      effect[m] = function () {
        for (var _len = arguments.length, methodArgs = Array(_len), _key = 0; _key < _len; _key++) {
          methodArgs[_key] = arguments[_key];
        }

        return createNewEffect([].concat(_toConsumableArray(effect.__itemsToCreate), [{ type: m, func: methodArgs }]));
      };
    });

    // effect direct methods
    effect.define = function (methodName, func) {
      defineQueueMethod(methodName, func);
      return effect;
    };
    effect.isMutating = function () {
      return !!effect.__itemsToCreate.find(function (_ref3) {
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
    effect.cancel = function () {
      effect.__queues.forEach(function (q) {
        return q.cancel();
      });
      return effect;
    };
    effect.cleanUp = function () {
      effect.cancel();
      effect.unsubscribe();
      if (exportedAs) (0, _grid.gridFreeNode)(exportedAs);
    };
    effect.teardown = function () {
      active = false;
      state.teardown();
      effects.forEach(function (t) {
        return t.cleanUp();
      });
      effects = [effect];
      return effect;
    };
    effect.export = function (name) {
      // if already exported with different key
      if (exportedAs) (0, _grid.gridFreeNode)(exportedAs);
      (0, _grid.gridAddEffect)(effect);
      (0, _grid.gridSetNodeName)(effect, exportedAs = name);
      return effect;
    };
    effect.isActive = function () {
      return active;
    };
    effect.test = function (callback) {
      var testTrigger = createNewEffect([].concat(_toConsumableArray(effect.__itemsToCreate)));
      var tools = {
        setValue: function setValue(newValue) {
          testTrigger.__itemsToCreate = [{ type: 'map', func: [function () {
              return newValue;
            }] }].concat(_toConsumableArray(testTrigger.__itemsToCreate));
        },
        swap: function swap(index, funcs, type) {
          if (!Array.isArray(funcs)) funcs = [funcs];
          testTrigger.__itemsToCreate[index].func = funcs;
          if (type) {
            testTrigger.__itemsToCreate[index].type = type;
          }
        },
        swapFirst: function swapFirst(funcs, type) {
          tools.swap(0, funcs, type);
        },
        swapLast: function swapLast(funcs, type) {
          tools.swap(testTrigger.__itemsToCreate.length - 1, funcs, type);
        }
      };

      callback(tools);

      return testTrigger;
    };

    return effect;
  };

  function defineQueueMethod(methodName, func) {
    queueMethods.push(methodName);
    queueAPI[methodName] = function (q, args, payload, next) {
      var result = func.apply(undefined, _toConsumableArray(args))(q.result, payload, next, q);

      if ((0, _utils.isPromise)(result)) {
        return result.then(next);
      }
      return next(result);
    };
    effects.forEach(function (t) {
      t[methodName] = function () {
        for (var _len2 = arguments.length, methodArgs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          methodArgs[_key2] = arguments[_key2];
        }

        return createNewEffect([].concat(_toConsumableArray(t.__itemsToCreate), [{ type: methodName, func: methodArgs }]));
      };
    });
  };

  defineQueueMethod('pipe', _pipe2.default);
  defineQueueMethod('map', _map2.default);
  defineQueueMethod('mapToKey', _mapToKey2.default);
  defineQueueMethod('mutate', _mutate2.default);
  defineQueueMethod('filter', _filter2.default);

  return createNewEffect;
};

var _utils = require('../utils');

var _grid = require('../grid');

var _pipe = require('./pipe');

var _pipe2 = _interopRequireDefault(_pipe);

var _map = require('./map');

var _map2 = _interopRequireDefault(_map);

var _mapToKey = require('./mapToKey');

var _mapToKey2 = _interopRequireDefault(_mapToKey);

var _mutate = require('./mutate');

var _mutate2 = _interopRequireDefault(_mutate);

var _filter = require('./filter');

var _filter2 = _interopRequireDefault(_filter);

var _queue = require('./queue');

var _queue2 = _interopRequireDefault(_queue);

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

var implementIterable = exports.implementIterable = function implementIterable(obj) {
  if (typeof Symbol !== 'undefined' && typeof Symbol.iterator !== 'undefined') {
    obj[Symbol.iterator] = function () {
      var values = [obj.map(), obj.mutate(), obj];
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

;

},{"../grid":1,"../utils":13,"./filter":6,"./map":8,"./mapToKey":9,"./mutate":10,"./pipe":11,"./queue":12}],6:[function(require,module,exports){
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
  return function (intermediateValue, payload, next, q) {
    var filterResult = func.apply(undefined, [intermediateValue].concat(_toConsumableArray(payload)));

    if ((0, _utils.isPromise)(filterResult)) {
      return filterResult.then(function (asyncResult) {
        if (!asyncResult) {
          q.index = q.items.length;
        }
        return next(intermediateValue);
      });
    }
    if (!filterResult) {
      q.index = q.items.length;
    }
    return next(intermediateValue);
  };
}

},{"../utils":13}],7:[function(require,module,exports){
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

exports.createState = createState;
exports.mergeStates = mergeStates;
exports.isRiewQueueEffect = isRiewQueueEffect;

var _fastDeepEqual = require('fast-deep-equal');

var _fastDeepEqual2 = _interopRequireDefault(_fastDeepEqual);

var _effect = require('./effect');

var _effect2 = _interopRequireDefault(_effect);

var _utils = require('../utils');

var _grid = require('../grid');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function State(initialValue) {
  var s = {};
  var value = initialValue;
  var listeners = [];

  s.id = (0, _utils.getId)('s');
  s.triggerListeners = function () {
    listeners.forEach(function (l) {
      return l();
    });
  };

  s.get = function () {
    return value;
  };
  s.set = function (newValue) {
    var isEqual = (0, _fastDeepEqual2.default)(value, newValue);

    value = newValue;
    if (!isEqual) s.triggerListeners();
  };
  s.teardown = function () {
    listeners = [];
    (0, _grid.gridFreeNode)(s.id);
  };
  s.listeners = function () {
    return listeners;
  };
  s.addListener = function (effect) {
    listeners.push(effect);
  };
  s.removeListener = function (effect) {
    listeners = listeners.filter(function (_ref) {
      var id = _ref.id;
      return id !== effect.id;
    });
  };

  (0, _grid.gridAddState)(s);

  return s;
};

function createState(initialValue) {
  return (0, _effect2.default)(State(initialValue))();
};

function mergeStates(statesMap) {
  var fetchSourceValues = function fetchSourceValues() {
    return Object.keys(statesMap).reduce(function (result, key) {
      var _statesMap$key = _slicedToArray(statesMap[key], 1),
          s = _statesMap$key[0];

      result[key] = s();
      return result;
    }, {});
  };
  var effect = createState();

  effect.state.get = fetchSourceValues;
  effect.state.set = function (newValue) {
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
    statesMap[key].pipe(effect.state.triggerListeners).subscribe();
  });

  return effect;
}

function isRiewQueueEffect(func) {
  return func && func.__riewEffect === true;
}

},{"../grid":1,"../utils":13,"./effect":5,"fast-deep-equal":14}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = map;

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

function map(func) {
  return function (intermediateValue, payload, next) {
    var result = (func || function (value) {
      return value;
    }).apply(undefined, [intermediateValue].concat(_toConsumableArray(payload)));

    if ((0, _utils.isPromise)(result)) {
      return result.then(next);
    }
    return next(result);
  };
};

},{"../utils":13}],9:[function(require,module,exports){
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
  return function (intermediateValue, payload, next) {
    var mappingFunc = function mappingFunc(value) {
      return _defineProperty({}, key, value);
    };

    return next(mappingFunc.apply(undefined, [intermediateValue].concat(_toConsumableArray(payload))));
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
  return function (intermediateValue, payload, next, q) {
    var result = (func || function (current, payload) {
      return payload;
    }).apply(undefined, [intermediateValue].concat(_toConsumableArray(payload)));

    if ((0, _utils.isPromise)(result)) {
      return result.then(function (asyncResult) {
        q.setStateValue(asyncResult);
        return next(asyncResult);
      });
    }
    q.setStateValue(result);
    return next(result);
  };
};

},{"../utils":13}],11:[function(require,module,exports){
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
  return function (intermediateValue, payload, next) {
    var result = (func || function () {}).apply(undefined, [intermediateValue].concat(_toConsumableArray(payload)));

    if ((0, _utils.isPromise)(result)) {
      return result.then(function () {
        return next(intermediateValue);
      });
    }
    return next(intermediateValue);
  };
};

},{"../utils":13}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createQueue;

var _utils = require('../utils');

function createQueue(setStateValue, getStateValue) {
  var onDone = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
  var onStep = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};
  var queueAPI = arguments[4];

  var q = {
    id: (0, _utils.getId)('q'),
    index: 0,
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

      function next(lastResult) {
        q.result = lastResult;
        q.index++;
        if (q.index < q.items.length) {
          return loop();
        }
        onDone();
        return q.result;
      };
      function loop() {
        var _q$items$q$index = q.items[q.index],
            type = _q$items$q$index.type,
            func = _q$items$q$index.func;

        var logic = queueAPI[type];

        if (logic) {
          var r = logic(q, func, payload, next);

          onStep(q);
          return r;
        }
        throw new Error('Unsupported method "' + type + '".');
      };

      return q.items.length > 0 ? loop() : q.result;
    },
    cancel: function cancel() {
      q.items = [];
    }
  };

  return q;
}

},{"../utils":13}],13:[function(require,module,exports){
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
  return '@@' + prefix + ++ids;
};

},{}],14:[function(require,module,exports){
'use strict';

var isArray = Array.isArray;
var keyList = Object.keys;
var hasProp = Object.prototype.hasOwnProperty;

module.exports = function equal(a, b) {
  if (a === b) return true;

  var arrA = isArray(a)
    , arrB = isArray(b)
    , i
    , length
    , key;

  if (arrA && arrB) {
    length = a.length;
    if (length != b.length) return false;
    for (i = 0; i < length; i++)
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

  if (a instanceof Object && b instanceof Object) {
    var keys = keyList(a);
    length = keys.length;

    if (length !== keyList(b).length)
      return false;

    for (i = 0; i < length; i++)
      if (!hasProp.call(b, keys[i])) return false;

    for (i = 0; i < length; i++) {
      key = keys[i];
      if (!equal(a[key], b[key])) return false;
    }

    return true;
  }

  return false;
};

},{}]},{},[2])(2)
});
