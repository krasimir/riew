'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = filter;

var _utils = require('../utils');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function filter(func) {
  return function (intermediateValue, payload, next, q) {
    var filterResult = func.apply(undefined, [intermediateValue].concat(_toConsumableArray(payload)));

    if ((0, _utils.isPromise)(filterResult)) {
      return filterResult.then(function (asyncResult) {
        if (!asyncResult) {
          q.index = q.items.length;
        }
        return next(intermediateValue);
      });
    }
    if (!filterResult) {
      q.index = q.items.length;
    }
    return next(intermediateValue);
  };
}