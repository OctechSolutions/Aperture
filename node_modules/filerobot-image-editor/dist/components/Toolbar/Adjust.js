"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var _styledComponents = require("../../styledComponents");

var _Range = _interopRequireDefault(require("../Range"));

var _jsxRuntime = require("react/jsx-runtime");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "updateBrightness", function (value) {
      _this.onAdjust('brightness', value);
    });

    _defineProperty(_assertThisInitialized(_this), "updateContrast", function (value) {
      _this.onAdjust('contrast', value);
    });

    _defineProperty(_assertThisInitialized(_this), "updateExposure", function (value) {
      _this.onAdjust('exposure', value);
    });

    _defineProperty(_assertThisInitialized(_this), "updateSaturation", function (value) {
      _this.onAdjust('saturation', value);
    });

    _defineProperty(_assertThisInitialized(_this), "onAdjust", function (type, value) {
      _this.setState(_defineProperty({}, type, value));

      _this.props.onAdjust(type, value);
    });

    _this.state = {
      brightness: 0,
      contrast: 0,
      exposure: 0,
      saturation: 0
    };
    return _this;
  }

  _createClass(_default, [{
    key: "render",
    value: function render() {
      var t = this.props.t;
      var _this$state = this.state,
          brightness = _this$state.brightness,
          contrast = _this$state.contrast,
          exposure = _this$state.exposure,
          saturation = _this$state.saturation;
      return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_styledComponents.AdjustWrapper, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Range.default, {
          label: t['adjust.brightness'],
          range: brightness,
          updateRange: this.updateBrightness
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Range.default, {
          label: t['adjust.contrast'],
          range: contrast,
          updateRange: this.updateContrast
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Range.default, {
          label: t['adjust.exposure'],
          range: exposure,
          updateRange: this.updateExposure
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Range.default, {
          label: t['adjust.saturation'],
          range: saturation,
          updateRange: this.updateSaturation
        })]
      });
    }
  }]);

  return _default;
}(_react.Component);

exports.default = _default;