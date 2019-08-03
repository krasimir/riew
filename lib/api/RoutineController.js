'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createRoutineController;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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