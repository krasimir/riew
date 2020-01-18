'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = chan;

var _utils = require('../utils');

var _index = require('../index');

var _buf = require('./buf');

var _buf2 = _interopRequireDefault(_buf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function chan(id, buff) {
  var state = _index.OPEN;

  id = id || (0, _utils.getId)('ch');
  buff = buff || _buf2.default.fixed();

  if (_index.CHANNELS.exists(id)) {
    throw new Error('Channel with id "' + id + '" already exists.');
  }

  var api = _index.CHANNELS.set(id, {
    id: id,
    '@channel': true
  });

  buff.parent = api.id;

  api.isActive = function () {
    return api.state() === _index.OPEN;
  };
  api.buff = buff;
  api.state = function (s) {
    if (typeof s !== 'undefined') state = s;
    return state;
  };
  api.value = function () {
    return buff.getValue();
  };
  api.beforePut = buff.beforePut;
  api.afterPut = buff.afterPut;
  api.beforeTake = buff.beforeTake;
  api.afterTake = buff.afterTake;
  api.exportAs = function (key) {
    return (0, _index.register)(key, api);
  };
  _index.grid.add(api);
  _index.logger.log(api, 'CHANNEL_CREATED');

  return api;
}