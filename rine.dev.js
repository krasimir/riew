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

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/* eslint-disable consistent-return */
var ids = 0;
var getId = function getId() {
  return 'r' + ++ids;
};

function createRoutineController(routine) {
  var mounted = false;
  var RenderComponent = void 0;
  var triggerRender = void 0;
  var onRendered = function onRendered() {};

  function isMounted() {
    return mounted;
  }

  return {
    id: getId(),
    name: (0, _utils.getFuncName)(routine),
    in: function _in(setContent, props) {
      mounted = true;
      triggerRender = function triggerRender(newProps) {
        if (mounted) setContent(_react2.default.createElement(RenderComponent, newProps));
      };

      return routine(function render(f) {
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
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../utils":7}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint-disable consistent-return */

var System = {
  pending: [],
  controllers: {},
  addController: function addController(controller) {
    this.controllers[controller.id] = controller;
  },
  removeController: function removeController(controller) {
    delete this.controllers[controller.id];
  },
  put: function put(typeOfAction, payload) {
    var _this = this;

    var toFire = [];

    this.pending = this.pending.filter(function (_ref) {
      var type = _ref.type,
          done = _ref.done,
          once = _ref.once;

      if (type === typeOfAction) {
        toFire.push(done);
        return !once;
      }
      return true;
    });
    toFire.forEach(function (func) {
      return func(payload);
    });

    Object.keys(this.controllers).forEach(function (id) {
      if ('put' in _this.controllers[id]) {
        _this.controllers[id].put(typeOfAction, payload);
      }
    });
  },
  take: function take(type, done) {
    var _this2 = this;

    if (!done) {
      var p = new Promise(function (done) {
        _this2.pending.push({
          type: type,
          done: done,
          once: true
        });
      });

      return p;
    }
    this.pending.push({ type: type, done: done, once: true, __pending: 'rine' });
  },
  takeEvery: function takeEvery(type, done) {
    this.pending.push({ type: type, done: done, once: false, __pending: 'rine' });
  },
  debug: function debug() {
    return {
      controllers: this.controllers,
      pending: this.pending
    };
  },
  reset: function reset() {
    this.controllers = {};
    this.pending = [];
  }
};

exports.default = System;

},{}],3:[function(require,module,exports){
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
  return value.__state === 'rine';
}
function accumulateProps(map) {
  return Object.keys(map).reduce(function (props, key) {
    var value = map[key];

    if (isRineState(value)) {
      props[key] = value.get();
    } else if (typeof value === 'function') {
      props[key] = value();
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
            return setAProps(_extends({}, aprops, _defineProperty({}, key, newValue)));
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
},{"../utils":7}],4:[function(require,module,exports){
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

      _System2.default.addController(controller);
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
},{"../utils":7,"./RoutineController":1,"./System":2}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = state;

var _System = require('./System');

var _System2 = _interopRequireDefault(_System);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var ids = 0;
var getId = function getId() {
  return 's' + ++ids;
};

function state(initialValue, reducer) {
  var subscribersUID = 0;
  var stateValue = initialValue;
  var subscribers = [];

  var stateController = {
    id: getId(),
    __state: 'rine',
    __subscribers: subscribers,
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
      var _this = this;

      var subscriberId = ++subscribersUID;

      subscribers.push({ id: subscriberId, update: update });
      return function () {
        _this.__subscribers = subscribers = subscribers.filter(function (_ref2) {
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

},{"./System":2}],6:[function(require,module,exports){
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

},{"./api/System":2,"./api/connect":3,"./api/routine":4,"./api/state":5}],7:[function(require,module,exports){
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
