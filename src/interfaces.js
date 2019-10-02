import { QueueAPI } from './queue';
import grid from './grid';

export function implementObservableInterface(obj) {
  const subscriptions = [];

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
    return obj;
  };
  obj.off = () => {
    subscriptions.forEach(s => s());
    return obj;
  };
}

export function implementLoggableInterface(obj, initialValue = true) {
  obj.loggable = initialValue;
  obj.loggability = (value) => {
    obj.loggable = value;
    return obj;
  };
}

export function implementQueueProtocol(event) {
  Object.keys(QueueAPI).forEach(m => {
    event[m] = (...methodArgs) => event.fork({ type: m, func: methodArgs });
  });
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
