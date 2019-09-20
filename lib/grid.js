"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function Grid() {
  var api = {};
  var nodes = [];

  var add = function add(obj) {
    if (!obj || !obj.id) {
      throw new Error("Each node in the grid must be an object with \"id\" field. Instead \"" + obj + "\" given.");
    }

    nodes.push(obj);
    return api;
  };
  var free = function free(identifier) {
    nodes = nodes.filter(function (n) {
      return n.id !== identifier;
    });
    return api;
  };
  var get = function get(identifier) {
    var node = nodes.find(function (n) {
      return n.id === identifier;
    });

    if (node) {
      return node;
    }
    throw new Error("A node with identifier \"" + identifier + "\" is missing in the grid.");
  };

  api.get = get;
  api.add = add;
  api.free = free;
  api.reset = function () {
    return nodes = [];
  };
  api.nodes = function () {
    return nodes;
  };

  return api;
}

var grid = Grid();

var gridAdd = exports.gridAdd = function gridAdd(node) {
  return grid.add(node);
};
var gridFreeNode = exports.gridFreeNode = function gridFreeNode(node) {
  return grid.free(node.id);
};
var gridReset = exports.gridReset = function gridReset() {
  return grid.reset();
};
var gridGetNode = exports.gridGetNode = function gridGetNode(identifier) {
  return grid.get(identifier);
};
var gridGetNodes = exports.gridGetNodes = function gridGetNodes() {
  return grid.nodes();
};