import grid from './grid';

export function implementObservableInterface(obj) {
  let subscriptions = [];

  obj.on = (type, callback) => {
    const unsubscribe = grid.on(type, (source, ...args) => {
      if (source === obj) {
        callback(...args);
      }
    });

    subscriptions.push(unsubscribe);
    return unsubscribe;
  };
  obj.emit = (type, ...args) => {
    grid.emit(type, obj, ...args);
  };
  obj.off = () => {
    subscriptions.forEach(s => s());
    subscriptions = [];
  };
}

export function implementLoggableInterface(obj, initialValue = true) {
  obj.loggable = initialValue;
  obj.loggability = (value) => {
    obj.loggable = value;
    return obj;
  };
}

export function implementIterableProtocol(event) {
  if (typeof Symbol !== 'undefined' && typeof Symbol.iterator !== 'undefined') {
    event[Symbol.iterator] = function () {
      const values = [ event.map(), event.mutate() ];
      let i = 0;

      return {
        next: () => ({
          value: values[ i++ ],
          done: i > values.length
        })
      };
    };
  }
};
