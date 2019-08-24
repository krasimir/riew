(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Rine = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.react = exports.compose = exports.merge = exports.state = undefined;

var _state = require('./state');

var _react = require('./react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('./utils');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var state = exports.state = _state.createState;
var merge = exports.merge = _state.mergeStates;
var compose = exports.compose = _utils.compose;
var react = exports.react = { routine: _react2.default };

},{"./react":2,"./state":3,"./utils":4}],2:[function(require,module,exports){
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

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
}; /* eslint-disable no-return-assign */

exports.createRoutineInstance = createRoutineInstance;
exports.default = routine;

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _utils = require('../utils');

var _state2 = require('../state');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var ids = 0;
var getId = function getId() {
  return '@@r' + ++ids;
};

function createRoutineInstance(routineFunc) {
  var id = getId();
  var mounted = false;
  var outerProps = (0, _state2.createState)();
  var setOuterProps = outerProps.mutate();
  var permanentProps = {};
  var funcsToCallOnUnmount = [];
  var onRendered = void 0;

  function isMounted() {
    return mounted;
  }
  function preserveProps(props) {
    return permanentProps = _extends({}, permanentProps, props);
  }

  var instance = {
    __rine: 'routine',
    id: id,
    name: (0, _utils.getFuncName)(routineFunc),
    isMounted: isMounted,
    in: function _in(initialProps, Component, setContent) {
      mounted = true;
      setOuterProps(initialProps);
      routineFunc({
        render: function render(props) {
          if (!mounted) return Promise.resolve();
          if (typeof props === 'string' || typeof props === 'number' || _react2.default.isValidElement(props)) {
            setContent(props);
          } else if (props === null) {
            setContent(function () {
              return null;
            });
          } else {
            setContent(_react2.default.createElement(Component, preserveProps(props)));
          }
          return new Promise(function (done) {
            return onRendered = done;
          });
        },

        props: outerProps.stream,
        state: function state() {
          var s = _state2.createState.apply(undefined, arguments);

          funcsToCallOnUnmount.push(s.teardown);
          return s;
        },

        isMounted: isMounted
      });
    },
    updated: function updated(newProps) {
      setOuterProps(newProps);
    },
    rendered: function rendered() {
      if (onRendered) onRendered();
    },
    out: function out() {
      mounted = false;
      funcsToCallOnUnmount.forEach(function (f) {
        return f();
      });
      funcsToCallOnUnmount = [];
    }
  };

  funcsToCallOnUnmount.push(outerProps.teardown);

  return instance;
}

function routine(routineFunc) {
  var Component = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
    return null;
  };
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { createRoutineInstance: createRoutineInstance };

  var RoutineBridge = function RoutineBridge(outerProps) {
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
      if (instance) instance.updated(outerProps);
    }, [outerProps]);

    // to support sync rendering (i.e. await render(...))
    (0, _react.useEffect)(function () {
      if (instance) instance.rendered();
    }, [content]);

    // mounting
    (0, _react.useEffect)(function () {
      setInstance(instance = options.createRoutineInstance(routineFunc));

      instance.in(outerProps, Component, setContent);

      return function () {
        instance.out();
      };
    }, []);

    return content;
  };

  RoutineBridge.displayName = 'Routine(' + (0, _utils.getFuncName)(routineFunc) + ')';

  return RoutineBridge;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../state":3,"../utils":4}],3:[function(require,module,exports){
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

exports.createState = createState;
exports.mergeStates = mergeStates;

var _utils = require('./utils');

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
} /* eslint-disable no-use-before-define, no-return-assign */

var ids = 0;
var getId = function getId() {
  return '@@s' + ++ids;
};

var Queue = function Queue(setStateValue, getStateValue) {
  var predefinedItems = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  var items = [].concat(_toConsumableArray(predefinedItems));

  return {
    add: function add(type, func) {
      items.push({ type: type, func: func });
    },
    process: function process(payload) {
      var index = 0;
      var result = getStateValue();

      function next() {
        index++;
        if (index < items.length) {
          return loop();
        }
        return result;
      };
      function loop() {
        var _items$index = items[index],
            type = _items$index.type,
            func = _items$index.func;

        switch (type) {
          /* -------------------------------------------------- pipe */
          case 'pipe':
            var pipeResult = (func[0] || function () {}).apply(undefined, [result].concat(_toConsumableArray(payload)));

            if ((0, _utils.isPromise)(pipeResult)) {
              return pipeResult.then(next);
            }
            return next();
          /* -------------------------------------------------- map */
          case 'map':
            result = (func[0] || function (value) {
              return value;
            }).apply(undefined, [result].concat(_toConsumableArray(payload)));
            if ((0, _utils.isPromise)(result)) {
              return result.then(function (asyncResult) {
                result = asyncResult;
                return next();
              });
            }
            return next();
          /* -------------------------------------------------- map */
          case 'mapToKey':
            var mappingFunc = function mappingFunc(value) {
              return _defineProperty({}, func[0], value);
            };

            result = mappingFunc.apply(undefined, [result].concat(_toConsumableArray(payload)));
            return next();
          /* -------------------------------------------------- mutate */
          case 'mutate':
            result = (func[0] || function (current, payload) {
              return payload;
            }).apply(undefined, [result].concat(_toConsumableArray(payload)));
            if ((0, _utils.isPromise)(result)) {
              return result.then(function (asyncResult) {
                result = asyncResult;
                setStateValue(result);
                return next();
              });
            }
            setStateValue(result);
            return next();
          /* -------------------------------------------------- filter */
          case 'filter':
            var filterResult = func[0].apply(func, [result].concat(_toConsumableArray(payload)));

            if ((0, _utils.isPromise)(filterResult)) {
              return filterResult.then(function (asyncResult) {
                if (!asyncResult) {
                  index = items.length;
                }
                return next();
              });
            }
            if (!filterResult) {
              index = items.length;
            }
            return next();
          /* -------------------------------------------------- parallel */
          case 'parallel':
            result = func.map(function (f) {
              return f.apply(undefined, [result].concat(_toConsumableArray(payload)));
            });
            var promises = result.filter(_utils.isPromise);

            if (promises.length > 0) {
              return Promise.all(promises).then(function () {
                result.forEach(function (r, index) {
                  if ((0, _utils.isPromise)(r)) {
                    r.then(function (value) {
                      return result[index] = value;
                    });
                  }
                });
                return next();
              });
            }
            return next();
          /* -------------------------------------------------- branch */
          case 'branch':
            var conditionResult = func[0].apply(func, [result].concat(_toConsumableArray(payload)));
            var runTruthy = function runTruthy(value) {
              if (value) {
                var r = func[1].apply(func, [result].concat(_toConsumableArray(payload)));

                index = items.length;
                return (0, _utils.isPromise)(r) ? r.then(next) : next();
              }
              return next();
            };

            if ((0, _utils.isPromise)(conditionResult)) {
              return conditionResult.then(runTruthy);
            }
            return runTruthy(conditionResult);
          /* -------------------------------------------------- cancel */
          case 'cancel':
            index = -1;
            items = [];
            return result;

        }
        /* -------------------------------------------------- error */
        throw new Error('Unsupported method "' + type + '".');
      };

      return items.length > 0 ? loop() : result;
    },
    cancel: function cancel() {
      items = [];
    },
    clone: function clone() {
      return Queue(setStateValue, getStateValue, items);
    }
  };
};

