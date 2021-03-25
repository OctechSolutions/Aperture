"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Modal = void 0;

var _react = require("react");

var _reactDom = require("react-dom");

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _CloseBtn = require("./CloseBtn");

var _styleUtils = require("../styledComponents/styleUtils");

var _config = require("../config");

var _jsxRuntime = require("react/jsx-runtime");

var _templateObject, _templateObject2, _templateObject3;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

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

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var ModalOverlay = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  position: fixed;\n  background: ", ";\n  opacity: .4;\n  z-index: 999999992;\n}\n"])), function (props) {
  return _styleUtils.variables.colors.background.base || '#000';
});

var ModalContent = _styledComponents.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  position: relative;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: column;\n  -ms-flex-direction: column;\n  flex-direction: column;\n  -webkit-background-clip: padding-box;\n  background-clip: padding-box;\n  border: ", " solid ", ";\n  border-radius: ", ";\n  overflow: hidden;\n  outline: 0;\n  height: ", ";\n  background: ", ";\n  color: ", ";\n}\n"])), function (props) {
  return props.noBorder ? 0 : '1px';
}, function (props) {
  return props.noBorder ? 'transparent' : _styleUtils.variables.colors.border.base || '#B0B0B0';
}, function (props) {
  return props.noBorder ? 0 : _styleUtils.variables.radii[3];
}, function (props) {
  return props.h || props.height || 'auto';
}, function (props) {
  return _styleUtils.variables.colors.background.base || '#fff';
}, function (props) {
  return _styleUtils.variables.colors.text || '#3d3d3d';
});

var ModalFullScreen = _styledComponents.default.div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n#filerobot-image-editor-root & {\n  azimuth: center;\n  border-collapse: separate;\n  border-spacing: 0;\n  caption-side: top;\n  cursor: auto;\n  direction: ltr;\n  elevation: level;\n  empty-cells: show;\n  font-size: medium;\n  font-style: medium;\n  font-variant: medium;\n  font-weight: medium;\n  letter-spacing: normal;\n  line-height: medium;\n  list-style-image: none;\n  list-style-position: outside;\n  list-style-type: disc;\n  list-style: disc outside none;\n  orphans: 2;\n  pitch-range: 50;\n  pitch: medium;\n  quotes: '\"' '\"';\n  richness: 50;\n  speak-header: once;\n  speak-numeral: continuous;\n  speak-punctuation: none;\n  speak: normal;\n  speech-rate: medium;\n  stress: 50;\n  text-align: left;\n  text-indent: 0;\n  text-transform: none;\n  visibility: visible;\n  voice-family: none;\n  volume: medium;\n  white-space: normal;\n  widows: 2;\n  word-spacing: 0;\n  position: fixed;\n  padding: ", ";\n  top: 5%;\n  left: 15%;\n  right: 15%;\n  bottom: 5%;\n  color: ", ";\n  overflow: hidden;\n  z-index: ", ";\n  display: block;\n  animation: scaleflexFadeInAnimation 350ms ease-in-out both;\n  font-family: 'Roboto', 'Arial', sans-serif;\n  filter: drop-shadow(0px 2px 4px rgba(77, 78, 78, 0.25));\n  \n  ", ";\n}\n  \n  @keyframes scaleflexFadeInAnimation {\n    from {opacity: 0;}\n    to {opacity: 1;}\n  }\n  \n  @media (max-width: 1000px) {\n#filerobot-image-editor-root & {\n    top: 20px;\n    left: 20px;\n    bottom: 20px;\n    right: 20px\n}\n  }\n"])), function (props) {
  return props.p || props.padding || '0';
}, function (props) {
  return _styleUtils.variables.colors.text || '#3d3d3d';
}, function (props) {
  return props.zIndex || '999999995';
}, function (props) {
  return props.isTooSmall ? getSmallModalStyle() : '';
});

function getSmallModalStyle() {
  return "\n    top: 20% !important;\n    left: 15px !important;\n    right: 15px !important;\n    bottom: auto !important;\n    color: black !important;\n    text-align: center !important;\n    font-size: 18px;\n    \n    > div {\n      padding: 40px !important;\n    }\n    \n    * {\n      color: black !important;\n    }\n  ";
}

var Modal = /*#__PURE__*/function (_Component) {
  _inherits(Modal, _Component);

  var _super = _createSuper(Modal);

  function Modal(props) {
    var _this;

    _classCallCheck(this, Modal);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "handleOutsideMouseClick", function (event) {
      var _this$props$onClose = _this.props.onClose,
          onClose = _this$props$onClose === void 0 ? function () {} : _this$props$onClose;

      if (event.keyCode === 27) {
        event.stopPropagation();
        onClose(_config.ON_CLOSE_STATUSES.ESC_KEY_PRESSED);
      }
    });

    _this.root = document.createElement('div');

    _this.root.classList.add(_config.CONTAINER_SELECTOR);

    _this.root.id = _config.CONTAINER_SELECTOR;
    document.body.appendChild(_this.root);
    var _this$props$closeOnOu = _this.props.closeOnOutsideClick,
        closeOnOutsideClick = _this$props$closeOnOu === void 0 ? true : _this$props$closeOnOu;

    if (closeOnOutsideClick) {
      document.addEventListener('keydown', _this.handleOutsideMouseClick);
    }

    return _this;
  }

  _createClass(Modal, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var _this$props$closeOnOu2 = this.props.closeOnOutsideClick,
          closeOnOutsideClick = _this$props$closeOnOu2 === void 0 ? true : _this$props$closeOnOu2;
      document.body.removeChild(this.root);

      if (closeOnOutsideClick) {
        document.removeEventListener('keydown', this.handleOutsideMouseClick);
      }
    } //todo add keycode to config

  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          _this$props$onClose2 = _this$props.onClose,
          onClose = _this$props$onClose2 === void 0 ? function () {} : _this$props$onClose2,
          isHideCloseBtn = _this$props.isHideCloseBtn,
          configModalId = _this$props.configModalId,
          otherProps = _objectWithoutProperties(_this$props, ["onClose", "isHideCloseBtn", "configModalId"]);

      return /*#__PURE__*/(0, _reactDom.createPortal)( /*#__PURE__*/(0, _jsxRuntime.jsxs)(_react.Fragment, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(ModalOverlay, {
          className: "modal-overlay",
          onClick: function onClick() {
            return onClose(_config.ON_CLOSE_STATUSES.MODAL_OVERLAY_CLICKED);
          }
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(ModalFullScreen, _objectSpread(_objectSpread({
          id: configModalId || _config.MODAL_ID
        }, this.props), {}, {
          children: [!isHideCloseBtn && /*#__PURE__*/(0, _jsxRuntime.jsx)(_CloseBtn.CloseBtn, {
            onClick: onClose
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(ModalContent, _objectSpread(_objectSpread({
            h: "100%"
          }, otherProps), {}, {
            children: this.props.children
          }))]
        }))]
      }), this.root);
    }
  }]);

  return Modal;
}(_react.Component);

exports.Modal = Modal;