export function implementLoggableInterface(obj, initialValue = true) {
  obj.loggable = initialValue;
  obj.loggability = (value) => {
    obj.loggable = value;
    return obj;
  };
}
