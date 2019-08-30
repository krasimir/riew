(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Rine = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.react = exports.riew = exports.merge = exports.state = undefined;

var _state = require('./state');

var _riew = require('./riew');

var _riew2 = _interopRequireDefault(_riew);

var _react = require('./react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var state = exports.state = _state.createState;
var merge = exports.merge = _state.mergeStates;
var riew = exports.riew = _riew2.default;
var react = exports.react = { riew: _react2.default };

},{"./react":2,"./riew":3,"./state":4}],2:[function(require,module,exports){
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

function riew(controller, View) {
  if (typeof View === 'undefined') {
    View = controller;
    controller = function controller() {};
  }
  var createBridge = function createBridge() {
    var map = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var stateMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    var comp = function comp(outerProps) {
      var _useState = (0, _react.useState)(null),
          _useState2 = _slicedToArray(_useState, 2),
          instance = _useState2[0],
          setInstance = _useState2[1];

      var _useState3 = (0, _react.useState)({ content: null, done: function done() {} }),
          _useState4 = _slicedToArray(_useState3, 2),
          content = _useState4[0],
          setContent = _useState4[1];

      // updating props


      (0, _react.useEffect)(function () {
        if (instance) instance.update(outerProps);
      }, [outerProps]);

      // to support sync rendering (i.e. await render(...))
      (0, _react.useEffect)(function () {
        if (instance) content.done();
      }, [content]);

      // mounting
      (0, _react.useEffect)(function () {
        instance = (0, _riew2.default)(function (props, done) {
          if (props === null) {
            setContent({ content: null, done: done });
          } else {
            setContent({ content: _react2.default.createElement(View, props), done: done });
          }
        }, controller);

        if (map !== null) {
          instance = instance.with(map);
        }
        if (stateMap !== null) {
          instance = instance.withState(stateMap);
        }
        setInstance(instance);
        instance.in(outerProps);

        return function () {
          instance.out();
        };
      }, []);

      return content.content;
    };

    comp.displayName = 'Riew(' + (0, _utils.getFuncName)(controller) + ')';
    comp.with = function (map) {
      return createBridge(map);
    };
    comp.withState = function (map) {
      return createBridge(null, map);
    };

    return comp;
  };

  return createBridge();
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../riew":3,"../utils":5}],3:[function(require,module,exports){
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

var _state = require('./state');

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }return obj;
}

function noop() {};
function objectRequired(value, method) {
  if (value === null || typeof value !== 'undefined' && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
    throw new Error('The riew\'s "' + method + '" method must be called with a key-value object. Instead "' + value + '" passed.');
  }
}

function createRiew(viewFunc) {
  var controllerFunc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
  var externals = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var instance = {};
  var active = false;
  var onOutCallbacks = [];
  var onRender = noop;
  var isActive = function isActive() {
    return active;
  };
  var riewProps = (0, _state.createState)({});
  var updateRiewProps = riewProps.mutate(function (current, newProps) {
    return _extends({}, current, newProps);
  });
  var viewProps = (0, _state.createState)({});
  var updateViewProps = viewProps.mutate(function (current, newProps) {
    return _extends({}, current, newProps);
  });
  var controllerProps = (0, _state.createState)({
    render: function render(props) {
      objectRequired(props, 'render');
      if (!active) return Promise.resolve();
      return new Promise(function (done) {
        onRender = done;
        updateViewProps(props);
      });
    },

    props: riewProps,
    isActive: isActive
  });
  var updateControllerProps = controllerProps.mutate(function (current, newProps) {
    return _extends({}, current, newProps);
  });

  function callView() {
    viewFunc(viewProps.get(), onRender);
    onRender = noop;
  }
  function processExternals() {
    Object.keys(externals).forEach(function (key) {
      var isState = (0, _state.isRineState)(externals[key]);
      var isTrigger = (0, _state.isRineQueueTrigger)(externals[key]);
      var s = void 0;

      // passing a state
      if (isState) {
        s = externals[key];
        updateControllerProps(_defineProperty({}, key, s));
        updateViewProps(_defineProperty({}, key, s.get()));
        s.stream.pipe(function (value) {
          return updateViewProps(_defineProperty({}, key, value));
        });

        // passing a trigger
      } else if (isTrigger) {
        var trigger = externals[key];

        if (trigger.__activity() === _state.MUTABLE) {
          throw new Error('Triggers that mutate state can not be sent to the riew. This area is meant only for triggers that fetch data. If you need to pass such triggers use the controller to do that.');
        }

        trigger.__state.stream.filter(isActive).pipe(function () {
          return updateViewProps(_defineProperty({}, key, trigger()));
        })();

        // raw data that is converted to a state
      } else if (key.charAt(0) === '$') {
        var k = key.substr(1, key.length);

        s = (0, _state.createState)(externals[key]);
        onOutCallbacks.push(s.teardown);
        updateControllerProps(_defineProperty({}, k, s));
        updateViewProps(_defineProperty({}, k, s.get()));
        s.stream.filter(isActive).pipe(function (value) {
          return updateViewProps(_defineProperty({}, k, value));
        });

        // proxy the rest
      } else {
        updateControllerProps(_defineProperty({}, key, externals[key]));
        updateViewProps(_defineProperty({}, key, externals[key]));
      }
    });
  }

  instance.isActive = isActive;
  instance.in = function () {
    var initialProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    active = true;
    objectRequired(initialProps, 'in');
    updateRiewProps(initialProps);
    processExternals();

    var controllerResult = controllerFunc(controllerProps.get());

    if (controllerResult) {
      if ((typeof controllerResult === 'undefined' ? 'undefined' : _typeof(controllerResult)) !== 'object') {
        throw new Error('You must return a key-value object from your controller.');
      }
      updateViewProps(controllerResult);
    }
    riewProps.stream();
    viewProps.stream.pipe(callView)();
    return instance;
  };
  instance.update = updateRiewProps;
  instance.out = function () {
    onOutCallbacks.forEach(function (f) {
      return f();
    });
    onOutCallbacks = [];
    riewProps.teardown();
    viewProps.teardown();
    controllerProps.teardown();
    active = false;
    return instance;
  };
  instance.with = function (map) {
    return createRiew(viewFunc, controllerFunc, _extends({}, externals, map));
  };
  instance.withState = function (map) {
    return createRiew(viewFunc, controllerFunc, Object.keys(map).reduce(function (obj, key) {
      return obj['$' + key] = map[key], obj;
    }, externals));
  };
  instance.test = function (map) {
    return createRiew(viewFunc, controllerFunc, _extends({}, externals, map));
  };

  return instance;
}

},{"./state":4}],4:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MUTABLE = exports.IMMUTABLE = undefined;

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

