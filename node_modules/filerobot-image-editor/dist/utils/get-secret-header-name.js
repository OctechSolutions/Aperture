"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSecretHeaderName = void 0;

var getSecretHeaderName = function getSecretHeaderName() {
  var platform = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'filerobot';
  return platform === 'filerobot' ? "X-Filerobot-Key" : "X-Airstore-Secret-Key";
};

exports.getSecretHeaderName = getSecretHeaderName;