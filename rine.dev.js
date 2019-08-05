(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.rine = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createRoutineController;

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _utils = require('../utils');

var _System = require('./System');

var _System2 = _interopRequireDefault(_System);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var ids = 0; /* eslint-disable consistent-return */

var getId = function getId() {
  return 'r' + ++ids;
};

function createRoutineController(routine) {
  var active = false;
  var RenderComponent = void 0;
  var triggerRender = void 0;
  var onRendered = function onRendered() {};

  function isActive() {
    return active;
  }

  var routineController = {
    __rine: 'routine',
    id: getId(),
    isActive: isActive,
    name: (0, _utils.getFuncName)(routine),
    in: function _in(setContent, props) {
      var controller = this;

      active = true;
      triggerRender = function triggerRender(newProps) {
        if (active) setContent(_react2.default.createElement(RenderComponent, newProps));
      };

      var result = routine(function render(f) {
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
      }, { isMounted: isActive });

      if ((0, _utils.isGenerator)(result)) {
        (function processGenerator(genValue) {
          if (_System2.default.isTask(genValue.value)) {
            var task = genValue.value;

            task.controller = controller;
            if (task.done) {
              task.done.then(function (taskResult) {
                return processGenerator(result.next(taskResult));
              });
              return;
            }
          };
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
      active = false;
    }
  };

  _System2.default.addController(routineController);

  return routineController;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../utils":7,"./System":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createStateController;

var _System = require('./System');

var _System2 = _interopRequireDefault(_System);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var ids = 0;
var getId = function getId() {
  return 's' + ++ids;
};

function createStateController(initialValue, reducer) {
  var subscribersUID = 0;
  var stateValue = initialValue;
  var subscribers = [];

  var stateController = {
    __rine: 'state',
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
    connect: function connect(update) {
      var subscriberId = ++subscribersUID;

      subscribers.push({ id: subscriberId, update: update });
      return function () {
        subscribers = subscribers.filter(function (_ref2) {
          var id = _ref2.id;
          return id !== subscriberId;
        });
      };
    },
    destroy: function destroy() {
      _System2.default.removeController(this);
    },
    put: function put(type, payload) {
      if (reducer) {
        this.set(reducer(stateValue, { type: type, payload: payload }));
      }
    }
  };

  _System2.default.addController(stateController);

  return stateController;
};

},{"./System":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint-disable consistent-return, no-new */

var tids = 0;
var getTaskId = function getTaskId() {
  return 't' + ++tids;
};

var System = {
  tasks: [],
  controllers: [],
  addController: function addController(controller) {
    this.controllers.push(controller);
  },
  removeController: function removeController(controller) {
    this.controllers = this.controllers.filter(function (_ref) {
      var id = _ref.id;
      return id !== controller.id;
    });
    this.tasks = this.tasks.filter(function (_ref2) {
      var c = _ref2.controller;

      if (c) {
        return c.id !== controller.id;
      }
      return true;
    });
  },
  addTask: function addTask(type, callback, controller) {
    var once = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

    var task = {
      __rine: 'task',
      id: getTaskId(),
      type: type,
      callback: callback,
      controller: controller,
      once: once
    };

    if (!callback) {
      task.done = new Promise(function (donePromise) {
        task.callback = donePromise;
      });
    }

    this.tasks.push(task);
    return task;
  },
  put: function put(typeOfAction, payload) {
    var toFire = [];

    this.tasks = this.tasks.filter(function (_ref3) {
      var type = _ref3.type,
          callback = _ref3.callback,
          once = _ref3.once;

      if (type === typeOfAction) {
        toFire.push(callback);
        return !once;
      }
      return true;
    });
    toFire.forEach(function (func) {
      return func(payload);
    });

    this.controllers.forEach(function (controller) {
      if ('put' in controller) {
        controller.put(typeOfAction, payload);
      }
    });
  },
  take: function take(type, callback, sourceController) {
    return this.addTask(type, callback, sourceController, true);
  },
  takeEvery: function takeEvery(type, callback, sourceController) {
    return this.addTask(type, callback, sourceController, false);
  },
  reset: function reset() {
    this.controllers = [];
    this.tasks = [];
  },
  isTask: function isTask(task) {
    return task && task.__rine === 'task';
  }
};

exports.default = System;

},{}],4:[function(require,module,exports){
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
          unsubscribeCallbacks.push(value.connect(function (newValue) {
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
},{"../utils":7}],5:[function(require,module,exports){
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

exports.default = routine;

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _RoutineController = require('./RoutineController');

var _RoutineController2 = _interopRequireDefault(_RoutineController);

var _System = require('./System');

var _System2 = _interopRequireDefault(_System);

var _utils = require('../utils');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function routine(routine) {
  var RoutineBridge = function RoutineBridge(props) {
    var _useState = (0, _react.useState)(null),
        _useState2 = _slicedToArray(_useState, 2),
        content = _useState2[0],
        setContent = _useState2[1];

    var _useState3 = (0, _react.useState)(null),
        _useState4 = _slicedToArray(_useState3, 2),
        controller = _useState4[0],
        setController = _useState4[1];

    // updating props


    (0, _react.useEffect)(function () {
      if (controller) controller.updated(props);
    }, [props]);

    // to support sync rendering (i.e. await render(...))
    (0, _react.useEffect)(function () {
      if (controller) controller.rendered();
    }, [content]);

    (0, _react.useEffect)(function () {
      setController(controller = (0, _RoutineController2.default)(routine));

      controller.in(setContent, props);

      return function () {
        controller.out();
        _System2.default.removeController(controller);
      };
    }, []);

    return content;
  };

  RoutineBridge.displayName = 'Routine(' + (0, _utils.getFuncName)(routine) + ')';

  return RoutineBridge;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../utils":7,"./RoutineController":1,"./System":3}],6:[function(require,module,exports){
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

var _StateController = require('./api/StateController');

Object.defineProperty(exports, 'state', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_StateController).default;
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

},{"./api/StateController":2,"./api/System":3,"./api/connect":4,"./api/routine":5}],7:[function(require,module,exports){
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

},{}]},{},[6])(6)
});
