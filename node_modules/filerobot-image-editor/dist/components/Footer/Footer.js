"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var _styledComponents = require("../../styledComponents");

var _fullScreenHandle = require("../../utils/full-screen-handle");

var _jsxRuntime = require("react/jsx-runtime");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = /*#__PURE__*/function (_Component) {
  _inherits(_default, _Component);

  var _super = _createSuper(_default);

  function _default() {
    var _this;

    _classCallCheck(this, _default);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "onApplyWatermarkChange", function () {
      _this.props.updateState({
        watermark: _objectSpread(_objectSpread({}, _this.props.watermark), {}, {
          applyByDefault: !_this.props.watermark.applyByDefault
        })
      });
    });

    return _this;
  }

  _createClass(_default, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          initialZoom = _this$props.initialZoom,
          operations = _this$props.operations,
          operationsZoomed = _this$props.operationsZoomed,
          _this$props$currentOp = _this$props.currentOperation,
          currentOperation = _this$props$currentOp === void 0 ? null : _this$props$currentOp,
          redoOperation = _this$props.redoOperation,
          resetOperations = _this$props.resetOperations,
          activeBody = _this$props.activeBody,
          t = _this$props.t,
          logoImage = _this$props.logoImage,
          watermark = _this$props.watermark,
          config = _this$props.config;
      var elementId = config.elementId;
      var operationList = initialZoom === 1 ? operations : operationsZoomed;
      var currentOperationIndex = operationList.findIndex(function (operation) {
        return operation === currentOperation;
      });
      var isCurrentOperationLast = currentOperation && operationList[operationList.length - 1] === currentOperation;
      var isPrevForbidden = operationList.length < 1 || currentOperationIndex === -1;
      var isNextForbidden = (operationList.length < 2 || operationList.length > 1 && isCurrentOperationLast) && (currentOperationIndex !== -1 || operationList.length !== 1);
      return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_styledComponents.Footer, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_styledComponents.ResetBtn, {
          muted: activeBody !== 'preview',
          onClick: function onClick() {
            activeBody === 'preview' && resetOperations();
          },
          title: t['footer.reset']
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_styledComponents.PreviousBtn, {
          onClick: function onClick() {
            !isPrevForbidden && redoOperation({
              operationIndex: currentOperationIndex - 1,
              operationObject: _objectSpread(_objectSpread({}, operationList[currentOperationIndex]), {}, {
                index: currentOperationIndex
              })
            });
          },
          muted: isPrevForbidden,
          title: t['footer.undo']
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_styledComponents.NextBtn, {
          onClick: function onClick() {
            !isNextForbidden && redoOperation({
              operationIndex: currentOperationIndex + 1,
              operationObject: _objectSpread(_objectSpread({}, operationList[currentOperationIndex]), {}, {
                index: currentOperationIndex
              })
            });
          },
          muted: isNextForbidden,
          title: t['footer.redo']
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_styledComponents.FullscreenBtn, {
          onClick: function onClick() {
            return (0, _fullScreenHandle.toggleModalFullscreen)(elementId);
          },
          title: t["header.toggle_fullscreen"]
        }), logoImage && watermark && /*#__PURE__*/(0, _jsxRuntime.jsx)(_styledComponents.Switcher, {
          id: "switch-watermark-footer",
          checked: watermark && watermark.applyByDefault,
          handleChange: this.onApplyWatermarkChange,
          text: t['common.apply_watermark']
        })]
      });
    }
  }]);

  return _default;
}(_react.Component);

exports.default = _default;