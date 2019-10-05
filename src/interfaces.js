import grid from './grid';

export function implementObservableInterface(obj) {
  obj.on = (type, callback) => grid.subscribe().to(obj).when(type, callback);
  obj.emit = (type, ...args) => grid.emit(type).from(obj).with(...args);
  obj.off = () => grid.off(obj);
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
