'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.react = exports.compose = exports.merge = exports.state = undefined;

var _state = require('./state');

var _react = require('./react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var state = exports.state = _state.createState;
var merge = exports.merge = _state.mergeStates;
var compose = exports.compose = _utils.compose;
var react = exports.react = { routine: _react2.default };