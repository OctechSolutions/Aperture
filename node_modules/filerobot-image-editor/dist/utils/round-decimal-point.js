"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.roundDecimalPoint = void 0;

var roundDecimalPoint = function roundDecimalPoint(number) {
  var numbersAfterDecimalToHave = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  return parseFloat(number).toFixed(numbersAfterDecimalToHave);
};

exports.roundDecimalPoint = roundDecimalPoint;