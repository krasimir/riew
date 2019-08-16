"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var items = {};
var resolver = function resolver(key) {
  if (items[key]) {
    return items[key];
  }
  throw new Error("Rine registry: missing \"" + key + "\".");
};

var Registry = {
  __resolver: resolver,
  set: function set(key, value) {
    items[key] = value;
  },
  get: function get(key) {
    return this.__resolver(key);
  },
  getBulk: function getBulk(arr) {
    var _this = this;

    return arr.reduce(function (all, key) {
      all[key] = _this.get(key);
      return all;
    }, {});
  },
  remove: function remove(key) {
    delete items[key];
  },
  resolver: function resolver(r) {
    this.__resolver = r;
  },
  reset: function reset() {
    items = {};
    this.__resolver = resolver;
  }
};

exports.default = Registry;