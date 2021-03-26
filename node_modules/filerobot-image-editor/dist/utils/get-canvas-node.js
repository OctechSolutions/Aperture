"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCanvasNode = void 0;

var _config = require("../config");

var getCanvasNode = function getCanvasNode(editorWrapperId, id) {
  var originalCanvas = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return window.document.querySelector("#".concat(editorWrapperId, "_").concat(id || (originalCanvas ? _config.ORIGINAL_CANVAS_ID : _config.CANVAS_ID)));
};

exports.getCanvasNode = getCanvasNode;