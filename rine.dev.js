(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.rine = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint-disable consistent-return, no-new, no-use-before-define */

var ids = 0;
var getId = function getId() {
  return '@@t' + ++ids;
};

function Task(type, callback) {
  var once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var task = {
    __rine: 'task',
    id: getId(),
    active: true,
    once: once,
    type: type,
    callback: callback,
    done: null,
    teardown: function teardown() {
      this.active = false;
    },
    execute: function execute(payload, type) {
      if (this.active) {
        if (type) {
          this.callback(payload, type);
        } else {
          this.callback(payload);
        }
        if (this.once) {
          System.removeTasks([this]);
        }
      }
    }
  };

  if (!callback) {
    task.done = new Promise(function (donePromise) {
      task.callback = donePromise;
    });
  }

  return task;
}

var System = {
  tasks: [],
  addTask: function addTask(type, callback, once) {
    var task = Task(type, callback, once);

    this.tasks.push(task);
    return task;
  },
  removeTasks: function removeTasks(tasks) {
    var ids = tasks.reduce(function (map, task) {
      map[task.id] = true;
      return map;
    }, {});

    this.tasks = this.tasks.filter(function (task) {
      if (task.id in ids) {
        task.teardown();
        return false;
      }
      return true;
    });
  },
  put: function put(type, payload) {
    this.tasks.forEach(function (task) {
      if (task.type === type) {
        task.execute(payload);
      } else if (task.type === '*') {
        task.execute(payload, type);
      }
    });
  },
  take: function take(type, callback) {
    var _this = this;

    if (Array.isArray(type)) {
      return type.map(function (t) {
        return _this.addTask(t, callback, true);
      });
    }
    return this.addTask(type, callback, true);
  },
  takeEvery: function takeEvery(type, callback) {
    var _this2 = this;

    if (Array.isArray(type)) {
      return type.map(function (t) {
        return _this2.addTask(t, callback, false);
      });
    }
    return this.addTask(type, callback, false);
  },
  reset: function reset() {
    this.tasks = [];
  },
  isTask: function isTask(task) {
    return task && task.__rine === 'task';
  },
  putBulk: function putBulk(actions) {
    var _this3 = this;

    actions.forEach(function (type) {
      return _this3.put(type);
    });
  }
};

exports.default = System;

},{}],2:[function(require,module,exports){
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
}; /* eslint-disable consistent-return */

exports.mapStateToProps = mapStateToProps;
exports.connect = connect;

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _fastDeepEqual = require('fast-deep-equal');

var _fastDeepEqual2 = _interopRequireDefault(_fastDeepEqual);

var _utils = require('../utils');

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

function isRineState(value) {
  return value.__rine === 'state';
}
function getValueFromState(state) {
  return state.get();
}
function accumulateProps(map) {
  return Object.keys(map).reduce(function (props, key) {
    var value = map[key];

    if (isRineState(value)) {
      props[key] = getValueFromState(value);
    } else {
      props[key] = value;
    }
    return props;
  }, {});
}

function mapStateToProps(map, func) {
  var translate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (v) {
    return v;
  };
  var noInitialCall = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  var aprops = accumulateProps(map);

  if (noInitialCall === false) {
    func(translate(aprops));
  }

  var unsubscribers = Object.keys(map).map(function (key) {
    var value = map[key];

    if (isRineState(value)) {
      var state = value;

      return state.subscribe(function () {
        var newValue = getValueFromState(state);

        if (!(0, _fastDeepEqual2.default)(aprops[key], newValue)) {
          func(translate(aprops = _extends({}, aprops, _defineProperty({}, key, newValue))));
        }
      });
    }
  }).filter(function (unsubscribe) {
    return !!unsubscribe;
  });

  return function () {
    return unsubscribers.forEach(function (u) {
      return u();
    });
  };
}

function connect(Component, map) {
  var translate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (v) {
    return v;
  };

  function StateBridge(props) {
    var _useState = (0, _react.useState)(translate(accumulateProps(map))),
        _useState2 = _slicedToArray(_useState, 2),
        aprops = _useState2[0],
        setAProps = _useState2[1];

    (0, _react.useEffect)(function () {
      return mapStateToProps(map, setAProps, translate, true);
    }, []);

    return _react2.default.createElement(Component, _extends({}, aprops, props));
  }

  StateBridge.displayName = 'Connected(' + (0, _utils.getFuncName)(Component) + ')';
  return StateBridge;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../utils":6,"fast-deep-equal":7}],3:[function(require,module,exports){
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
};

exports.createRoutineInstance = createRoutineInstance;
exports.default = routine;

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _System = require('./System');

var _System2 = _interopRequireDefault(_System);

var _utils = require('../utils');

var _state = require('./state');

var _state2 = _interopRequireDefault(_state);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var ids = 0;
var getId = function getId() {
  return '@@r' + ++ids;
};
var unmountedAction = function unmountedAction(id) {
  return id + '_unmounted';
};
var updatedAction = function updatedAction(id) {
  return id + '_updated';
};

function createRoutineInstance(routineFunc) {
  var id = getId();
  var mounted = false;
  var tasksToRemove = [];
  var permanentProps = {};
  var actionsToFire = [];
  var onRendered = void 0;

  function isMounted() {
    return mounted;
  }
  function processProps(props) {
    var result = {};

    for (var key in props) {
      if (key.charAt(0) === '$') {
        permanentProps[key.substr(1, key.length)] = props[key];
      } else {
        result[key] = props[key];
      }
    }
    return _extends({}, permanentProps, result);
  }

  var instance = {
    __rine: 'routine',
    id: id,
    name: (0, _utils.getFuncName)(routineFunc),
    isMounted: isMounted,
    in: function _in(initialProps, Component, setContent) {
      mounted = true;
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
            setContent(_react2.default.createElement(Component, processProps(props)));
          }
          return new Promise(function (done) {
            return onRendered = done;
          });
        },
        onUpdated: function onUpdated(callback) {
          var task = _System2.default.takeEvery(updatedAction(id), callback);

          tasksToRemove.push(task);
          callback(initialProps);
        },
        put: function put() {
          return _System2.default.put.apply(_System2.default, arguments);
        },
        take: function take() {
          var task = _System2.default.take.apply(_System2.default, arguments);

          tasksToRemove.push(task);
          return task.done;
        },
        takeEvery: function takeEvery() {
          var task = _System2.default.takeEvery.apply(_System2.default, arguments);

          tasksToRemove.push(task);
          return task;
        },
        state: function state() {
          var state = _state2.default.apply(undefined, arguments);

          actionsToFire.push((0, _state.teardownAction)(state.id));
          return state;
        },

        isMounted: isMounted
      });
    },
    updated: function updated(newProps) {
      _System2.default.put(updatedAction(id), newProps);
    },
    rendered: function rendered() {
      if (onRendered) onRendered();
    },
    out: function out() {
      mounted = false;
    }
  };

  _System2.default.addTask(unmountedAction(id), function () {
    _System2.default.removeTasks(tasksToRemove);
    _System2.default.putBulk(actionsToFire);
  });

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
        _System2.default.put(unmountedAction(instance.id));
      };
    }, []);

    return content;
  };

  RoutineBridge.displayName = 'Routine(' + (0, _utils.getFuncName)(routineFunc) + ')';

  return RoutineBridge;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../utils":6,"./System":1,"./state":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isState = exports.teardownAction = undefined;
