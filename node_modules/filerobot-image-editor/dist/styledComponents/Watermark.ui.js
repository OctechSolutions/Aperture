"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WatermarkInputTypes = exports.WatermarkIcon = exports.Watermarks = exports.SelectWatermarkLabel = exports.PositionSquare = exports.WatermarkPositionWrapper = exports.WatermarkInputs = exports.WrapperForOpacity = exports.WrapperForControls = exports.WrapperForURL = exports.WatermarkWrapper = void 0;

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10, _templateObject11;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var WatermarkWrapper = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  position: relative;\n  color: ", ";\n  text-align: left;\n  white-space: normal;\n  width: fit-content;\n  margin: 0 auto;\n}\n  \n  #filerobot-image-editor-root & .image-editor-range {\n    display: inline-block;\n    padding: 5px;\n    vertical-align: middle;\n  }\n  \n  #filerobot-image-editor-root & .image-editor-range :after {\n      display: none;\n    }\n  \n  #filerobot-image-editor-root & .image-editor-range label {\n      display: none;\n    }\n  \n  @media (max-width: 768px) {\n#filerobot-image-editor-root & {\n    display: flex;\n    flex-direction: column;\n    align-items: center\n}\n    \n    #filerobot-image-editor-root & .image-editor-range {\n      width: 100%;\n    }\n      \n      #filerobot-image-editor-root & .image-editor-range input {\n        width: 100% !important;\n      }\n  }\n"])), function (props) {
  return props.theme.colors.text;
});

