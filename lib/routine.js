'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createRoutineInstance;

var _state2 = require('./state');

function createRoutineInstance(controllerFunc, viewFunc) {
  var active = false;
  var funcsToCallOnUnmount = [];

  function isActive() {
    return active;
  }

  var instance = (0, _state2.createState)({});

  instance.isActive = isActive;
  instance.in = function (initialProps) {
    active = true;
    instance.set(initialProps);
    controllerFunc({
      render: function render(props) {
        if (!active) return Promise.resolve();
        return new Promise(function (done) {
          viewFunc(props, done);
        });
      },

      props: instance,
      state: function state() {
        var s = _state2.createState.apply(undefined, arguments);

        funcsToCallOnUnmount.push(s.teardown);
        return s;
      },

      isActive: isActive
    });
  };
  instance.out = function () {
    active = false;
    funcsToCallOnUnmount.forEach(function (f) {
      return f();
    });
    funcsToCallOnUnmount = [];
    instance.teardown();
  };

  return instance;
}