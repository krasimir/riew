'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint-disable consistent-return, no-new, no-use-before-define */

var ids = 0;
var getId = function getId() {
  return '@@t' + ++ids;
};
var debug = __DEV__ && false;

function Task(type, callback) {
  var once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var task = {
    __rine: 'task',
    id: getId(),
    active: true,
    once: once,
    type: type,
    callback: callback,
    done: null,
    teardown: function teardown() {
      if (debug) console.log('teardown:' + this.id + '(type: ' + this.type + ')');
      this.active = false;
    },
    execute: function execute(payload) {
      if (this.active) {
        this.callback(payload);
        if (this.once) {
          if (debug) console.log('  auto removal ' + task.id + '(type: ' + type + ')');
          System.removeTasks([this]);
        }
      }
    }
  };

  if (!callback) {
    task.done = new Promise(function (donePromise) {
      task.callback = donePromise;
    });
  }

  return task;
}

var System = {
  tasks: [],
  addTask: function addTask(type, callback, once) {
    var task = Task(type, callback, once);

    if (debug) console.log('addTask:' + task.id + '(type: ' + type + ')');

    this.tasks.push(task);
    return task;
  },
  removeTasks: function removeTasks(tasks) {
    var ids = tasks.reduce(function (map, task) {
      map[task.id] = true;
      return map;
    }, {});

    if (debug) console.log('removeTasks:' + Object.keys(ids));

    this.tasks = this.tasks.filter(function (task) {
      if (task.id in ids) {
        task.teardown();
        return false;
      }
      return true;
    });
  },
  put: function put(type, payload) {
    if (debug) console.log('put("' + type + '", ' + JSON.stringify(payload) + ')');
    this.tasks.forEach(function (task) {
      if (task.type === type) {
        task.execute(payload);
      };
    });
  },
  take: function take(type, callback) {
    return this.addTask(type, callback, true);
  },
  takeEvery: function takeEvery(type, callback) {
    return this.addTask(type, callback, false);
  },
  reset: function reset() {
    this.tasks = [];
  },
  isTask: function isTask(task) {
    return task && task.__rine === 'task';
  },
  putBulk: function putBulk(actions) {
    var _this = this;

    actions.forEach(function (type) {
      return _this.put(type);
    });
  }
};

exports.default = System;