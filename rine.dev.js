(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.rine = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createRoutineController;
/* eslint-disable consistent-return, camelcase */

var ids = 0;
var getId = function getId() {
  return 'r' + ++ids;
};

function createRoutineController(routine, _ref) {
  var broadcast = _ref.broadcast;

  var mounted = false;
  var pending = [];
  var renderFunc = void 0;
  var triggerRender = void 0;
  var id = getId();

  function put(typeOfAction, payload) {
    var shouldBroadcast = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    var toFire = [];

    pending = pending.filter(function (_ref2) {
      var type = _ref2.type,
          done = _ref2.done,
          once = _ref2.once;

      if (type === typeOfAction) {
        toFire.push(done);
        return !once;
      }
      return true;
    });
    toFire.forEach(function (func) {
      return func(payload);
    });
    if (shouldBroadcast) {
      broadcast(typeOfAction, payload, id);
    }
  };
  function take(type, done) {
    if (!done) {
      var p = new Promise(function (_done) {
        pending.push({
          type: type,
          done: function done() {
            if (mounted) _done.apply(undefined, arguments);
          },
          once: true
        });
      });

      return p;
    }
    pending.push({ type: type, done: done, once: true });
  }
  function takeEvery(type, done) {
    pending.push({ type: type, done: done, once: false });
  }
  function isMounted() {
    return mounted;
  }

  return {
    id: id,
    in: function _in(setContent, props) {
      mounted = true;
      triggerRender = function triggerRender(newProps) {
        if (mounted) setContent(renderFunc(newProps));
      };

      return routine({
        render: function render(f) {
          if (typeof f === 'function') {
            renderFunc = f;
          } else {
            renderFunc = function renderFunc() {
              return f;
            };
          }
          triggerRender(props);
        },

        take: take,
        takeEvery: takeEvery,
        put: put,
        isMounted: isMounted
      });
    },
    update: function update(props) {
      triggerRender(props);
    },
    out: function out() {
      mounted = false;
      pending = [];
    },

    put: put,
    system: function system() {
      return {
        mounted: mounted,
        pending: pending
      };
    }
  };
}

},{}],2:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.System = undefined;

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

exports.Routine = Routine;
exports.Partial = Partial;

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _RoutineController = require('./RoutineController');

var _RoutineController2 = _interopRequireDefault(_RoutineController);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var isGenerator = function isGenerator(obj) {
  return obj && typeof obj['next'] === 'function';
};
var isPromise = function isPromise(obj) {
  return obj && typeof obj['then'] === 'function';
};
var getFuncName = function getFuncName(func) {
  if (func.name) return func.name;
  var result = /^function\s+([\w\$]+)\s*\(/.exec(func.toString());

  return result ? result[1] : 'unknown';
};

var System = exports.System = {
  controllers: {},
  addController: function addController(controller) {
    this.controllers[controller.id] = controller;
  },
  removeController: function removeController(controller) {
    delete this.controllers[controller.id];
  },
  put: function put(type, payload, source) {
    var _this = this;

    Object.keys(this.controllers).forEach(function (id) {
      if (id !== source) {
        _this.controllers[id].put(type, payload, false);
      }
    });
  },
  debug: function debug() {
    var _this2 = this;

    var pending = Object.keys(this.controllers).reduce(function (arr, id) {
      arr = arr.concat(_this2.controllers[id].system().pending);
      return arr;
    }, []);

    return {
      controllers: this.controllers,
      pending: pending
    };
  }
};

function Routine(routine) {
  var controller = void 0;
  var RineBridge = function RineBridge(props) {
    var _useState = (0, _react.useState)(null),
        _useState2 = _slicedToArray(_useState, 2),
        content = _useState2[0],
        setContent = _useState2[1];

    (0, _react.useEffect)(function () {
      if (controller) controller.update(props);
    }, [props]);

    (0, _react.useEffect)(function () {
      controller = (0, _RoutineController2.default)(routine, {
        broadcast: function broadcast() {
          System.put.apply(System, arguments);
        }
      });

      System.addController(controller);

      var result = controller.in(setContent, props);

      if (result && !isPromise(result) && !isGenerator(result)) {
        setContent(result);
      }

      return function () {
        controller.out();
        System.removeController(controller);
      };
    }, []);

    return content;
  };

  RineBridge.displayName = 'Rine(' + getFuncName(routine) + ')';

  return RineBridge;
}

function Partial(product, initialValue) {
  var rerender = function rerender() {};
  var value = initialValue;

  var RineBridgeComponent = Routine(function Partial(_ref) {
    var render = _ref.render;

    rerender = function rerender() {
      return render(product(value));
    };
    return rerender();
  });

  RineBridgeComponent.displayName = 'Rine(' + getFuncName(product) + ')';

  RineBridgeComponent.set = function (newValue) {
    value = newValue;
    rerender();
  };
  RineBridgeComponent.get = function () {
    return value;
  };

  return RineBridgeComponent;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./RoutineController":1}]},{},[2])(2)
});
