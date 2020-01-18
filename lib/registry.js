"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint-disable no-use-before-define */
function Registry() {
  var api = {};
  var products = {};

  api.defineProduct = function (type, func) {
    if (products[type]) {
      throw new Error("A resource with type \"" + type + "\" already exists.");
    }
    products[type] = func;
  };
  api.undefineProduct = function (type) {
    if (!products[type]) {
      throw new Error("There is no resource with type \"" + type + "\" to be removed.");
    }
    delete products[type];
  };
  api.produce = function (type) {
    var _products;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (!products[type]) {
      throw new Error("There is no resource with type \"" + type + "\".");
    }
    return (_products = products)[type].apply(_products, args);
  };
  api.reset = function () {
    products = {};
  };
  api.debug = function () {
    return {
      productNames: Object.keys(products)
    };
  };

  return api;
}

var r = Registry();

exports.default = r;