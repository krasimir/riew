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
  var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  var state = _index.OPEN;

  id = id ? (0, _utils.getId)(id) : (0, _utils.getId)('ch');
  buff = buff || _buf2.default.fixed();

  if (_index.CHANNELS.exists(id)) {
    throw new Error('Channel with id "' + id + '" already exists.');
  }

  var channel = function channel(str, name) {
    if (str.length > 1) {
      (0, _utils.setProp)(channel, 'name', str[0] + name + str[1]);
    } else {
      (0, _utils.setProp)(channel, 'name', str[0]);
    }
    return channel;
  };
  channel.id = id;
  channel['@channel'] = true;
  channel.parent = parent;
  var api = _index.CHANNELS.set(id, channel);

  buff.parent = api;

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