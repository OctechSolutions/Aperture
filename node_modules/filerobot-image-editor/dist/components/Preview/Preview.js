"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var _styledComponents = require("../../styledComponents");

var _ImageManipulator = _interopRequireDefault(require("./ImageManipulator"));

var _FocusPointPreview = _interopRequireDefault(require("./FocusPointPreview"));

var _CustomizedCanvas = _interopRequireDefault(require("../CustomizedCanvas"));

var _utils = require("../../utils");

var _jsxRuntime = require("react/jsx-runtime");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _default = /*#__PURE__*/function (_Component) {
  _inherits(_default, _Component);

  var _super = _createSuper(_default);

  function _default() {
    _classCallCheck(this, _default);

    return _super.apply(this, arguments);
  }

  _createClass(_default, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          activeTab = _this$props.activeTab,
          isHideCanvas = _this$props.isHideCanvas,
          _this$props$watermark = _this$props.watermark,
          watermark = _this$props$watermark === void 0 ? {} : _this$props$watermark,
          focusPoint = _this$props.focusPoint,
          original = _this$props.original,
          updateState = _this$props.updateState,
          src = _this$props.src,
          shapes = _this$props.shapes,
          selectedShape = _this$props.selectedShape,
          _this$props$config = _this$props.config,
          colorScheme = _this$props$config.colorScheme,
          editorWrapperId = _this$props$config.elementId,
          processWithCloudimage = _this$props$config.processWithCloudimage,
          theme = _this$props$config.theme,
          roundCrop = _this$props.roundCrop,
          latestCanvasSize = _this$props.latestCanvasSize;
      var applyByDefault = watermark.applyByDefault;
      var canvas = (0, _utils.getCanvasNode)(editorWrapperId);
      var canvasRect = canvas && canvas.getBoundingClientRect() || {};
      return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_styledComponents.PreviewImgBox, {
        id: "preview-img-box",
        hideCanvas: activeTab === 'crop' || isHideCanvas,
        isShowWatermark: applyByDefault,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_ImageManipulator.default, _objectSpread({}, this.props)), activeTab !== 'focus_point' && /*#__PURE__*/(0, _jsxRuntime.jsx)(_CustomizedCanvas.default, {
          width: canvasRect.width,
          height: canvasRect.height,
          shapes: shapes,
          updateState: updateState,
          selectedShape: selectedShape,
          activeTab: activeTab,
          round: roundCrop,
          latestCanvasSize: latestCanvasSize,
          colorScheme: colorScheme,
          theme: theme,
          wrapperId: editorWrapperId,
          processWithCloudimage: processWithCloudimage
        }), activeTab === 'focus_point' && /*#__PURE__*/(0, _jsxRuntime.jsx)(_FocusPointPreview.default, {
          src: src,
          updateState: updateState,
          focusPoint: focusPoint,
          original: original
        })]
      });
    }
  }]);

  return _default;
}(_react.Component);

exports.default = _default;