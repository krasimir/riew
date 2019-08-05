/* eslint-disable consistent-return, no-new, no-use-before-define */

var ids = 0;
const getId = () => `@@t${ ++ids }`;
const debug = __DEV__ && false;

function Task(type, callback, once = true) {
  const task = {
    __rine: 'task',
    id: getId(),
    active: true,
    once,
    type,
    callback,
    done: null,
    teardown() {
      if (debug) console.log(`teardown:${ this.id }(type: ${ this.type })`);
      this.active = false;
    },
    execute(payload, type) {
      if (this.active) {
        if (type) {
          this.callback(payload, type);
        } else {
          this.callback(payload);
        }
        if (this.once) {
          if (debug) console.log(`  auto removal ${ task.id }(type: ${ type })`);
          System.removeTasks([ this ]);
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

    if (debug) console.log(`addTask:${ task.id }(type: ${ type })`);

    this.tasks.push(task);
    return task;
  },
  removeTasks(tasks) {
    const ids = tasks.reduce((map, task) => {
      map[ task.id ] = true;
      return map;
    }, {});

    if (debug) console.log(`removeTasks:${ Object.keys(ids) }`);

    this.tasks = this.tasks.filter(task => {
      if (task.id in ids) {
        task.teardown();
        return false;
      }
      return true;
    });
  },
  put(type, payload) {
    if (debug) console.log(`put("${ type }", ${ JSON.stringify(payload) })`);
    this.tasks.forEach(task => {
      if (task.type === type) {
        task.execute(payload);
      } else if (task.type === '*') {
        task.execute(payload, type);
      }
    });
  },
  take(type, callback) {
    return this.addTask(type, callback, true);
  },
  takeEvery(type, callback) {
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
