"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLabel = void 0;

var getLabel = function getLabel() {
  var label = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return label.replace(/_/g, ' ');
};

exports.getLabel = getLabel;