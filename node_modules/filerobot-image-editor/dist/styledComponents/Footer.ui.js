"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Switcher = exports.FullscreenBtn = exports.ResetBtn = exports.NextBtn = exports.PreviousBtn = exports.Footer = void 0;

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _styleUtils = require("./styleUtils");

var _jsxRuntime = require("react/jsx-runtime");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10, _templateObject11, _templateObject12;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Footer = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  background: ", ";\n  border-top: 1px solid ", ";\n  height: 35px;\n  position: relative;\n  z-index: 1;\n}\n"])), function (props) {
  return props.theme.colors.secondaryBg;
}, function (props) {
  return props.theme.colors.border;
});

exports.Footer = Footer;

var PreviousBtn = _styledComponents.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  ", ";\n  ", ";\n  \n  ", ";\n}\n"])), function (props) {
  return (0, _styleUtils.getIconStyles)(props);
}, (0, _styleUtils.getIconByName)('previous'), function (props) {
  return getActionIconStyle(props);
});

exports.PreviousBtn = PreviousBtn;

var NextBtn = _styledComponents.default.div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  ", ";\n  ", ";\n  \n  ", ";\n}\n"])), function (props) {
  return (0, _styleUtils.getIconStyles)(props);
}, (0, _styleUtils.getIconByName)('next'), function (props) {
  return getActionIconStyle(props);
});

exports.NextBtn = NextBtn;

var ResetBtn = _styledComponents.default.div(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  ", ";\n  ", ";\n  \n  ", ";\n}\n"])), function (props) {
  return (0, _styleUtils.getIconStyles)(props);
}, (0, _styleUtils.getIconByName)('reset'), function (props) {
  return getActionIconStyle(props);
});

exports.ResetBtn = ResetBtn;

var FullscreenBtn = _styledComponents.default.div(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  ", ";\n  ", ";\n  \n  ", ";\n}\n"])), function (props) {
  return (0, _styleUtils.getIconStyles)(props);
}, (0, _styleUtils.getIconByName)('full-screen'), function (props) {
  return getActionIconStyle(props);
});

exports.FullscreenBtn = FullscreenBtn;

var SwitcherWrapper = _styledComponents.default.div(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  position: relative; \n  display: inline-block;\n  vertical-align: middle;\n  width: 60px;\n  margin-bottom: 2px;\n  -webkit-user-select: none; \n  -moz-user-select: none; \n  -ms-user-select: none;\n}\n"])));

var SwitcherInput = _styledComponents.default.input(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  display: none !important;\n}\n  \n  #filerobot-image-editor-root & :checked + .onoffswitch-label .onoffswitch-inner {\n    margin-left: 0;\n}\n"])));

var SwitcherLabel = _styledComponents.default.label(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  display: block; \n  overflow: hidden; \n  cursor: pointer;\n  border: 1px solid ", "; \n  border-radius: 4px;\n  margin: 0;\n}\n"])), function (p) {
  return p.theme.colors.border;
});

var SwitcherInner = _styledComponents.default.span(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  display: block; \n  width: 200%; \n  margin-left: ", ";\n  transition: margin 0.3s ease-in 0s;\n}\n  \n  #filerobot-image-editor-root &:before, #filerobot-image-editor-root &:after {\n    display: block; float: left; width: 50%; height: 19px; padding: 0; line-height: 19px;\n    font-size: 10px; color: white; font-family: Trebuchet, Arial, sans-serif; font-weight: bold;\n    box-sizing: border-box;\n  }\n  \n  #filerobot-image-editor-root &:before {\n    content: \"ON\";\n    padding-left: 10px !important;\n    background-color: ", "; \n    color: #fff;\n  }\n  \n  #filerobot-image-editor-root &:after {\n    content: \"OFF\";\n    padding-right: 10px !important;\n    background-color: ", "; \n    color: #aaa;\n    text-align: right;\n  }\n"])), function (props) {
  return props.checked ? '0' : '-100%';
}, function (p) {
  var _p$theme$colors$butto;

  return ((_p$theme$colors$butto = p.theme.colors.button) === null || _p$theme$colors$butto === void 0 ? void 0 : _p$theme$colors$butto.primary) || '#01717d';
}, function (p) {
  return p.theme.colors.primaryBg;
});

var SwitcherSwitch = _styledComponents.default.span(_templateObject10 || (_templateObject10 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n    display: block; \n    width: 10px;\n    height: 10px;\n    margin: 5.5px;\n    background: ", ";\n    position: absolute; top: 0; bottom: 0;\n    right:  ", ";\n    border: 1px solid ", "; \n    border-radius: 12px;\n    transition: all 0.3s ease-in 0s;\n}\n"])), function (p) {
  return p.theme.colors.accent;
}, function (props) {
  return props.checked ? '0' : '37px';
}, function (p) {
  return p.theme.colors.accent;
});

var SwitcherBlock = (0, _styledComponents.default)('div').attrs(function () {
  return {
    className: 'cloudimage-url-generator-switch'
  };
})(_templateObject11 || (_templateObject11 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  display: inline-block;\n  vertical-align: middle;\n  line-height: 30px;\n  margin-right: 10px;\n  float: right;\n}\n"])));
var SwitcherText = (0, _styledComponents.default)('div')(_templateObject12 || (_templateObject12 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  margin-left: 8px;\n  display: inline-block;\n  vertical-align: middle;\n  color: ", ";\n  margin-bottom: 3px;\n  cursor: pointer;\n}\n"])), function (p) {
  return p.theme.colors.text;
});

var Switcher = function Switcher(_ref) {
  var id = _ref.id,
      handleChange = _ref.handleChange,
      text = _ref.text,
      checked = _ref.checked,
      style = _ref.style,
      otherProps = _objectWithoutProperties(_ref, ["id", "handleChange", "text", "checked", "style"]);

  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(SwitcherBlock, {
    style: style,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(SwitcherWrapper, {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(SwitcherInput, {
        type: "checkbox",
        name: id,
        id: id,
        onChange: function onChange() {
          handleChange(!checked);
        },
        checked: checked
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(SwitcherLabel, {
        htmlFor: id,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(SwitcherInner, {
          checked: checked
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(SwitcherSwitch, {
          checked: checked
        })]
      })]
    }), text && /*#__PURE__*/(0, _jsxRuntime.jsx)(SwitcherText, {
      onClick: function onClick() {
        handleChange(!checked);
      },
      children: text
    })]
  });
};

exports.Switcher = Switcher;

function getActionIconStyle(props) {
  return "\n    display: inline-block;\n    height: 34px;\n    width: 34px;\n    cursor: ".concat(props.muted ? 'not-allowed' : 'pointer', ";\n    text-align: center;\n    line-height: 34px;\n    border-right: 1px solid ").concat(props.theme.colors.border, ";\n    \n    &:hover {\n      background: ").concat(props.muted ? 'inherit' : props.theme.colors.secondaryBgHover, ";\n    }\n  ");
}