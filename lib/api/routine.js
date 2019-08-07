'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.createRoutineInstance = createRoutineInstance;
exports.default = routine;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _System = require('./System');

var _System2 = _interopRequireDefault(_System);

var _utils = require('../utils');

var _state = require('./state');

var _state2 = _interopRequireDefault(_state);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  var RenderComponent = function RenderComponent() {
    return null;
  };
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
      routineFunc({
        render: function render(obj) {
          if (!mounted) return Promise.resolve();
          if (_react2.default.isValidElement(obj) || typeof obj === 'string' || typeof obj === 'number') {
            RenderComponent = function RenderComponent() {
              return obj;
            };
          } else if (obj === null) {
            RenderComponent = function RenderComponent() {
              return null;
            };
          } else if (typeof obj === 'function') {
            RenderComponent = obj;
          } else {
            throw new Error('"render" method accepts only React component, React element or null.');
          }
          triggerRender(props);
          return new Promise(function (done) {
            onRendered = function onRendered() {
              return done();
            };
          });
        },
        takeProps: function takeProps(callback) {
          var task = _System2.default.takeEvery(updatedAction(id), callback);

          tasksToRemove.push(task);
          callback(props);
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
    updated: function updated(props) {
      _System2.default.put(updatedAction(id), props);
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

    // mounting
    (0, _react.useEffect)(function () {
      setInstance(instance = createRoutineInstance(routineFunc));

      if (__DEV__) {
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