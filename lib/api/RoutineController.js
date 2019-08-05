'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createRoutineController;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('../utils');

var _System = require('./System');

var _System2 = _interopRequireDefault(_System);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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