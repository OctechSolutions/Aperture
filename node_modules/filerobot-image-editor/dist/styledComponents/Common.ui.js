"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NoClickToolbar = exports.NoClickOverlay = void 0;

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _templateObject, _templateObject2;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var NoClickOverlay = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  position: absolute;\n  z-index: 999;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  cursor: wait;\n}\n"])));

exports.NoClickOverlay = NoClickOverlay;
var NoClickToolbar = (0, _styledComponents.default)('div')(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  position: absolute;\n  z-index: 999;\n  top: 36px;\n  left: 0;\n  right: 0;\n  height: 104px;\n  cursor: not-allowed;\n}\n"])));
exports.NoClickToolbar = NoClickToolbar;