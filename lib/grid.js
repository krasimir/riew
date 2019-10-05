'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('./utils');

function Subscription(name, callback) {
  return {
    name: name || (0, _utils.getId)('sub'),
    callback: callback
  };
}

function Grid() {
  var gridAPI = {};
  var nodes = [];
  var s11s = {};

  function getSubscriptionName(target, source) {
    return (target ? target.id : (0, _utils.getId)('target')) + '_' + (source ? source.id : (0, _utils.getId)('source'));
  }
  function getSourceSubscriptions(source, type) {
    if (!source) {
      return Object.keys(s11s).reduce(function (ss, sourceId) {
        ss = ss.concat(s11s[sourceId][type] || []);
        return ss;
      }, []);
    }
    if (!s11s[source.id]) s11s[source.id] = {};
    if (!s11s[source.id][type]) s11s[source.id][type] = [];
    return s11s[source.id][type];
  }

  gridAPI.add = function (product) {
    if (!product || !product.id) {
      throw new Error('Each node in the grid must be an object with "id" field. Instead "' + product + '" given.');
    }
    nodes.push(product);
  };;
  gridAPI.remove = function (product) {
    nodes = nodes.filter(function (_ref) {
      var id = _ref.id;
      return id !== product.id;
    });
  };;
  gridAPI.reset = function () {
    nodes = [];
    s11s = {};
  };
  gridAPI.nodes = function () {
    return nodes;
  };
  gridAPI.getNodeById = function (nodeId) {
    return nodes.find(function (_ref2) {
      var id = _ref2.id;
      return id === nodeId;
    });
  };
  gridAPI.subscribe = function (target) {
    var api = {};
    var source = void 0;

    api.to = function (x) {
      return source = x, api;
    };
    api.when = function (type, callback) {
      var subscriptionSource = source ? source : { id: (0, _utils.getId)('sub_actor') };
      var ss = getSourceSubscriptions(subscriptionSource, type);
      var subscriptionName = getSubscriptionName(target, subscriptionSource);
      var subscription = ss.find(function (s) {
        return s.name === subscriptionName;
      });

      if (!subscription) {
        ss.push(subscription = Subscription(subscriptionName, callback));
      }
      return api;
    };

    return api;
  };
  gridAPI.emit = function (type) {
    var api = {};
    var source = void 0;

    api.from = function (x) {
      return source = x, api;
    };
    api.with = function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      getSourceSubscriptions(source, type).forEach(function (s) {
        return s.callback.apply(s, args);
      });
    };

    return api;
  };
  gridAPI.unsubscribe = function (target) {
    return {
      from: function from(source) {
        var subscriptionName = getSubscriptionName(target, source);

        if (s11s[source.id]) {
          Object.keys(s11s[source.id]).forEach(function (type) {
            if (target) {
              s11s[source.id][type] = s11s[source.id][type].filter(function (_ref3) {
                var name = _ref3.name;
                return name !== subscriptionName;
              });
            } else {
              s11s[source.id][type] = [];
            }
          });
        }
      }
    };
  };
  gridAPI.off = function (source) {
    s11s[source.id] = {};
  };

  return gridAPI;
}

var grid = Grid();

exports.default = grid;