exports.createState = createState;
exports.mergeStates = mergeStates;
exports.createStream = createStream;
exports.isRineState = isRineState;
exports.isRineQueueTrigger = isRineQueueTrigger;

var _utils = require('./utils');

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

var IMMUTABLE = exports.IMMUTABLE = 'IMMUTABLE';
var MUTABLE = exports.MUTABLE = 'MUTABLE';

var ids = 0;
var getId = function getId(prefix) {
  return '@@' + prefix + ++ids;
};
var queueMethods = ['pipe', 'map', 'mutate', 'filter', 'parallel', 'cancel', 'mapToKey'];
var getTriggerActivity = function getTriggerActivity(items) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;

      if (item.type === 'mutate') return MUTABLE;
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

  return IMMUTABLE;
};

function createQueue(setStateValue, getStateValue) {
  var onDone = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

  var q = {
    index: 0,
    result: getStateValue(),
    id: getId('q'),
    items: [],
    add: function add(type, func) {
      this.items.push({ type: type, func: func, name: func.map(_utils.getFuncName) });
    },
    process: function process() {
      for (var _len = arguments.length, payload = Array(_len), _key = 0; _key < _len; _key++) {
        payload[_key] = arguments[_key];
      }

      var items = q.items;
      var resetItems = function resetItems() {
        return q.items = [];
      };

      q.index = 0;

      function next() {
        q.index++;
        if (q.index < items.length) {
          return loop();
        }
        onDone(q);
        return q.result;
      };
      function loop() {
        var _items$q$index = items[q.index],
            type = _items$q$index.type,
            func = _items$q$index.func;

        switch (type) {
          /* -------------------------------------------------- pipe */
          case 'pipe':
            var pipeResult = (func[0] || function () {}).apply(undefined, [q.result].concat(payload));

            if ((0, _utils.isPromise)(pipeResult)) {
              return pipeResult.then(next);
            }
            return next();
          /* -------------------------------------------------- map */
          case 'map':
            q.result = (func[0] || function (value) {
              return value;
            }).apply(undefined, [q.result].concat(payload));
            if ((0, _utils.isPromise)(q.result)) {
              return q.result.then(function (asyncResult) {
                q.result = asyncResult;
                return next();
              });
            }
            return next();
          /* -------------------------------------------------- map */
          case 'mapToKey':
            var mappingFunc = function mappingFunc(value) {
              return _defineProperty({}, func[0], value);
            };

            q.result = mappingFunc.apply(undefined, [q.result].concat(payload));
            return next();
          /* -------------------------------------------------- mutate */
          case 'mutate':
            q.result = (func[0] || function (current, payload) {
              return payload;
            }).apply(undefined, [q.result].concat(payload));
            if ((0, _utils.isPromise)(q.result)) {
              return q.result.then(function (asyncResult) {
                q.result = asyncResult;
                setStateValue(q.result);
                return next();
              });
            }
            setStateValue(q.result);
            return next();
          /* -------------------------------------------------- filter */
          case 'filter':
            var filterResult = func[0].apply(func, [q.result].concat(payload));

            if ((0, _utils.isPromise)(filterResult)) {
              return filterResult.then(function (asyncResult) {
                if (!asyncResult) {
                  q.index = items.length;
                }
                return next();
              });
            }
            if (!filterResult) {
              q.index = items.length;
            }
            return next();
          /* -------------------------------------------------- parallel */
          case 'parallel':
            q.result = func.map(function (f) {
              return f.apply(undefined, [q.result].concat(payload));
            });
            var promises = q.result.filter(_utils.isPromise);

            if (promises.length > 0) {
              return Promise.all(promises).then(function () {
                q.result.forEach(function (r, index) {
                  if ((0, _utils.isPromise)(r)) {
                    r.then(function (value) {
                      return q.result[index] = value;
                    });
                  }
                });
                return next();
              });
            }
            return next();
          /* -------------------------------------------------- cancel */
          case 'cancel':
            q.index = -1;
            resetItems();
            return q.result;

        }
        /* -------------------------------------------------- error */
        throw new Error('Unsupported method "' + type + '".');
      };

      return items.length > 0 ? loop() : q.result;
    },
    cancel: function cancel() {
      this.items = [];
    }
  };

  return q;
}

