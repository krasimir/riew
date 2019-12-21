"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _FixedBuffer = require("./FixedBuffer");

var _FixedBuffer2 = _interopRequireDefault(_FixedBuffer);

var _DroppingBuffer = require("./DroppingBuffer");

var _DroppingBuffer2 = _interopRequireDefault(_DroppingBuffer);

var _DivorcedBuffer = require("./DivorcedBuffer");

var _DivorcedBuffer2 = _interopRequireDefault(_DivorcedBuffer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var buffer = {
  fixed: _FixedBuffer2.default,
  dropping: _DroppingBuffer2.default,
  sliding: function sliding(size) {
    return (0, _DroppingBuffer2.default)(size, true);
  },
  divorced: _DivorcedBuffer2.default
};

exports.default = buffer;