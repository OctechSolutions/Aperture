"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleModalFullscreen = void 0;

var _config = require("../config");

var toggleModalFullscreen = function toggleModalFullscreen(configElementId) {
  var exit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  // It should be .getElementById but it is not as user might have multiple blocks with same ID (which is not right)
  // but we do that for making sure right implementation most of the time
  // so that we would have the last added block with that ID to be fullscreened as most probably it would be the plugin.
  var foundElements = document.querySelectorAll("#".concat(configElementId || _config.MODAL_ID));
  var element = foundElements[foundElements.length - 1];

  if (!element) {
    return;
  }

  document.fullscreenElement = document.fullscreenElement || document.mozFullscreenElement || document.msFullscreenElement || document.webkitFullscreenDocument;
  document.exitFullscreen = document.exitFullscreen || document.mozExitFullscreen || document.msExitFullscreen || document.webkitExitFullscreen;
  element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.msRequestFullscreen || element.webkitRequestFullscreen;

  if (!document.fullscreenElement && !exit) {
    element.requestFullscreen().catch(function (err) {
      alert("Error attempting to enable full-screen mode: ".concat(err.message, " (").concat(err.name, ")"));
    });
  } else if (document.exitFullscreen && document.fullscreenElement) {
    document.exitFullscreen();
  }
};

exports.toggleModalFullscreen = toggleModalFullscreen;