"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Registry = {
  __resources: {},
  add: function add(key, value) {
    this.__resources[key] = value;
  },
  get: function get(key) {
    if (this.__resources[key]) {
      return this.__resources[key];
    }
    throw new Error("\"" + key + "\" is missing in the registry.");
  },
  free: function free(key) {
    delete this.__resources[key];
  }
};

exports.default = Registry;