import { QueueAPI } from './queue';
import grid from './grid';

let listeners = [];

export function implementEventBusInterface(obj) {
  obj.on = (callback) => {
    return grid.on((source, ...args) => {
      if (source === obj) {
        callback(...args);
      }
    });
  };
  obj.emit = (type, ...args) => {
    grid.emit(type, obj, ...args);
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
    event[m] = (...methodArgs) => event.fork(event, { type: m, func: methodArgs });
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