function createState(initialValue) {
  var value = initialValue;

  var methods = ['pipe', 'map', 'mutate', 'filter', 'parallel', 'branch', 'cancel', 'mapToKey'];
  var stateAPI = {};
  var createdQueues = [];
  var listeners = [];

  var createQueue = function createQueue(typeOfFirstItem, func) {
    var queue = Queue(stateAPI.__set, stateAPI.__get);
    var api = function api() {
      for (var _len = arguments.length, payload = Array(_len), _key = 0; _key < _len; _key++) {
        payload[_key] = arguments[_key];
      }

      return queue.process(payload);
    };

    queue.add(typeOfFirstItem, func);
    api.fork = function () {
      return createQueue(typeOfFirstItem, func);
    };
    methods.forEach(function (methodName) {
      api[methodName] = function () {
        for (var _len2 = arguments.length, func = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          func[_key2] = arguments[_key2];
        }

        queue.add(methodName, func);
        return api;
      };
    });
    createdQueues.push(queue);
    return api;
  };

  stateAPI.__id = getId();
  stateAPI.__get = function () {
    return value;
  };
  stateAPI.__set = function (newValue) {
    value = newValue;
    stateAPI.__triggerListeners();
  };
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

  stateAPI.set = function (newValue) {
    return stateAPI.mutate()(newValue);
  };
  stateAPI.get = function () {
    return stateAPI.map()();
  };
  stateAPI.teardown = function () {
    methods.forEach(function (methodName) {
      return stateAPI[methodName] = function () {};
    });
    createdQueues.forEach(function (q) {
      return q.cancel();
    });
    createdQueues = [];
    listeners = [];
  };
  stateAPI.stream = function () {
    return stateAPI.__get();
  };

  methods.forEach(function (methodName) {
    stateAPI[methodName] = function () {
      for (var _len3 = arguments.length, func = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        func[_key3] = arguments[_key3];
      }

      return createQueue(methodName, func);
    };
    stateAPI.stream[methodName] = function () {
      for (var _len4 = arguments.length, func = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        func[_key4] = arguments[_key4];
      }

      var q = createQueue(methodName, func);

      listeners.push(q);
      return q;
    };
  });

  return stateAPI;
};

function mergeStates(statesMap) {
  var fetchSourceValues = function fetchSourceValues() {
    return Object.keys(statesMap).reduce(function (result, key) {
      result[key] = statesMap[key].__get();
      return result;
    }, {});
  };
  var s = createState(fetchSourceValues());

  s.__set = function (newValue) {
    if ((typeof newValue === 'undefined' ? 'undefined' : _typeof(newValue)) !== 'object') {
      throw new Error('Wrong merged state value. Must be key-value pairs.');
    }
    Object.keys(newValue).forEach(function (key) {
      statesMap[key].__set(newValue[key]);
    });
  };
  s.__get = fetchSourceValues;

  Object.keys(statesMap).forEach(function (key) {
    statesMap[key].stream.pipe(s.__triggerListeners);
  });

  return s;
}

},{"./utils":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var isGenerator = exports.isGenerator = function isGenerator(obj) {
  return obj && typeof obj['next'] === 'function';
};
var isPromise = exports.isPromise = function isPromise(obj) {
  return obj && typeof obj['then'] === 'function';
};
var getFuncName = exports.getFuncName = function getFuncName(func) {
  if (func.name) return func.name;
  var result = /^function\s+([\w\$]+)\s*\(/.exec(func.toString());

  return result ? result[1] : 'unknown';
};
var compose = exports.compose = function compose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  return function () {
    for (var _len2 = arguments.length, payload = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      payload[_key2] = arguments[_key2];
    }

    return funcs.forEach(function (f) {
      return f.apply(undefined, payload);
    });
  };
};

},{}]},{},[1])(1)
});
