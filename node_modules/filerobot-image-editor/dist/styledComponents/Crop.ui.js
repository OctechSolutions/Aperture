"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PresetsWrapper = exports.ShapeAligner = exports.CropShapeWrapper = exports.CropLabel = exports.CropShape = exports.CropBoxInner = exports.CropBox = exports.BlockRatioIcon = exports.BlockRatioBtn = exports.BlockRatioWrapper = exports.FieldInput = exports.FileInput = exports.FieldLabel = exports.FieldSet = exports.CustomLabel = exports.CropWrapper = void 0;

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _Button = require("./Button");

var _styleUtils = require("./styleUtils");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10, _templateObject11, _templateObject12, _templateObject13, _templateObject14, _templateObject15, _templateObject16;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var CropWrapper = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  color: ", ";\n  display: flex;\n}\n  \n  @media (min-widthL 768px) {\n#filerobot-image-editor-root & {\n    overflow-x: auto;\n    overflow-y: hidden;\n    white-space: nowrap\n}\n  }\n  \n  @media (max-width: 768px) {\n#filerobot-image-editor-root & {\n    flex-direction: column\n}\n  }\n"])), function (props) {
  return props.theme.colors.text;
});

exports.CropWrapper = CropWrapper;
var PresetsWrapper = (0, _styledComponents.default)('div')(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n@media (max-width: 768px) {\n#filerobot-image-editor-root & {\n    width: 100%;\n    overflow-x: scroll\n}\n  }\n"])));
exports.PresetsWrapper = PresetsWrapper;

var CustomLabel = _styledComponents.default.div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  display: block;\n  color: ", ";\n  height: 30px;\n  line-height: 30px;\n}\n"])), function (props) {
  return props.theme.colors.text;
});

exports.CustomLabel = CustomLabel;

var FieldSet = _styledComponents.default.div(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  display: inline-block;\n  width: 100px;\n  padding-top: 10px;\n  text-align: center;\n}\n"])));

exports.FieldSet = FieldSet;

var FieldLabel = _styledComponents.default.label(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  display: block;\n  margin-bottom: 5px;\n  line-height: 15px;\n}\n"])));

exports.FieldLabel = FieldLabel;

var FieldInput = _styledComponents.default.input.attrs(function (props) {
  return {
    type: props.type ? props.type : 'text'
  };
})(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  display: inline-block;\n  width: ", ";\n  ", ";\n  height: 30px;\n  padding: 6px 12px;\n  font-size: 12px;\n  line-height: 30px;\n  color: ", ";\n  background: ", ";\n  border-radius: 2px;\n  transition: border-color 0.15s ease-in-out;\n  vertical-align: middle;\n  font-family: Roboto, sans-serif;\n  border: 1px solid ", ";\n  \n  ", ";\n}\n  \n  #filerobot-image-editor-root &:hover {\n    outline: none;\n  }\n  \n  #filerobot-image-editor-root &:focus {\n    outline: none;\n  }\n"])), function (props) {
  return props.fullSize ? '100%' : props.theme.fieldWidth;
}, function (props) {
  return !props.fullSize && 'max-width: 400px;';
}, function (p) {
  return p.theme.colors.text;
}, function (props) {
  return props.theme.colors.primaryBg;
}, function (props) {
  return props.theme.colors.border;
}, function (p) {
  return p.type === 'number' && "::-webkit-inner-spin-button {\n    -webkit-appearance: none;\n  }";
});

exports.FieldInput = FieldInput;
var FileInput = (0, _styledComponents.default)('input').attrs(function (props) {
  return {
    type: props.type ? props.type : 'file'
  };
})(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  display: inline-block;\n  width: ", ";\n  height: 30px;\n  padding: 6px 12px;\n  font-size: 12px;\n  line-height: 1;\n  color: ", ";\n  background: ", ";\n  border-radius: 2px;\n  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;\n  vertical-align: middle;\n  border: 0px solid transparent;\n  font-family: Roboto, sans-serif;\n  border: 1px solid ", ";\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n  \n  #filerobot-image-editor-root &:hover {\n    outline: none;\n  }\n  \n  #filerobot-image-editor-root &:focus {\n    outline: none;\n  }\n"])), function (props) {
  return props.fullSize ? '100%' : props.theme.fieldWidth;
}, function (p) {
  return p.theme.colors.text;
}, function (props) {
  return props.theme.colors.primaryBg;
}, function (props) {
  return props.theme.colors.border;
});
exports.FileInput = FileInput;

