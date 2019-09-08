'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mutate;

var _utils = require('../utils');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function mutate(func) {
  return function (queueResult, payload, next, q) {
    var result = (func || function (current, payload) {
      return payload;
    }).apply(undefined, [queueResult].concat(_toConsumableArray(payload)));

    if ((0, _utils.isPromise)(result)) {
      return result.then(function (asyncResult) {
        q.setStateValue(asyncResult);
        return next(asyncResult);
      });
    }
    q.setStateValue(result);
    return next(result);
  };
}