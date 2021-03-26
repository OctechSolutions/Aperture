"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CancelBtn = exports.ToolbarWrapper = exports.BackBtnSeparator = exports.BackButtonWrapper = exports.ButtonsWrapper = exports.Title = exports.HeaderTop = exports.HeaderWrapper = void 0;

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _Button = require("./Button");

var _styleUtils = require("./styleUtils");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var HeaderWrapper = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  background: ", ";\n}\n"])), function (props) {
  return props.theme.colors.secondaryBg;
});

exports.HeaderWrapper = HeaderWrapper;

var HeaderTop = _styledComponents.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  border-bottom: 1px solid ", ";\n  background: ", ";\n  height: 46px;\n  line-height: 46px;\n  position: relative;\n}\n"])), function (props) {
  return props.theme.colors.primaryBg;
}, function (props) {
  return props.theme.colors.primaryBg;
});

exports.HeaderTop = HeaderTop;

var Title = _styledComponents.default.div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  text-align: center;\n  text-transform: ", ";\n  color: ", ";\n}\n"])), function (props) {
  return props.noCapitalStrs ? 'none' : 'capitalize';
}, function (props) {
  return props.theme.colors.text;
});

exports.Title = Title;

var ButtonsWrapper = _styledComponents.default.div(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  position: absolute;\n  top: 7px;\n  left: 12px;\n  display: flex;\n  align-items: center;\n}\n"])));

exports.ButtonsWrapper = ButtonsWrapper;

var BackButtonWrapper = _styledComponents.default.div(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  height: 32px;\n  display: flex;\n  align-items: center;\n}\n\n  #filerobot-image-editor-root & svg {\n    cursor: pointer;\n    padding: 9px 12px 9px 0;\n    width: 38px;\n    height: 32px;\n  }\n\n  #filerobot-image-editor-root & svg path {\n      fill: ", ";\n    }\n\n  #filerobot-image-editor-root & svg:hover {\n      filter: brightness(0.7);\n    }\n"])), function (props) {
  return props.theme.colors.text;
});

exports.BackButtonWrapper = BackButtonWrapper;

var BackBtnSeparator = _styledComponents.default.div(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  height: 100%;\n  width: 1px;\n  display: inline-block;\n  margin-right: 12px;\n  background: ", ";\n}\n"])), function (props) {
  return props.theme.colors.border;
});

exports.BackBtnSeparator = BackBtnSeparator;
var CancelBtn = (0, _styledComponents.default)(_Button.Button)(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  background: ", ";\n  border-color: ", ";\n  color: ", ";\n  text-transform: ", ";\n  min-width: 62px;\n  height: 32px;\n  margin-right: 8px;\n  border: 0;\n}\n\n  #filerobot-image-editor-root &:hover {\n    background: ", ";\n    border-color: ", ";\n    color: ", ";  \n  }\n"])), function (props) {
  return props.theme.colors.primaryBg;
}, function (props) {
  return props.theme.colors.primaryBg;
}, function (props) {
  return props.theme.colors.text;
}, function (props) {
  return props.noCapitalStrs ? 'none' : 'capitalize';
}, function (props) {
  return (0, _styleUtils.getHoverColor)(props.theme.colors.primaryBg);
}, function (props) {
  return props.theme.colors.primaryBg;
}, function (props) {
  return props.theme.colors.text;
});
exports.CancelBtn = CancelBtn;

var ToolbarWrapper = _styledComponents.default.div(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 100px;\n  background: ", ";\n}\n  \n  @media (max-width: 768px) {\n#filerobot-image-editor-root & {\n    flex-direction: column;\n    height: initial\n}\n  }\n"])), function (props) {
  return props.theme.colors.secondaryBg;
});

exports.ToolbarWrapper = ToolbarWrapper;