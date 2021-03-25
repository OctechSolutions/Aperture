"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SuggestionOption = exports.SuggestionsBox = exports.PreResizeInner = exports.PreResizeWarning = exports.PreResizeActions = exports.ResizeBox = exports.ResizeWrapper = void 0;

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var ResizeWrapper = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  color: ", ";\n  text-align: center;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n  \n  @media (max-width: 768px) {\n#filerobot-image-editor-root & {\n    flex-direction: column\n}\n  }\n"])), function (props) {
  return props.theme.colors.text;
});

exports.ResizeWrapper = ResizeWrapper;

var ResizeBox = _styledComponents.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  display: flex;\n  width: 100%;\n  justify-content: center;\n  align-items: flex-end;\n  padding: 8px 0 20px;\n  margin: 0 auto;\n}\n\n  @media (min-width: 768px) {\n#filerobot-image-editor-root & {\n    width: 500px;\n    margin: 0\n}\n  }\n"])));

exports.ResizeBox = ResizeBox;
var PreResizeActions = (0, _styledComponents.default)('div')(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & button {\n    min-width: 240px;\n  }\n\n    @media(max-width: 768px) {\n#filerobot-image-editor-root & button {\n      min-width: 174px\n  }\n    }\n"])));
exports.PreResizeActions = PreResizeActions;
var PreResizeWarning = (0, _styledComponents.default)('p')(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  color: ", ";\n  font-size: 14px;\n  max-width: 600px;\n  line-height: 1.4;\n  margin: 0 auto;\n  background: ", ";\n  border-radius: 4px;\n  padding: 15px 15px 15px 55px;\n  position: relative;\n  font-weight: normal;\n  text-align: left;\n}\n  \n  #filerobot-image-editor-root &:before {\n    content: '\\e917';\n    font-family: filerobot-image-editor-font;\n    position: absolute;\n    font-size: 20px;\n    line-height: 20px;\n    left: 20px;\n    top: 50%;\n    margin-top: -10px;\n  }\n"], ["\n#filerobot-image-editor-root & {\n  color: ", ";\n  font-size: 14px;\n  max-width: 600px;\n  line-height: 1.4;\n  margin: 0 auto;\n  background: ", ";\n  border-radius: 4px;\n  padding: 15px 15px 15px 55px;\n  position: relative;\n  font-weight: normal;\n  text-align: left;\n}\n  \n  #filerobot-image-editor-root &:before {\n    content: '\\\\e917';\n    font-family: filerobot-image-editor-font;\n    position: absolute;\n    font-size: 20px;\n    line-height: 20px;\n    left: 20px;\n    top: 50%;\n    margin-top: -10px;\n  }\n"])), function (p) {
  return p.theme.colors.textWarn;
}, function (p) {
  return p.theme.colors.secondaryBg;
});
exports.PreResizeWarning = PreResizeWarning;
var PreResizeInner = (0, _styledComponents.default)('div')(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  max-width: 600px;\n  margin: 15px auto;\n  background: ", ";\n  border-radius: 4px;\n  padding: 2px;\n}\n  \n  #filerobot-image-editor-root & h4 {\n    line-height: 1.4;\n    margin: 0;\n    font-size: 16px;\n    color: ", ";\n  }\n"])), function (p) {
  return p.theme.colors.secondaryBg;
}, function (p) {
  return p.theme.colors.text;
});
exports.PreResizeInner = PreResizeInner;
var SuggestionsBox = (0, _styledComponents.default)('div')(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  display: inline-block;\n}\n"])));
exports.SuggestionsBox = SuggestionsBox;
var SuggestionOption = (0, _styledComponents.default)('div')(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  display: inline-block;\n  background: ", ";\n  padding: 15px;\n  margin: 5px;\n  border-radius: 4px;\n  cursor: pointer;\n}\n  \n  #filerobot-image-editor-root &:hover {\n    background-color: ", ";\n  }\n"])), function (p) {
  return p.theme.colors.primaryBg;
}, function (p) {
  return p.theme.colors.primaryBgHover;
});
exports.SuggestionOption = SuggestionOption;