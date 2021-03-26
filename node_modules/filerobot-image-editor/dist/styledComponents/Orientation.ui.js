"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DarkBtn = exports.ButtonGroup = exports.RotateIcon = exports.RotateButton = exports.RotateWrapper = exports.OrientationWrapper = void 0;

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _styleUtils = require("./styleUtils");

var _Header = require("./Header.ui");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var OrientationWrapper = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  color: ", ";\n  text-align: center;\n}\n  \n  #filerobot-image-editor-root & svg {\n    margin-top: -7px;\n    width: 750px;\n  }\n  \n  #filerobot-image-editor-root & svg text {\n      font-size: 2px;\n    }\n  \n  #filerobot-image-editor-root & .image-editor-range-wrapper {\n    width: 280px;\n    padding: 0;\n    margin: 12px auto 0;\n  }\n  \n  #filerobot-image-editor-root & .image-editor-range-wrapper input#range {\n      background: none;\n      width: 280px;\n    }\n  \n  #filerobot-image-editor-root & .image-editor-range-wrapper input#range::-webkit-slider-thumb {\n        -webkit-appearance: none;\n        width: 9px;\n        height: 18px;\n        border-radius: 50%;\n        background: ", ";\n      }\n  \n  #filerobot-image-editor-root & .image-editor-range-wrapper input#range::-moz-range-thumb {\n        border: none;\n        width: 9px;\n        height: 18px;\n        border-radius: 50%;\n        background: ", ";\n        cursor: pointer;\n      }\n  \n  #filerobot-image-editor-root & .image-editor-range-wrapper label {\n      display: none;\n    }\n  \n  #filerobot-image-editor-root & .image-editor-range-wrapper :after {\n      display: none;\n    }\n  \n  @media (max-width: 768px) {\n    #filerobot-image-editor-root & svg {\n      width: 100%;\n    }\n  }\n"])), function (props) {
  return props.theme.colors.text;
}, function (p) {
  return p.theme.colors.text;
}, function (p) {
  return p.theme.colors.text;
});

exports.OrientationWrapper = OrientationWrapper;

var RotateWrapper = _styledComponents.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  display: inline-block;\n  width: 100%;\n}\n"])));

exports.RotateWrapper = RotateWrapper;

var RotateButton = _styledComponents.default.div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  margin-top: 10px;\n  width: 100%;\n}\n  \n  #filerobot-image-editor-root & button {\n    text-transform: none;\n    font-size: 12px;\n    min-width: 142px;\n    margin-right: 5px;\n  }\n  \n  #filerobot-image-editor-root & button:focus,  #filerobot-image-editor-root & button:active {\n    outline: none !important;\n    box-shadow: none !important;\n  }\n"])));

exports.RotateButton = RotateButton;
var ButtonGroup = (0, _styledComponents.default)('div')(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  display: flex;\n  width: 100%;\n  flex-wrap: wrap;\n  justify-content: center;\n}\n"])));
exports.ButtonGroup = ButtonGroup;

var RotateIcon = _styledComponents.default.span(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  ", ";\n  ", ";\n  height: 16px;\n  font-size: 16px;\n  margin-top: -4px;\n  display: inline-block;\n  vertical-align: middle;\n  color: ", ";\n  margin-right: 5px;\n}\n"])), function (props) {
  return (0, _styleUtils.getIconStyles)(props);
}, function (props) {
  return (0, _styleUtils.getIconByName)(props.name);
}, function (props) {
  return props.theme.colors.text;
});

exports.RotateIcon = RotateIcon;
var DarkBtn = (0, _styledComponents.default)(_Header.CancelBtn)(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n@media (max-width: 768px) {\n#filerobot-image-editor-root & {\n    width: 50%;\n    margin-right: 0 !important\n}\n  }\n"])));
exports.DarkBtn = DarkBtn;