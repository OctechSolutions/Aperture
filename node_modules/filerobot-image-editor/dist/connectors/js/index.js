"use strict";

var _reactDom = require("react-dom");

var _ = _interopRequireDefault(require("../../"));

var _jsxRuntime = require("react/jsx-runtime");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FilerobotImageEditor = function FilerobotImageEditor() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var callbacks = arguments.length > 1 ? arguments[1] : undefined;
  var show = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  _classCallCheck(this, FilerobotImageEditor);

  var containerId;

  if (config.elementId) {
    containerId = config.elementId;
  } else if (config.processWithCloudimage || !!config.cloudimage) {
    containerId = 'filerobot-image-editor-cloudimage';
  } else if (config.processWithFilerobot || !!config.filerobot) {
    containerId = 'filerobot-image-editor-uploader';
  } else {
    containerId = 'filerobot-image-editor';
  }

  var container = document.getElementById(containerId);

  var onComplete = function onComplete(src) {
    console.log(src);
  };

  if (callbacks && typeof callbacks === 'function') {
    // to support old syntax
    onComplete = callbacks;
  } else {
    callbacks = callbacks || {};
    onComplete = callbacks.onComplete || onComplete;
  }

  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    document.body.appendChild(container);
  }

  config.elementId = containerId;

  var renderApp = function renderApp(Component) {
    return (0, _reactDom.render)( /*#__PURE__*/(0, _jsxRuntime.jsx)(Component, {
      show: show,
      config: config,
      onComplete: onComplete,
      onBeforeComplete: callbacks.onBeforeComplete,
      onOpen: callbacks.onOpen,
      onClose: callbacks.onClose,
      onError: callbacks.onError
    }), container);
  };

  this.component = renderApp(_.default);
  this.open = this.component.open;
  this.close = this.component.close;

  this.unmount = function () {
    return (0, _reactDom.unmountComponentAtNode)(container);
  };
};

window.FilerobotImageEditor = FilerobotImageEditor;