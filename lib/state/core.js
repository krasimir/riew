'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createCore;

var _fastDeepEqual = require('fast-deep-equal');

var _fastDeepEqual2 = _interopRequireDefault(_fastDeepEqual);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createCore(initialValue) {
  var api = {};
  var active = true;
  var value = initialValue;
  var listeners = [];
  var createdQueues = [];

  api.id = (0, _utils.getId)('s');
  api.triggerListeners = function () {
    listeners.forEach(function (l) {
      return l();
    });
  };

  api.get = function () {
    return value;
  };
  api.set = function (newValue) {
    var isEqual = (0, _fastDeepEqual2.default)(value, newValue);

    value = newValue;
    if (!isEqual) api.triggerListeners();
  };
  api.teardown = function () {
    createdQueues.forEach(function (q) {
      return q.teardown();
    });
    createdQueues = [];
    listeners = [];
    active = false;
  };
  api.addQueue = function (q) {
    createdQueues.push(q);
  };
  api.removeQueue = function (q) {
    createdQueues = createdQueues.filter(function (_ref) {
      var id = _ref.id;
      return q.id !== id;
    });
  };
  api.isActive = function () {
    return active;
  };
  api.createdQueues = function () {
    return createdQueues;
  };
  api.listeners = function () {
    return listeners;
  };
  api.addListener = function (trigger) {
    listeners.push(trigger);
  };
  api.removeListener = function (trigger) {
    listeners = listeners.filter(function (_ref2) {
      var id = _ref2.id;
      return id !== trigger.id;
    });
  };

  return api;
};