'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createRoutineController;

var _utils = require('./utils');

var ids = 0; /* eslint-disable consistent-return, camelcase */

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
    name: (0, _utils.getFuncName)(routine),
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