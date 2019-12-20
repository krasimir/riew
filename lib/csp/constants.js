"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var OPEN = exports.OPEN = Symbol("OPEN");
var CLOSED = exports.CLOSED = Symbol("CLOSED");
var ENDED = exports.ENDED = Symbol("ENDED");
var PUT = exports.PUT = "PUT";
var TAKE = exports.TAKE = "TAKE";
var NOOP = exports.NOOP = "NOOP";
var SLEEP = exports.SLEEP = "SLEEP";
var STOP = exports.STOP = "STOP";
var SUB = exports.SUB = "SUB";
var CALL_ROUTINE = exports.CALL_ROUTINE = "CALL_ROUTINE";
var FORK_ROUTINE = exports.FORK_ROUTINE = "FORK_ROUTINE";

var CHANNELS = exports.CHANNELS = {
  channels: {},
  getAll: function getAll() {
    return this.channels;
  },
  get: function get(id) {
    return this.channels[id];
  },
  set: function set(id, ch) {
    this.channels[id] = ch;
    return ch;
  },
  del: function del(id) {
    delete this.channels[id];
  },
  exists: function exists(id) {
    return !!this.channels[id];
  },
  reset: function reset() {
    this.channels = {};
  }
};