"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _throttleDebounce = require("throttle-debounce");

var _jsxRuntime = require("react/jsx-runtime");

var _templateObject;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

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

var Range = /*#__PURE__*/function (_Component) {
  _inherits(Range, _Component);

  var _super = _createSuper(Range);

  function Range(props) {
    var _this;

    _classCallCheck(this, Range);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "updateWithDebounce", (0, _throttleDebounce.debounce)(100, function (value) {
      _this.props.updateRange(value);
    }));

    _defineProperty(_assertThisInitialized(_this), "updateRange", function (event) {
      var nextValue = event.target.value;

      _this.setState({
        range: nextValue
      }, function () {
        _this.updateWithDebounce(nextValue);
      });
    });

    _this.state = {
      range: props.range
    };
    return _this;
  }

  _createClass(Range, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(_ref) {
      var prevRange = _ref.range;
      var range = this.props.range;

      if (prevRange !== range && range !== this.state.range) {
        this.setState({
          range: range
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var range = this.state.range;
      var _this$props = this.props,
          label = _this$props.label,
          _this$props$min = _this$props.min,
          min = _this$props$min === void 0 ? -100 : _this$props$min,
          _this$props$max = _this$props.max,
          max = _this$props$max === void 0 ? 100 : _this$props$max,
          _this$props$step = _this$props.step,
          step = _this$props$step === void 0 ? 1 : _this$props$step,
          labelBefore = _this$props.labelBefore;
      return /*#__PURE__*/(0, _jsxRuntime.jsxs)(Wrapper, {
        className: "image-editor-range-wrapper",
        labelBefore: labelBefore,
        label: label,
        children: [label && labelBefore && /*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
          children: label
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
          id: "range",
          type: "range",
          value: range,
          min: min,
          max: max,
          step: step,
          onChange: this.updateRange
        }), label && !labelBefore && /*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
          children: label
        })]
      });
    }
  }]);

  return Range;
}(_react.Component);

var _default = Range;
exports.default = _default;
var Wrapper = (0, _styledComponents.default)('div').attrs(function () {
  return {
    className: 'image-editor-range'
  };
})(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  position: relative;\n  padding: 25px 5px 20px 5px;\n}\n  \n  #filerobot-image-editor-root & label {\n    display: inline-block;\n    width: 100%;\n    text-align: center;\n    padding-top: ", ";\n    color: ", ";\n  }\n  \n  #filerobot-image-editor-root & :after {\n    content: ", ";\n    display: inline-block;\n    position: absolute;\n    background: ", ";\n    height: 5px;\n    width: 2px;\n    top: 45px;\n    left: calc(50% - 1px);\n  }\n  \n  /* CHROME */\n  \n  #filerobot-image-editor-root & #range {\n    -webkit-appearance: none;\n    display: block;\n    outline: none;\n    background: ", ";\n    height: 6px;\n    width: 180px;\n    border-radius: 5px;\n    margin-bottom: 5px;\n  }\n  \n  #filerobot-image-editor-root & #range::-webkit-slider-thumb {\n      -webkit-appearance: none;\n      width: 18px;\n      height: 18px;\n      border-radius: 50%;\n      background: ", ";\n    }\n  \n  /* FIREFOX */\n  \n  #filerobot-image-editor-root & #range::-moz-range-thumb {\n    border: none;\n    height: 14px;\n    width: 14px;\n    border-radius: 50%;\n    background: ", ";\n    cursor: pointer;\n  }\n  \n  #filerobot-image-editor-root & #range::-moz-range-track {\n    width: 100%;\n    height: 3px;\n    cursor: pointer;\n    background: ", ";\n    border-radius: 5px;\n  }\n"])), function (p) {
  return p.labelBefore ? 0 : '20px';
}, function (p) {
  return p.theme.colors.text || '#ffffff';
}, function (p) {
  return p.label ? '' : 'unset';
}, function (p) {
  return p.theme.colors.text;
}, function (p) {
  return p.theme.colors.accent || p.theme.colors.primaryBg;
}, function (p) {
  return p.theme.colors.text;
}, function (p) {
  return p.theme.colors.text;
}, function (p) {
  return p.theme.colors.text;
});