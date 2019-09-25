export function implementLoggableInterface(obj, initialValue = true) {
  obj.loggable = initialValue;
  obj.loggability = (value) => {
    obj.loggable = value;
    return obj;
  };
}
export function implementStateProxyInterface(stateConstructor) {
  var handler = {
    get: function (obj, prop) {
      return (...args) => {
        return stateConstructor(...args, prop);
      };
    }
  };

  if (typeof Proxy !== 'undefined') {
    return new Proxy(stateConstructor, handler);
  }
  return stateConstructor;
}