exports.default = createState;

var _System = require('./System');

var _System2 = _interopRequireDefault(_System);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var ids = 0;
var getId = function getId() {
  return '@@s' + ++ids;
};

var teardownAction = exports.teardownAction = function teardownAction(id) {
  return id + '_teardown';
};
var isState = exports.isState = function isState(state) {
  return state && state.__rine === 'state';
};

function createState(initialValue, reducer) {
  var subscribersUID = 0;
  var stateValue = initialValue;
  var subscribers = [];
  var reducerTask = void 0;

  var state = {
    __rine: 'state',
    __subscribers: function __subscribers() {
      return subscribers;
    },

    id: getId(),
    set: function set(newValue) {
      stateValue = newValue;
      subscribers.forEach(function (_ref) {
        var update = _ref.update;
        return update(stateValue);
      });
    },
    get: function get() {
      return stateValue;
    },
    subscribe: function subscribe(update) {
      var subscriberId = ++subscribersUID;

      subscribers.push({ id: subscriberId, update: update });
      return function () {
        subscribers = subscribers.filter(function (_ref2) {
          var id = _ref2.id;
          return id !== subscriberId;
        });
      };
    },
    teardown: function teardown() {
      subscribers = [];
      stateValue = undefined;
    },
    put: function put(type, payload) {
      if (reducer) {
        this.set(reducer(stateValue, { type: type, payload: payload }));
      }
    }
  };

  if (reducer) {
    reducerTask = _System2.default.takeEvery('*', function (payload, type) {
      return state.put(type, payload);
    });
  }

  _System2.default.addTask(teardownAction(state.id), function () {
    state.teardown();
    if (reducerTask) {
      _System2.default.removeTasks([reducerTask]);
    }
  });

  return state;
};

},{"./System":1}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.takeEvery = exports.take = exports.put = exports.mapStateToProps = exports.connect = exports.state = exports.routine = exports.System = undefined;

var _System = require('./api/System');

Object.defineProperty(exports, 'System', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_System).default;
  }
});

var _routine = require('./api/routine');

Object.defineProperty(exports, 'routine', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_routine).default;
  }
});

var _state = require('./api/state');

Object.defineProperty(exports, 'state', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_state).default;
  }
});

var _connect = require('./api/connect');

Object.defineProperty(exports, 'connect', {
  enumerable: true,
  get: function get() {
    return _connect.connect;
  }
});
Object.defineProperty(exports, 'mapStateToProps', {
  enumerable: true,
  get: function get() {
    return _connect.mapStateToProps;
  }
});

var _System2 = _interopRequireDefault(_System);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var put = exports.put = _System2.default.put.bind(_System2.default);
var take = exports.take = _System2.default.take.bind(_System2.default);
var takeEvery = exports.takeEvery = _System2.default.takeEvery.bind(_System2.default);

},{"./api/System":1,"./api/connect":2,"./api/routine":3,"./api/state":4}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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
