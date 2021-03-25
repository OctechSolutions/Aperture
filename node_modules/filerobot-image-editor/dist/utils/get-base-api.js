"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBaseAPI = void 0;

var _ = require(".");

var getBaseAPI = function getBaseAPI(baseAPI, container, platform) {
  return baseAPI ? baseAPI + '/' : (0, _.getBaseUrl)(container, platform);
};

exports.getBaseAPI = getBaseAPI;