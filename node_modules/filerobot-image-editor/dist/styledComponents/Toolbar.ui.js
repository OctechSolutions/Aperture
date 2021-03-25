"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EffectLabel = exports.EffectIcon = exports.EffectWrapper = exports.EffectsWrapper = exports.ToolLabel = exports.ToolIcon = exports.ToolWrapper = exports.Toolbar = void 0;

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _styleUtils = require("./styleUtils");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Toolbar = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  height: 100px;\n  width: 100%;\n  overflow-x: ", ";\n  overflow-y: ", ";\n  white-space: nowrap;\n  text-align: center;\n}\n  \n  #filerobot-image-editor-root & ::-webkit-scrollbar {\n    height: 10px !important;\n  }\n  \n  #filerobot-image-editor-root & ::-webkit-scrollbar-thumb {\n    background: ", ";\n    border-radius: 5px;\n  }\n  \n  @media (max-width: 768px) {\n#filerobot-image-editor-root & {\n    width: 100%;\n    height: initial;\n    padding: 0 10px\n}\n  }\n"])), function (p) {
  return p.overlayYHidden ? 'auto' : 'none';
}, function (p) {
  return p.overlayYHidden ? 'hidden' : 'visible';
}, function (props) {
  return props.theme.colors.border || '#3b4d54';
});

exports.Toolbar = Toolbar;

var ToolWrapper = _styledComponents.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  padding: 20px 10px;\n  cursor: pointer;\n  display: inline-block;\n  min-width: 80px;\n  min-height: 100px;\n  text-align: center;\n  font-size: 12px;\n  color: ", ";\n  text-transform: ", ";\n  background: ", ";\n}\n  \n  #filerobot-image-editor-root &:hover {\n    color: ", ";\n    background: ", ";\n  }\n"])), function (props) {
  return props.theme.colors.text;
}, function (props) {
  return props.noCapitalStrs ? 'none' : props.tt || 'capitalize';
}, function (props) {
  return props.active ? props.theme.colors.secondaryBg : 'inherit';
}, function (props) {
  return props.theme.colors.textHover;
}, function (props) {
  return props.theme.colors.secondaryBg;
});

exports.ToolWrapper = ToolWrapper;

var ToolIcon = _styledComponents.default.div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  height: 40px;\n  font-size: 40px;\n  \n  ", ";\n  ", ";\n}\n"])), function (props) {
  return (0, _styleUtils.getIconStyles)(props);
}, function (props) {
  return (0, _styleUtils.getIconByName)(props.name);
});

exports.ToolIcon = ToolIcon;

var ToolLabel = _styledComponents.default.div(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  height: 20px;\n  line-height: 20px;\n}\n"])));

exports.ToolLabel = ToolLabel;

var EffectsWrapper = _styledComponents.default.div(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  overflow-x: auto;\n  overflow-y: hidden;\n  white-space: nowrap;\n}\n  \n  #filerobot-image-editor-root & ::-webkit-scrollbar {\n    height: 10px !important;\n  }\n  \n  #filerobot-image-editor-root & ::-webkit-scrollbar-thumb {\n    background: ", ";\n    border-radius: 5px;\n  }\n"])), function (props) {
  return props.theme.colors.border || '#3b4d54';
});

exports.EffectsWrapper = EffectsWrapper;

var EffectWrapper = _styledComponents.default.div(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  display: inline-block;\n  vertical-align: top;\n  padding: 10px;\n  text-align: center;\n  min-width: 90px;\n  height: 90px;\n  cursor: pointer;\n  color: ", ";\n  font-size: 12px;\n  background: ", ";\n}\n  \n  #filerobot-image-editor-root &:hover {\n    background: ", ";\n  }\n"])), function (props) {
  return props.theme.colors.text;
}, function (p) {
  return p.active ? p.theme.colors.secondaryBgHover : 'transparent';
}, function (p) {
  return p.theme.colors.secondaryBgHover;
});

exports.EffectWrapper = EffectWrapper;

var EffectIcon = _styledComponents.default.div(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  background: url('", "') 50% 50% / cover no-repeat;\n  width: 55px;\n  height: 55px;\n  border-radius: 2px;\n  overflow: hidden;\n  display: inline-block;\n}\n"])), function (props) {
  return props.src;
});

exports.EffectIcon = EffectIcon;

var EffectLabel = _styledComponents.default.div(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  text-transform: ", ";\n  height: 20px;\n  line-height: 20px;\n}\n"])), function (p) {
  return p.noCapitalStrs ? 'none' : 'capitalize';
});

exports.EffectLabel = EffectLabel;