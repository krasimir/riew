'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = map;

var _utils = require('../utils');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function map(func) {
  return function (intermediateValue, payload, next) {
    var result = (func || function (value) {
      return value;
    }).apply(undefined, [intermediateValue].concat(_toConsumableArray(payload)));

    if ((0, _utils.isPromise)(result)) {
      return result.then(next);
    }
    return next(result);
  };
};