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
var debug = true && false;

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
      if (debug) console.log('teardown:' + this.id + '(type: ' + this.type + ')');
      this.active = false;
    },
    execute: function execute(payload) {
      if (this.active) {
        this.callback(payload);
        if (this.once) {
          if (debug) console.log('  auto removal ' + task.id + '(type: ' + type + ')');
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

    if (debug) console.log('addTask:' + task.id + '(type: ' + type + ')');

    this.tasks.push(task);
    return task;
  },
  removeTasks: function removeTasks(tasks) {
    var ids = tasks.reduce(function (map, task) {
      map[task.id] = true;
      return map;
    }, {});

    if (debug) console.log('removeTasks:' + Object.keys(ids));

    this.tasks = this.tasks.filter(function (task) {
      if (task.id in ids) {
        task.teardown();
        return false;
      }
      return true;
    });
  },
  put: function put(type, payload) {
    if (debug) console.log('put("' + type + '", ' + JSON.stringify(payload) + ')');
    this.tasks.forEach(function (task) {
      if (task.type === type) {
        task.execute(payload);
      };
    });
  },
  take: function take(type, callback) {
    return this.addTask(type, callback, true);
  },
  takeEvery: function takeEvery(type, callback) {
    return this.addTask(type, callback, false);
  },
  reset: function reset() {
    this.tasks = [];
  },
  isTask: function isTask(task) {
    return task && task.__rine === 'task';
  },
  putBulk: function putBulk(actions) {
    var _this = this;

    actions.forEach(function (type) {
      return _this.put(type);
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

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
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

exports.default = connect;

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

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
function accumulateProps(map) {
  return Object.keys(map).reduce(function (props, key) {
    var value = map[key];

    if (isRineState(value)) {
      props[key] = value.get();
    } else if (typeof value === 'function') {
      props[key] = value();
    } else {
      props[key] = value;
    }
    return props;
  }, {});
}

function connect(Component, map) {
  function StateBridge(props) {
    var _useState = (0, _react.useState)(accumulateProps(map)),
        _useState2 = _slicedToArray(_useState, 2),
        aprops = _useState2[0],
        setAProps = _useState2[1];

    (0, _react.useEffect)(function () {
      var unsubscribeCallbacks = [];

      Object.keys(map).forEach(function (key) {
        var value = map[key];

        if (isRineState(value)) {
          unsubscribeCallbacks.push(value.subscribe(function (newValue) {
            return setAProps(aprops = _extends({}, aprops, _defineProperty({}, key, newValue)));
          }));
        }
      });
      return function () {
        unsubscribeCallbacks.forEach(function (f) {
          return f();
        });
      };
    }, []);

    return _react2.default.createElement(Component, _extends({}, aprops, props));
  }

  StateBridge.displayName = 'State(' + (0, _utils.getFuncName)(Component) + ')';
  return StateBridge;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../utils":6}],3:[function(require,module,exports){
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

exports.createRoutineInstance = createRoutineInstance;
exports.default = routine;

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _System = require('./System');

var _System2 = _interopRequireDefault(_System);

var _utils = require('../utils');

var _state = require('./state');

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

function createRoutineInstance(routineFunc) {
  var id = getId();
  var mounted = false;
  var RenderComponent = void 0;
  var triggerRender = void 0;
  var onRendered = function onRendered() {};
  var tasksToRemove = [];
  var actionsToFire = [];

  function isMounted() {
    return mounted;
  }

  var instance = {
    __rine: 'routine',
    id: id,
    name: (0, _utils.getFuncName)(routineFunc),
    in: function _in(setContent, props) {
      mounted = true;
      triggerRender = function triggerRender(newProps) {
        if (mounted) setContent(_react2.default.createElement(RenderComponent, newProps));
      };

      var result = routineFunc(function render(f) {
        if (typeof f === 'function') {
          RenderComponent = f;
        } else {
          RenderComponent = function RenderComponent() {
            return f;
          };
        }
        triggerRender(props);
        return new Promise(function (done) {
          onRendered = function onRendered() {
            return done();
          };
        });
      }, { isMounted: isMounted });

      if ((0, _utils.isGenerator)(result)) {
        (function processGenerator(genValue) {
          if (_System2.default.isTask(genValue.value)) {
            var task = genValue.value;

            tasksToRemove.push(task);
            if (task.done) {
              task.done.then(function (taskResult) {
                return processGenerator(result.next(taskResult));
              });
              return;
            }
          } else if ((0, _state.isState)(genValue.value)) {
            actionsToFire.push((0, _state.teardownAction)(genValue.value.id));
          }
          if (!genValue.done) {
            processGenerator(result.next(genValue.value));
          }
        })(result.next());
      }
    },
    updated: function updated(props) {
      triggerRender(props);
    },
    rendered: function rendered() {
      onRendered();
    },
    out: function out() {
      mounted = false;
    }
  };

  _System2.default.addTask(unmountedAction(id), function () {
    instance.out();
    _System2.default.removeTasks(tasksToRemove);
    _System2.default.putBulk(actionsToFire);
  });

  return instance;
}

function routine(routineFunc, options) {
  var RoutineBridge = function RoutineBridge(props) {
    var _useState = (0, _react.useState)(null),
        _useState2 = _slicedToArray(_useState, 2),
        content = _useState2[0],
        setContent = _useState2[1];

    var _useState3 = (0, _react.useState)(null),
        _useState4 = _slicedToArray(_useState3, 2),
        instance = _useState4[0],
        setInstance = _useState4[1];

    // updating props


    (0, _react.useEffect)(function () {
      if (instance) instance.updated(props);
    }, [props]);

    // to support sync rendering (i.e. await render(...))
    (0, _react.useEffect)(function () {
      if (instance) instance.rendered();
    }, [content]);

    (0, _react.useEffect)(function () {
      setInstance(instance = createRoutineInstance(routineFunc));

      if (true) {
        if (options && options.onInstanceCreated) {
          options.onInstanceCreated(instance);
        }
      }

      instance.in(setContent, props);

      return function () {
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

  _System2.default.addTask(teardownAction(state.id), function () {
    state.teardown();
  });

  return state;
};

},{"./System":1}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.takeEvery = exports.take = exports.put = exports.connect = exports.state = exports.routine = exports.System = undefined;

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
    return _interopRequireDefault(_connect).default;
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

},{}]},{},[5])(5)
});
