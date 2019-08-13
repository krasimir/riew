/* eslint-disable consistent-return, no-new, no-use-before-define */

var ids = 0;
const getId = () => `@@t${ ++ids }`;

function Task(type, callback, once = true) {
  const task = {
    __rine: 'task',
    id: getId(),
    active: true,
    once,
    type,
    callback,
    done: null,
    cancel() {
      this.active = false;
      System.removeTask(this);
    },
    execute(payload, type) {
      if (this.active) {
        if (type) {
          this.callback(payload, type);
        } else {
          this.callback(payload);
        }
        if (this.once) {
          System.removeTask(this);
        }
      }
    }
  };

  if (!callback) {
    task.done = new Promise(donePromise => {
      task.callback = donePromise;
    });
  }

  return task;
}

const System = {
  tasks: [],
  addTask(type, callback, once) {
    const task = Task(type, callback, once);

    this.tasks.push(task);
    return task;
  },
  removeTask(taskToRemove) {
    this.tasks = this.tasks.filter(task => {
      if (task.id === taskToRemove.id) {
        return false;
      }
      return true;
    });
  },
  put(type, payload) {
    this.tasks.forEach(task => {
      if (task.type === type) {
        task.execute(payload);
      } else if (task.type === '*') {
        task.execute(payload, type);
      }
    });
  },
  take(type, callback) {
    if (Array.isArray(type)) {
      return type.map(t => this.addTask(t, callback, true));
    }
    return this.addTask(type, callback, true);
  },
  takeEvery(type, callback) {
    if (Array.isArray(type)) {
      return type.map(t => this.addTask(t, callback, false));
    }
    return this.addTask(type, callback, false);
  },
  reset() {
    this.tasks = [];
  },
  isTask(task) {
    return task && task.__rine === 'task';
  },
  putBulk(actions) {
    actions.forEach(type => this.put(type));
  }
};

export default System;
