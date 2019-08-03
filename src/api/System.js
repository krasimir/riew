/* eslint-disable consistent-return */

var tids = 0;
const getTaskId = () => `t${ ++tids }`;

function newTask(type, done, controller, once = true) {
  return {
    id: getTaskId(),
    type,
    done,
    controller,
    once
  };
}

const System = {
  tasks: [],
  controllers: [],
  addController(controller) {
    this.controllers.push(controller);
  },
  removeController(controller) {
    this.controllers = this.controllers.filter(({ id }) => id !== controller.id);
    this.tasks = this.tasks.filter(({ controller: c }) => {
      if (c) {
        return c.id !== controller.id;
      }
      return true;
    });
  },
  addTask(type, done, controller, once = true) {
    const task = newTask(type, done, controller, once);

    this.tasks.push(task);
    return task;
  },
  put(typeOfAction, payload) {
    const toFire = [];

    this.tasks = this.tasks.filter(({ type, done, once }) => {
      if (type === typeOfAction) {
        toFire.push(done);
        return !once;
      }
      return true;
    });
    toFire.forEach(func => func(payload));

    this.controllers.forEach(controller => {
      if ('put' in controller) {
        controller.put(typeOfAction, payload);
      }
    });
  },
  take(type, done, sourceController) {
    if (!done) {
      return new Promise(promiseDone => {
        this.addTask(type, promiseDone, sourceController, true);
      });
    }
    return this.addTask(type, done, sourceController, true);
  },
  takeEvery(type, done, sourceController) {
    return this.addTask(
      type,
      done,
      sourceController,
      false
    );
  },
  reset() {
    this.controllers = [];
    this.tasks = [];
  }
};

export default System;
