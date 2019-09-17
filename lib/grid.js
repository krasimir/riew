'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var NAME = '__@@name';
var MAX_NUM_OF_EVENTS = 500;

var ADD_STATE = 'ADD_STATE';
var ADD_NODE = 'ADD_NODE';
var ADD_EFFECT = 'ADD_EFFECT';
var FREE = 'FREE';
var RESET = 'RESET';
var SET_NAME = 'SET_NAME';
var EFFECT_QUEUE_STEP = 'EFFECT_QUEUE_STEP';
var RIEW_RENDER = 'RIEW_RENDER';

function Grid() {
  var api = {};
  var nodes = [];
  var events = [];

  var add = function add(obj) {
    if (!obj || !obj.id) {
      throw new Error('Each node in the grid must be an object with "id" field. Instead "' + obj + '" given.');
    }

    nodes.push(obj);
    return api;
  };
  var free = function free(identifier) {
    nodes = nodes.filter(function (n) {
      return n[NAME] !== identifier && n.id !== identifier;
    });
    return api;
  };
  var get = function get(identifier) {
    var node = nodes.find(function (n) {
      return n[NAME] === identifier || n.id === identifier;
    });

    if (node) {
      return node;
    }
    throw new Error('A node with identifier "' + identifier + '" is missing in the grid.');
  };

  api.dispatch = function (type, payload) {
    switch (type) {
      case ADD_STATE:
      case ADD_NODE:
      case ADD_EFFECT:
        add(payload);
        break;
      case FREE:
        free(payload);
        break;
      case RESET:
        nodes = [];
        break;
      case SET_NAME:
        var node = get(payload[0].id);

        node[NAME] = payload[1];
        break;
    }
    if (__DEV__) {
      events.push([type, payload]);
      if (events.length > MAX_NUM_OF_EVENTS) {
        events.shift();
      }
    }
  };
  api.get = get;
  api.nodes = function () {
    return nodes;
  };

  return api;
}

var grid = Grid();

var gridAdd = exports.gridAdd = function gridAdd(node) {
  return grid.dispatch(ADD_NODE, node);
};
var gridAddState = exports.gridAddState = function gridAddState(state) {
  return grid.dispatch(ADD_STATE, state);
};
var gridAddEffect = exports.gridAddEffect = function gridAddEffect(node) {
  return grid.dispatch(ADD_EFFECT, node);
};
var gridFreeNode = exports.gridFreeNode = function gridFreeNode(identifier) {
  return grid.dispatch(FREE, identifier);
};
var gridReset = exports.gridReset = function gridReset() {
  return grid.dispatch(RESET);
};
var gridSetNodeName = exports.gridSetNodeName = function gridSetNodeName(node, name) {
  return grid.dispatch(SET_NAME, [node, name]);
};
var gridEffectQueueStep = exports.gridEffectQueueStep = function gridEffectQueueStep(payload) {
  return grid.dispatch(EFFECT_QUEUE_STEP, payload);
};
var gridRiewRender = exports.gridRiewRender = function gridRiewRender(payload) {
  return grid.dispatch(RIEW_RENDER, payload);
};
var gridGetNode = exports.gridGetNode = function gridGetNode(identifier) {
  return grid.get(identifier);
};
var gridGetNodes = exports.gridGetNodes = function gridGetNodes() {
  return grid.nodes();
};