function createState(initialValue) {
  var value = initialValue;
  var stateAPI = {};
  var createdQueues = [];
  var listeners = [];
  var active = true;

  stateAPI.id = getId('s');
  stateAPI.__rine = true;
  stateAPI.__triggerListeners = function () {
    return listeners.forEach(function (l) {
      return l();
    });
  };
  stateAPI.__listeners = function () {
    return listeners;
  };
  stateAPI.__queues = function () {
    return createdQueues;
  };

  stateAPI.active = function () {
    return active;
  };
  stateAPI.get = function () {
    return value;
  };
  stateAPI.set = function (newValue) {
    var callListeners = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    value = newValue;
    if (callListeners) stateAPI.__triggerListeners();
  };
  stateAPI.teardown = function () {
    createdQueues.forEach(function (q) {
      return q.cancel();
    });
    createdQueues = [];
    listeners = [];
    active = false;
  };
  stateAPI.stream = createStreamObj();

  function createStreamObj() {
    return function () {
      if (arguments.length > 0) {
        stateAPI.set(arguments.length <= 0 ? undefined : arguments[0]);
      } else {
        stateAPI.__triggerListeners();
      }
    };
  }
  function removeListener(_ref2) {
    var toRemove = _ref2.id;

    listeners = listeners.filter(function (_ref3) {
      var id = _ref3.id;
      return id !== toRemove;
    });
  }
  function createNewTrigger() {
    var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var isStream = arguments[1];
    var previousTrigger = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    var trigger = function trigger() {
      if (active === false) return stateAPI.get();
      var queue = createQueue(stateAPI.set, stateAPI.get, function (q) {
        return createdQueues = createdQueues.filter(function (_ref4) {
          var id = _ref4.id;
          return q.id !== id;
        });
      });

      createdQueues.push(queue);
      trigger.__itemsToCreate.forEach(function (_ref5) {
        var type = _ref5.type,
            func = _ref5.func;
        return queue.add(type, func);
      });
      return queue.process.apply(queue, arguments);
    };
    var addQueueMethods = function addQueueMethods(newTrigger, currentTrigger, isStream) {
      queueMethods.forEach(function (m) {
        newTrigger[m] = function () {
          for (var _len2 = arguments.length, func = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            func[_key2] = arguments[_key2];
          }

          return createNewTrigger([].concat(_toConsumableArray(items), [{ type: m, func: func }]), isStream, currentTrigger);
        };
      });
    };

    trigger.id = getId('t');
    trigger.stream = createStreamObj();
    trigger.__rineTrigger = true;
    trigger.__itemsToCreate = [].concat(_toConsumableArray(items));
    trigger.__state = stateAPI;
    trigger.__activity = function () {
      return getTriggerActivity(trigger.__itemsToCreate);
    };

    // queue methods
    addQueueMethods(trigger, trigger, isStream);
    addQueueMethods(trigger.stream, trigger, true);

    // not supported in queue methods
    ['set', 'get', 'teardown'].forEach(function (stateMethod) {
      trigger[stateMethod] = function () {
        throw new Error('"' + stateMethod + '" is not a queue method but a method of the state object.');
      };
    });

    // other methods
    trigger.test = function (callback) {
      var testTrigger = createNewTrigger([].concat(_toConsumableArray(items)), isStream, trigger);
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

    if (isStream) {
      listeners.push(trigger);
      if (previousTrigger) removeListener(previousTrigger);
    }

    return trigger;
  }
  function enhanceToQueueAPI(obj, isStream) {
    queueMethods.forEach(function (methodName) {
      obj[methodName] = function () {
        for (var _len3 = arguments.length, func = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          func[_key3] = arguments[_key3];
        }

        return createNewTrigger([{ type: methodName, func: func }], isStream);
      };
    });
  };

  enhanceToQueueAPI(stateAPI);
  enhanceToQueueAPI(stateAPI.stream, true);

  return stateAPI;
};

function mergeStates(statesMap) {
  var fetchSourceValues = function fetchSourceValues() {
    return Object.keys(statesMap).reduce(function (result, key) {
      result[key] = statesMap[key].get();
      return result;
    }, {});
  };
  var s = createState(fetchSourceValues());

  s.set = function (newValue) {
    if ((typeof newValue === 'undefined' ? 'undefined' : _typeof(newValue)) !== 'object') {
      throw new Error('Wrong merged state value. Must be key-value pairs.');
    }
    Object.keys(newValue).forEach(function (key) {
      statesMap[key].set(newValue[key], false);
    });
    s.__triggerListeners();
  };
  s.get = fetchSourceValues;

  Object.keys(statesMap).forEach(function (key) {
    statesMap[key].stream.pipe(function () {
      s.__triggerListeners();
    });
  });

  return s;
}

function createStream(initialValue) {
  return createState(initialValue).stream;
}

function isRineState(obj) {
  return obj && obj.__rine === true;
}

function isRineQueueTrigger(func) {
  return func && func.__rineTrigger === true;
}

},{"./utils":5}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var isPromise = exports.isPromise = function isPromise(obj) {
  return obj && typeof obj['then'] === 'function';
};
var getFuncName = exports.getFuncName = function getFuncName(func) {
  if (func.name) return func.name;
  var result = /^function\s+([\w\$]+)\s*\(/.exec(func.toString());

  return result ? result[1] : 'unknown';
};

},{}]},{},[1])(1)
});
