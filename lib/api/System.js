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