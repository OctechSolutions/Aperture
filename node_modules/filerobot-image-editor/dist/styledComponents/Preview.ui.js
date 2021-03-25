"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FocusPointImg = exports.FocusPointWrap = exports.FocusPointContainer = exports.FocusPoint = exports.PreviewCanvas = exports.PreResizeBox = exports.PreviewImgBox = exports.Canvas = exports.PreviewWrapper = void 0;

var _react = require("react");

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _jsxRuntime = require("react/jsx-runtime");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var PreviewWrapper = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  height: calc(100% - 187px);\n  text-align: center;\n  line-height: calc(100% - 187px);\n  padding: 10px;\n  position: relative;\n  flex-grow: 1;\n  overflow: auto;\n}\n\n  #filerobot-image-editor-root &:before {\n    content: '';\n    display: inline-block;\n    height: 100%;\n    vertical-align: middle;\n  }\n"])));

exports.PreviewWrapper = PreviewWrapper;
var PreResizeBox = (0, _styledComponents.default)('div')(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  display: inline-block;\n  vertical-align: middle;\n  width: 100%;\n}\n"])));
exports.PreResizeBox = PreResizeBox;

var PreviewImgBox = _styledComponents.default.div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  display: inline-block;\n  max-height: 100%;\n  max-width: 100%;\n  height: 100%;\n  vertical-align: middle;\n  overflow: hidden;\n\n  ", ";\n\n   ", ";\n}\n\n  /* Limit image width to avoid overflow the container */\n\n  #filerobot-image-editor-root & img {\n    max-width: 100% !important; /* This rule is very important, please do not ignore this! */\n  }\n\n  #filerobot-image-editor-root & .filerobot-edit-canvas {\n    display: ", ";\n    max-height: 100%;\n    max-width: 100%;\n    vertical-align: middle;\n  }\n"])), function (props) {
  return !props.hideCanvas ? "\n  &:before {\n    content: '';\n    display: inline-block;\n    height: 100%;\n    vertical-align: middle;\n  }" : "\n  canvas {\n    position: relative;\n    left: -9999px;\n  }\n  ";
}, function (p) {
  return p.isShowWatermark && "\ncanvas:after {\n    content: '';\n    position: absolute;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    background: red;\n    opacity: 0.5;\n  }";
}, function (props) {
  return props.hide ? 'none' : 'inline-block';
});

exports.PreviewImgBox = PreviewImgBox;
var PreviewCanvas = (0, _styledComponents.default)('canvas')(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  width: ", "px;\n  height: ", "px;\n  display: inline-block;\n  max-height: 100%;\n  max-width: 100%;\n  vertical-align: middle;\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  margin: auto;\n  outline: 0;\n}\n"])), function (p) {
  return p.width || 0;
}, function (p) {
  return p.height || 0;
});
exports.PreviewCanvas = PreviewCanvas;
var FocusPointWrap = (0, _styledComponents.default)( /*#__PURE__*/(0, _react.forwardRef)(function (_ref, ref) {
  var width = _ref.width,
      height = _ref.height,
      rest = _objectWithoutProperties(_ref, ["width", "height"]);

  return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", _objectSpread(_objectSpread({
    className: "focus-point"
  }, rest), {}, {
    ref: ref
  }));
}))(function (_ref2) {
  var width = _ref2.width,
      height = _ref2.height;
  return {
    width: width,
    height: height,
    position: 'absolute',
    margin: 'auto',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'inline-block',
    maxHeight: '100%',
    maxWidth: '100%',
    verticalAlign: 'middle'
  };
});
exports.FocusPointWrap = FocusPointWrap;
var FocusPointContainer = (0, _styledComponents.default)(function (_ref3) {
  var image = _ref3.image,
      rest = _objectWithoutProperties(_ref3, ["image"]);

  return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", _objectSpread({}, rest));
})(function (_ref4) {
  var image = _ref4.image;
  return _objectSpread({
    position: 'relative',
    height: '100%',
    width: '100%',
    cursor: 'crosshair'
  }, image ? {
    backgroundImage: "url(".concat(image, ")"),
    backgroundSize: 'contain'
  } : {});
});
exports.FocusPointContainer = FocusPointContainer;
var FocusPoint = (0, _styledComponents.default)(function (_ref5) {
  var x = _ref5.x,
      y = _ref5.y,
      visible = _ref5.visible,
      rest = _objectWithoutProperties(_ref5, ["x", "y", "visible"]);

  return /*#__PURE__*/(0, _jsxRuntime.jsx)("span", _objectSpread({}, rest));
})(function (_ref6) {
  var _ref6$x = _ref6.x,
      x = _ref6$x === void 0 ? 0 : _ref6$x,
      _ref6$y = _ref6.y,
      y = _ref6$y === void 0 ? 0 : _ref6$y,
      _ref6$visible = _ref6.visible,
      visible = _ref6$visible === void 0 ? true : _ref6$visible;
  return {
    position: 'absolute',
    top: y,
    left: x,
    visibility: visible ? 'visible' : 'hidden',
    display: 'inline-block',
    width: 30,
    height: 30,
    transform: 'translate(-50%, -50%)',
    fontFamily: 'filerobot-image-editor-font !important',
    color: '#fff',
    fontSize: 30,
    '::before': {
      content: "'\\e919'",
      position: 'absolute',
      top: '50%',
      left: 0,
      textShadow: '0px 0px 3px #000000'
    }
  };
});
exports.FocusPoint = FocusPoint;
var FocusPointImg = (0, _styledComponents.default)(function (_ref7) {
  var visible = _ref7.visible,
      rest = _objectWithoutProperties(_ref7, ["visible"]);

  return /*#__PURE__*/(0, _jsxRuntime.jsx)("img", _objectSpread({}, rest));
})(function (_ref8) {
  var visible = _ref8.visible;
  return {
    visibility: visible ? 'visible' : 'hidden',
    maxWidth: '100%',
    maxHeight: '100%'
  };
}); //watermarkURL
//isShowWatermark

exports.FocusPointImg = FocusPointImg;

var Canvas = _styledComponents.default.canvas.attrs(function () {
  return {};
})(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  display: ", ";\n  max-height: 100%;\n  max-width: 100%;\n  vertical-align: middle;\n}\n"])), function (props) {
  return props.hide ? 'none' : 'inline-block';
});

exports.Canvas = Canvas;