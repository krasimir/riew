'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.merge = merge;

var _index = require('../../index');

function merge() {
  var newCh = (0, _index.chan)();

  for (var _len = arguments.length, channels = Array(_len), _key = 0; _key < _len; _key++) {
    channels[_key] = arguments[_key];
  }

  channels.forEach(function (ch) {
    (function taker() {
      (0, _index.stake)(ch, function (v) {
        if (v !== _index.CLOSED && v !== _index.ENDED && newCh.state() === _index.OPEN) {
          (0, _index.sput)(newCh, v, taker);
        }
      });
    })();
  });
  return newCh;
}