'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.implementLoggableInterface = implementLoggableInterface;
exports.implementIterableProtocol = implementIterableProtocol;
function implementLoggableInterface(obj) {
  var initialValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  obj.loggable = initialValue;
  obj.loggability = function (value) {
    obj.loggable = value;
    return obj;
  };
}

function implementIterableProtocol(event) {
  if (typeof Symbol !== 'undefined' && typeof Symbol.iterator !== 'undefined') {
    event[Symbol.iterator] = function () {
      var values = [event.map(), event.mutate()];
      var i = 0;

      return {
        next: function next() {
          return {
            value: values[i++],
            done: i > values.length
          };
        }
      };
    };
  }
};