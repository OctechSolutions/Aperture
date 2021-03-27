"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AdjustWrapper = void 0;

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _templateObject;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var AdjustWrapper = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  color: ", ";\n  text-align: center;\n  display: flex;\n  justify-content: center;\n  width: fit-content;\n  margin: 0 auto;\n}\n\n  #filerobot-image-editor-root & div {\n    margin-left: 10px;\n  }\n\n  @media (max-width: 768px) {\n#filerobot-image-editor-root & {\n    flex-wrap: wrap\n}\n    \n    #filerobot-image-editor-root & .image-editor-range-wrapper {\n      width: 50%;\n    }\n      \n      #filerobot-image-editor-root & .image-editor-range-wrapper input {\n        width: 100% !important;\n      }\n  }\n"])), function (props) {
  return props.theme.colors.text;
});

exports.AdjustWrapper = AdjustWrapper;