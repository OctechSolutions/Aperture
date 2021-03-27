"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deepCopy = void 0;

var deepCopy = function deepCopy(object) {
  return JSON.parse(JSON.stringify(object));
};

exports.deepCopy = deepCopy;