'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _templateObject = _taggedTemplateLiteral(['default'], ['default']);

exports.default = state;

var _index = require('../index');

var _utils = require('../utils');

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var DEFAULT_SELECTOR = function DEFAULT_SELECTOR(v) {
  return v;
};
var DEFAULT_REDUCER = function DEFAULT_REDUCER(_, v) {
  return v;
};
var DEFAULT_ERROR = function DEFAULT_ERROR(e) {
  throw e;
};

function state(initialValue) {
  var _this = this;

  var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  var value = initialValue;
  var id = (0, _utils.getId)('state');
  var children = [];

  function syncChildren(initiator) {
    children.forEach(function (c) {
      if (c.id !== initiator.id) {
        (0, _index.sput)(c, { value: value, syncing: true });
      }
    });
  }

  var api = function api(str, name) {
    if (str.length > 1) {
      (0, _utils.setProp)(api, 'name', str[0] + name + str[1]);
    } else {
      (0, _utils.setProp)(api, 'name', str[0]);
    }
    _index.logger.setWhoName(api.id, api.name);
    return api;
  };

  (0, _utils.setProp)(api, 'name', 'state');

  api.id = id;
  api['@state'] = true;
  api.parent = parent;
  api.children = function () {
    return children;
  };
  api.chan = function () {
    var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_SELECTOR;
    var reducer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_REDUCER;
    var onError = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_ERROR;

    var ch = (0, _index.sliding)(1, 'sliding', id);
    (0, _index.sput)(ch, value);
    ch.afterTake(function (item, cb) {
      try {
        if ((0, _utils.isGeneratorFunction)(selector)) {
          (0, _index.go)(selector, function (routineRes) {
            return cb(routineRes);
          }, [item], id);
          return;
        }
        cb(selector(item));
      } catch (e) {
        onError(e);
      }
    });
    ch.beforePut(function (payload, cb) {
      if (payload !== null && (typeof payload === 'undefined' ? 'undefined' : _typeof(payload)) === 'object' && 'syncing' in payload && payload.syncing) {
        cb(payload.value);
        return;
      }
      try {
        if ((0, _utils.isGeneratorFunction)(reducer)) {
          (0, _index.go)(reducer, function (genResult) {
            value = genResult;
            syncChildren(ch);
            cb(value);
            _index.logger.log(api, 'STATE_VALUE_SET', value);
          }, [value, payload], id);
          return;
        }
        value = reducer(value, payload);
        syncChildren(ch);
        cb(value);
        _index.logger.log(api, 'STATE_VALUE_SET', value);
      } catch (e) {
        onError(e);
      }
    });
    children.push(ch);
    return ch;
  };
  api.select = function (selector, onError) {
    return api.chan(selector, DEFAULT_REDUCER, onError);
  };
  api.mutate = function (reducer, onError) {
    return api.chan(DEFAULT_SELECTOR, reducer, onError);
  };
  api.destroy = function () {
    children.forEach(function (ch) {
      return (0, _index.sclose)(ch);
    });
    value = undefined;
    _index.grid.remove(api);
    _index.logger.log(api, 'STATE_DESTROYED');
    return _this;
  };
  api.get = function () {
    return value;
  };
  api.set = function (newValue) {
    value = newValue;
    syncChildren({});
    _index.logger.log(api, 'STATE_VALUE_SET', newValue);
    return newValue;
  };

  _index.logger.log(api, 'STATE_CREATED');

  api.DEFAULT = api.chan()(_templateObject);

  _index.grid.add(api);

  return api;
}