exports.WatermarkWrapper = WatermarkWrapper;
var WrapperForURL = (0, _styledComponents.default)('div')(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  padding: 10px;\n}\n  \n  #filerobot-image-editor-root & label {\n    min-width: 120px;\n    display: inline-block;\n    vertical-align: middle;\n    margin: 0;\n  }\n  \n  #filerobot-image-editor-root & input {\n    width: 100%;\n  }\n"])));
exports.WrapperForURL = WrapperForURL;
var WrapperForControls = (0, _styledComponents.default)('div')(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  ", ";\n}\n"])), function (p) {
  if (p.switcherPosition === 'right') {
    return ".cloudimage-url-generator-switch {\n        margin-left: 100px;\n        margin-top: -6px;\n        \n        label {\n          min-width: auto;\n        }\n        \n        @media (max-width: 768px) {\n          margin-left: 4px;\n        }\n      }";
  } else {
    return 'padding: 10px;';
  }
});
exports.WrapperForControls = WrapperForControls;
var WrapperForOpacity = (0, _styledComponents.default)('div')(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  display: inline;\n  vertical-align: middle;\n  padding: 10px;\n}\n\n  #filerobot-image-editor-root & label {\n    min-width: 120px;\n    display: inline-block;\n    vertical-align: middle;\n  }\n"])));
exports.WrapperForOpacity = WrapperForOpacity;
var WatermarkInputs = (0, _styledComponents.default)('div')(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  width: calc(100% - 200px);\n  display: inline-block;\n  vertical-align: top;\n  padding: 0 40px;\n}\n  \n  @media (max-width: 768px) {\n#filerobot-image-editor-root & {\n    width: 100%;\n    padding: 0\n}\n  }\n"])));
exports.WatermarkInputs = WatermarkInputs;
var WatermarkPositionWrapper = (0, _styledComponents.default)('div')(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  width: 100px;\n  padding: 5px;\n  display: inline-block;\n  font-size: 0;\n}\n  \n  #filerobot-image-editor-root & div:nth-child(1) {\n    border-radius: 4px 0 0 0;\n  }\n  \n  #filerobot-image-editor-root & div:nth-child(3) {\n    border-radius: 0 4px 0 0;\n  }\n  \n  #filerobot-image-editor-root & div:nth-child(7) {\n    border-radius: 0 0 0 4px;\n  }\n  \n  #filerobot-image-editor-root & div:nth-child(9) {\n    border-radius: 0 0 4px 0;\n  }\n"])));
exports.WatermarkPositionWrapper = WatermarkPositionWrapper;
var WatermarkInputTypes = (0, _styledComponents.default)('div')(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  width: 100px;\n  padding: 10px;\n  display: inline-block;\n  vertical-align: top;\n}\n  \n  /* The container */\n  \n  #filerobot-image-editor-root & label {\n    display: block;\n    position: relative;\n    line-height: 12px;\n    padding-left: 15px;\n    margin-bottom: 12px;\n    cursor: pointer;\n    user-select: none;\n  }\n  \n  /* Hide the browser's default radio button */\n  \n  #filerobot-image-editor-root & label input {\n    position: absolute;\n    opacity: 0;\n    cursor: pointer;\n  }\n  \n  /* Create a custom radio button */\n  \n  #filerobot-image-editor-root & span {\n    position: absolute;\n    top: 0;\n    left: 0;\n    height: 10px;\n    width: 10px;\n    background-color: ", ";\n    border-radius: 50%;\n  }\n  \n  /* On mouse-over, add a grey background color */\n  \n  #filerobot-image-editor-root & label:hover input ~ span {\n    /* background-color: #ccc; */\n  }\n  \n  /* When the radio button is checked, add a blue background */\n  \n  #filerobot-image-editor-root & label input:checked ~ span {\n    background-color: ", ";\n  }\n  \n  #filerobot-image-editor-root & label input:checked ~ span:after {\n    background-color: ", ";\n  }\n  \n  /* Create the indicator (the dot/circle - hidden when not checked) */\n  \n  #filerobot-image-editor-root & span:after {\n    content: \"\";\n    position: absolute;\n    display: none;\n  }\n  \n  /* Show the indicator (dot/circle) when checked */\n  \n  #filerobot-image-editor-root & label input:checked ~ span:after {\n    display: block;\n  }\n  \n  /* Style the indicator (dot/circle) */\n  \n  #filerobot-image-editor-root & label span:after {\n    top: 3px;\n    left: 2px;\n    width: 6px;\n    height: 5px;\n    border-radius: 50%;\n    background: ", ";\n  }\n  \n  @media (max-width: 768px) {\n#filerobot-image-editor-root & {\n    width: 100%\n}\n    \n    #filerobot-image-editor-root & label {\n      display: inline-block;\n      margin-right: 10px;\n    }\n  }\n"])), function (p) {
  return p.theme.colors.text;
}, function (p) {
  return p.theme.colors.text;
}, function (p) {
  return p.theme.colors.accent;
}, function (p) {
  return p.theme.colors.text;
});
exports.WatermarkInputTypes = WatermarkInputTypes;
var PositionSquare = (0, _styledComponents.default)('div')(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  width: 30px;\n  height: 30px;\n  display: inline-block;\n  vertical-align: top;\n  border: 1px solid ", ";\n  background: ", ";\n  cursor: ", ";\n  \n  ", ";\n}\n"])), function (p) {
  return p.theme.colors.secondaryBgHover;
}, function (p) {
  var _p$theme$colors$butto;

  return p.clickable ? p.active ? ((_p$theme$colors$butto = p.theme.colors.button) === null || _p$theme$colors$butto === void 0 ? void 0 : _p$theme$colors$butto.primary) || p.theme.colors.primaryBg : p.theme.colors.accent : p.theme.colors.disabledBg;
}, function (p) {
  return p.clickable ? 'pointer' : 'not-allowed';
}, function (p) {
  if (p.clickable !== 0 && !p.active) {
    return "\n        &:hover {\n          background: ".concat(p.theme.colors.primaryBg, ";\n        }\n      ");
  }
});
exports.PositionSquare = PositionSquare;
var SelectWatermarkLabel = (0, _styledComponents.default)('div')(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  display: inline-block;\n  vertical-align: middle;\n  margin-left: 20px;\n  cursor: pointer;\n}\n"])));
exports.SelectWatermarkLabel = SelectWatermarkLabel;
var Watermarks = (0, _styledComponents.default)('div')(_templateObject10 || (_templateObject10 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  line-height: 100px;\n  background: ", ";\n}\n"])), function (p) {
  return p.theme.colors.secondaryBg;
});
exports.Watermarks = Watermarks;
var WatermarkIcon = (0, _styledComponents.default)('div')(_templateObject11 || (_templateObject11 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  width: 200px;\n  height: 70px;\n  display: inline-block;\n  vertical-align: middle;\n  background: ", " url(", ") 50% 50% / contain no-repeat; \n  margin: 10px;\n  padding: 20px;\n  border-radius: 4px;\n  cursor: pointer;\n}\n  \n  #filerobot-image-editor-root &:hover {\n    background-color: ", ";\n  }\n"])), function (p) {
  return p.theme.colors.primaryBgHover;
}, function (p) {
  return p.src;
}, function (p) {
  return p.theme.colors.secondaryBgHover;
});
exports.WatermarkIcon = WatermarkIcon;