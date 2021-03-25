"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CloseBtn = void 0;

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _styleUtils = require("./styleUtils");

var _templateObject;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var CloseBtn = _styledComponents.default.span.attrs(function () {
  return {
    role: 'button'
  };
})(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  cursor: pointer;\n  position: absolute;\n  font-weight: normal;\n  top: ", ";\n  right: ", ";\n  left: ", ";\n  bottom: ", ";\n  font-size: ", ";\n  z-index: 10;\n  speak: none;\n  color: ", ";\n  font-family: 'filerobot-image-editor-font' !important;\n  font-style: normal;\n  font-variant: normal;\n  text-transform: none;\n\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n  \n  #filerobot-image-editor-root &:hover {\n    filter: brightness(0.7);\n  }\n  \n  #filerobot-image-editor-root &:before {\n    content: '\\e90c';\n  }\n"], ["\n#filerobot-image-editor-root & {\n  cursor: pointer;\n  position: absolute;\n  font-weight: normal;\n  top: ", ";\n  right: ", ";\n  left: ", ";\n  bottom: ", ";\n  font-size: ", ";\n  z-index: 10;\n  speak: none;\n  color: ", ";\n  font-family: 'filerobot-image-editor-font' !important;\n  font-style: normal;\n  font-variant: normal;\n  text-transform: none;\n\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n  \n  #filerobot-image-editor-root &:hover {\n    filter: brightness(0.7);\n  }\n  \n  #filerobot-image-editor-root &:before {\n    content: '\\\\e90c';\n  }\n"])), function (props) {
  return props.t || 0;
}, function (props) {
  return props.r || '12px';
}, function (props) {
  return props.l;
}, function (props) {
  return props.b || 'auto';
}, function (props) {
  return props.fz || '22px';
}, function (props) {
  return props.theme.colors.text;
});

exports.CloseBtn = CloseBtn;