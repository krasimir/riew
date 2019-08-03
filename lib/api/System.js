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