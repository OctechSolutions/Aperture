"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height) {
  var radius = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

  if (!radius) {
    radius = width >= height ? width / 2 : height / 2;
  } else {
    if (width < 2 * radius) radius = width / 2;
    if (height < 2 * radius) radius = height / 2;
  }

  this.beginPath();
  this.moveTo(x + radius, y);
  this.arcTo(x + width, y, x + width, y + height, radius);
  this.arcTo(x + width, y + height, x, y + height, radius);
  this.arcTo(x, y + height, x, y, radius);
  this.arcTo(x, y, x + width, y, radius);
  this.closePath();
  return this;
};

CanvasRenderingContext2D.prototype.round = function () {
  var _this$canvas = this.canvas,
      width = _this$canvas.width,
      height = _this$canvas.height;
  this.imageSmoothingEnabled = true;
  this.globalCompositeOperation = 'destination-in';
  this.strokeStyle = 'transparent';
  this.lineWidth = 1;
  this.beginPath(); // roundRect is a manually written protoype method from canvas-round-rect file in utils.

  this.roundRect(0, 0, width, height, Math.max(width, height));
  this.fill();
  this.globalCompositeOperation = 'source-over';
  return this;
};

var _default = CanvasRenderingContext2D;
exports.default = _default;