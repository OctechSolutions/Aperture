"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWatermarkSquaredPosition = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var getWatermarkSquaredPosition = function getWatermarkSquaredPosition() {
  var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'center';
  var canvas = arguments.length > 1 ? arguments[1] : undefined;
  var width = arguments.length > 2 ? arguments[2] : undefined;
  var height = arguments.length > 3 ? arguments[3] : undefined;
  var canvasRect = canvas.getBoundingClientRect();
  var scaleRatio = 30 / 100; // 30%

  var scaledHeight = canvasRect.height * scaleRatio;
  var scaledWidth = canvasRect.width * scaleRatio;

  if (scaledWidth < width || scaledHeight < height) {
    var aspectRatio = width / height;

    if (height > width) {
      height = scaledHeight;
      width = height * aspectRatio;
    } else {
      width = scaledWidth;
      height = width / aspectRatio;
    }
  }

  var centerPositionX = canvasRect.width / 2 - width / 2;
  var centerPositionY = canvasRect.height / 2 - height / 2;

  if (position === 'center') {
    return [centerPositionX, centerPositionY, width, height];
  }

  position = position.split('-');
  var paddingSpace = 1.5 / 100; // 1.5%

  var widthSpace = canvasRect.width * paddingSpace;
  var heightSpace = canvasRect.height * paddingSpace;
  var rightPosition = canvasRect.width - width - widthSpace;
  var bottomPosition = canvasRect.height - height - heightSpace;
  return [].concat(_toConsumableArray(position.map(function (p, i) {
    if (p === 'center') {
      return i === 0 ? centerPositionX : centerPositionY;
    }

    if (p === 'right') {
      return rightPosition;
    }

    if (p === 'bottom') {
      return bottomPosition;
    }

    if (p === 'left') {
      return widthSpace;
    }

    if (p === 'top') {
      return heightSpace;
    }
  })), [width, height]);
};

exports.getWatermarkSquaredPosition = getWatermarkSquaredPosition;