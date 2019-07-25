"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createRineElement;
function createRineElement(Component) {
  return {
    in: function _in(props) {
      return Component(props);
    },
    out: function out() {}
  };
}