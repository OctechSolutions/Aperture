"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SaveActionsBackdrop = exports.SaveActionsItem = exports.SaveActionsMenu = exports.SaveActionsSlideButton = exports.SaveActions = void 0;

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _Button = require("./Button");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var SaveActions = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  display: inline-block;\n  margin-left: 1px;\n}\n"])));

exports.SaveActions = SaveActions;
var SaveActionsSlideButton = (0, _styledComponents.default)(_Button.Button)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  height: 32px;\n  width: 32px;\n  min-width: 32px;\n  border-radius: 0px 2px 2px 0px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n  #filerobot-image-editor-root & i {\n    border: solid #fff;\n    border-width: 0 2px 2px 0;\n    display: inline-block;\n    padding: 2px;\n    transform: rotate(45deg);\n  }\n"])));
exports.SaveActionsSlideButton = SaveActionsSlideButton;

var SaveActionsMenu = _styledComponents.default.div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  position: absolute;\n  top: 31px;\n  left: 0;\n  min-width: 146px;\n  z-index: 1111;\n  box-shadow: 0 2px 4px rgba(77, 78, 78, 0.25);\n  border-radius: 0 0 2px 2px;\n  background: ", ";\n  color: ", ";\n}\n"])), function (props) {
  var _props$theme$colors, _props$theme$colors$b, _props$theme$colors2;

  return ((_props$theme$colors = props.theme.colors) === null || _props$theme$colors === void 0 ? void 0 : (_props$theme$colors$b = _props$theme$colors.button) === null || _props$theme$colors$b === void 0 ? void 0 : _props$theme$colors$b.secondary) || ((_props$theme$colors2 = props.theme.colors) === null || _props$theme$colors2 === void 0 ? void 0 : _props$theme$colors2.accent) || '#ccc';
}, function (props) {
  return props.theme.colors.text || '#fff';
});

exports.SaveActionsMenu = SaveActionsMenu;

var SaveActionsItem = _styledComponents.default.div(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  cursor: pointer;\n  font-size: 12px;\n  line-height: 14px;\n  padding: 9px 12px;\n  text-align: center;\n}\n\n  #filerobot-image-editor-root &:hover {\n    backdrop-filter: brightness(0.95);\n  }\n"])));

exports.SaveActionsItem = SaveActionsItem;

var SaveActionsBackdrop = _styledComponents.default.div(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  z-index: 1110;\n}\n"])));

exports.SaveActionsBackdrop = SaveActionsBackdrop;