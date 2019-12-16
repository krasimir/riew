'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compose = compose;

var _index = require('../../index');

var _ops = require('../ops');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var NOTHING = Symbol('Nothing');

function compose(to, channels) {
  var transform = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return args;
  };

  to = (0, _index.isChannel)(to) ? to : (0, _index.chan)(to, _index.buffer.ever());

  var data = channels.map(function () {
    return NOTHING;
  });
  var composedAtLeastOnce = false;
  channels.forEach(function (id, idx) {
    if ((0, _index.isState)(id)) {
      throw new Error('The second parameter of \'compose\' accepts an array of channels. You passed a state (at index ' + idx + ').');
    }
    if (!(0, _index.isChannel)(id) && !_index.CHANNELS.exists(id)) {
      throw new Error('Channel doesn\'t exists. ' + ch + ' passed to compose.');
    }
    var ch = (0, _index.isChannel)(id) ? id : (0, _index.chan)(id);
    var doComposition = function doComposition(value) {
      data[idx] = value;
      if (composedAtLeastOnce || data.length === 1 || !data.includes(NOTHING)) {
        composedAtLeastOnce = true;
        (0, _ops.sput)(to, transform.apply(undefined, _toConsumableArray(data)));
      }
    };
    (0, _index.sub)(ch, doComposition);
    if ((0, _index.isStateChannel)(ch)) {
      (0, _ops.stake)(ch, doComposition);
    }
  });
  return to;
}