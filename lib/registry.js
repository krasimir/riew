"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Registry = {
  __resources: {},
  __resolver: function __resolver(key) {
    if (this.__resources[key]) {
      return this.__resources[key];
    }
    throw new Error("\"" + key + "\" is missing in the registry.");
  },
  __dissolver: function __dissolver(key) {
    delete this.__resources[key];
    return key;
  },
  add: function add(key, value) {
    this.__resources[key] = value;
  },
  get: function get(key) {
    return this.__resolver(key);
  },
  free: function free(key) {
    return this.__dissolver(key);
  },
  custom: function custom(_ref) {
    var resolver = _ref.resolver,
        dissolver = _ref.dissolver;

    this.__resolver = resolver;
    this.__dissolver = dissolver;
  }
};

exports.default = Registry;