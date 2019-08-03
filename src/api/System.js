const System = {
  controllers: {},
  addController(controller) {
    this.controllers[ controller.id ] = controller;
  },
  removeController(controller) {
    delete this.controllers[ controller.id ];
  },
  put(type, payload, source) {
    Object.keys(this.controllers).forEach(id => {
      if (id !== source) {
        this.controllers[id].put(type, payload, false);
      }
    });
  },
  debug() {
    const pending = Object.keys(this.controllers).reduce((arr, id) => {
      arr = arr.concat(this.controllers[id].system().pending);
      return arr;
    }, []);

    return {
      controllers: this.controllers,
      pending
    };
  },
  reset() {
    this.controllers = {};
  }
};

export default System;
