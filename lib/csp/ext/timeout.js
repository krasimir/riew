'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timeout = timeout;

var _index = require('../../index');

function timeout(interval) {
  var ch = (0, _index.chan)();
  setTimeout(function () {
    return (0, _index.close)(ch);
  }, interval);
  return ch;
}