var BlockRatioWrapper = _styledComponents.default.div(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  display: inline-block;\n  padding: 0 5px;\n}\n"])));

exports.BlockRatioWrapper = BlockRatioWrapper;
var BlockRatioBtn = (0, _styledComponents.default)(_Button.Button)(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  padding: 0;\n}\n  \n  #filerobot-image-editor-root & > span {\n    color: ", " !important;\n   }\n"])), function (props) {
  return props.active ? props.theme.colors.text : props.theme.colors.textMute;
});
exports.BlockRatioBtn = BlockRatioBtn;

var BlockRatioIcon = _styledComponents.default.span(_templateObject10 || (_templateObject10 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  cursor: pointer;\n  position: relative;\n  font-weight: bold;\n  font-size: ", ";\n\n  ", ";\n  ", ";\n  \n  color: ", ";\n}\n"])), function (props) {
  return props.fz || '28px';
}, function (props) {
  return (0, _styleUtils.getIconStyles)(props);
}, function (props) {
  return (0, _styleUtils.getIconByName)(props.active ? 'ratio' : 'no-ratio');
}, function (props) {
  return props.theme.textMuted;
});

exports.BlockRatioIcon = BlockRatioIcon;

var CropBox = _styledComponents.default.div(_templateObject11 || (_templateObject11 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  display: inline-block;\n  vertical-align: top;\n  text-align: center;\n  padding: 0 20px;\n  cursor: pointer;\n  background: ", ";\n}\n"])), function (props) {
  return props.active ? props.theme.colors.secondaryBgHover : 'transparent';
});

exports.CropBox = CropBox;

var CropBoxInner = _styledComponents.default.div(_templateObject12 || (_templateObject12 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  padding: 15px 0;\n  height: 90px;\n  line-height: 100px;\n}\n"])));

exports.CropBoxInner = CropBoxInner;

var CropShape = _styledComponents.default.div(_templateObject13 || (_templateObject13 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  height: ", "px;\n  border: 1px solid ", ";\n  width: ", "px;\n  margin: 0 auto;\n  display: inline-block;\n  vertical-align: middle;\n  ", ";\n}\n"])), function (props) {
  return getHeightOfShape(props.ratio);
}, function (props) {
  return props.theme.textColor;
}, function (props) {
  return getWidthOfShape(props.ratio);
}, function (_ref) {
  var radius = _ref.radius;
  return radius && "border-radius: ".concat(radius, "%;");
});

exports.CropShape = CropShape;
var CropShapeWrapper = (0, _styledComponents.default)('div')(_templateObject14 || (_templateObject14 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  height: 50px;\n  line-height: 50px;\n}\n"])));
exports.CropShapeWrapper = CropShapeWrapper;
var ShapeAligner = (0, _styledComponents.default)('div')(_templateObject15 || (_templateObject15 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  display: inline-block;\n  vertical-align: middle;\n  height: 50px;\n}\n"])));
exports.ShapeAligner = ShapeAligner;

var CropLabel = _styledComponents.default.div(_templateObject16 || (_templateObject16 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  height: 20px;\n  line-height: 20px;\n}\n"])));

exports.CropLabel = CropLabel;

var getWidthOfShape = function getWidthOfShape(ratio) {
  var width = 50 * ratio;

  if (width > 200) {
    width = 200;
  }

  return width;
};

var getHeightOfShape = function getHeightOfShape(ratio) {
  var height = 50;
  var width = 50 * ratio;

  if (width > 200) {
    height = 200 / ratio;
  }

  return height;
};