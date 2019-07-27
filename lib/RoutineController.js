"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createRoutineController;
/* eslint-disable consistent-return, camelcase */

var ids = 0;
var getId = function getId() {
  return "r" + ++ids;
};

function createRoutineController(routine, _ref) {
  var broadcast = _ref.broadcast;

  var mounted = false;
  var pending = [];
  var id = getId();

  function put(typeToResume, payload) {
    var shouldBroadcast = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    var toFire = [];

    pending = pending.filter(function (_ref2) {
      var type = _ref2.type,
          done = _ref2.done,
          once = _ref2.once;

      if (type === typeToResume) {
        toFire.push(done);
        return !once;
      }
      return true;
    });
    toFire.forEach(function (func) {
      return func(payload);
    });
    if (shouldBroadcast) {
      broadcast(typeToResume, payload, id);
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

  return {
    id: id,
    in: function _in(setContent, props) {
      mounted = true;
      return routine(_extends({}, props, {
        render: function render(content) {
          if (mounted) setContent(content);
        },

        take: take,
        takeEvery: takeEvery,
        put: put
      }));
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