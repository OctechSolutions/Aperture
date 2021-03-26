"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isServerSide = void 0;
var isServerSide = typeof window === 'undefined' || typeof CanvasRenderingContext2D === 'undefined';
exports.isServerSide = isServerSide;