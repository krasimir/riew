"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mapToKey;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function mapToKey(key) {
  return function (queueResult, payload, next) {
    var mappingFunc = function mappingFunc(value) {
      return _defineProperty({}, key, value);
    };

    return next(mappingFunc.apply(undefined, [queueResult].concat(_toConsumableArray(payload))));
  };
};