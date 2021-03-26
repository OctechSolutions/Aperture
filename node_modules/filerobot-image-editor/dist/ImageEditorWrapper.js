"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var _ImageEditor = _interopRequireDefault(require("./ImageEditor"));

var _styledComponents = require("./styledComponents");

var _styledComponents2 = require("styled-components");

var _Modal = require("./components/Modal");

var _config2 = require("./config");

require("./assets/fonts/filerobot-font.css");

var _i18n = _interopRequireDefault(require("./assets/i18n"));

var _dark = _interopRequireDefault(require("./assets/theme/dark"));

var _light = _interopRequireDefault(require("./assets/theme/light"));

var _isServerSide = require("./utils/is-server-side");

var _jsxRuntime = require("react/jsx-runtime");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

var ImageEditorWrapper = /*#__PURE__*/function (_Component) {
  _inherits(ImageEditorWrapper, _Component);

  var _super = _createSuper(ImageEditorWrapper);

  function ImageEditorWrapper(_ref) {
    var _this;

    var _ref$show = _ref.show,
        show = _ref$show === void 0 ? false : _ref$show,
        _ref$src = _ref.src,
        _src = _ref$src === void 0 ? '' : _ref$src,
        _ref$config = _ref.config,
        _config = _ref$config === void 0 ? {} : _ref$config;

    _classCallCheck(this, ImageEditorWrapper);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "_isMounted", false);

    _defineProperty(_assertThisInitialized(_this), "processConfig", function (config) {
      var processWithCloudService = config.processWithCloudimage;
      var tools = config.tools || (processWithCloudService ? _config2.CLOUDIMAGE_OPERATIONS : _config2.TOOLS);
      return _objectSpread(_objectSpread(_objectSpread({}, _config2.UPLOADER), {}, {
        processWithCloudService: processWithCloudService,
        processWithFilerobot: !!config.filerobot,
        processWithCloudimage: !!config.cloudimage
      }, config), {}, {
        tools: processWithCloudService ? tools.filter(function (tool) {
          return _config2.CLOUDIMAGE_OPERATIONS.indexOf(tool) > -1;
        }) : tools
      });
    });

    _defineProperty(_assertThisInitialized(_this), "open", function (src) {
      var onOpen = _this.props.onOpen;

      if (_this._isMounted) {
        _this.setState({
          isVisible: true,
          src: src
        }, function () {
          if (onOpen) onOpen();
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "close", function () {
      var closingStatus = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _config2.ON_CLOSE_STATUSES.CLOSE_BTN_CLICKED;
      var onClose = _this.props.onClose;
      var status = _typeof(closingStatus) === 'object' ? _config2.ON_CLOSE_STATUSES.CLOSE_BTN_CLICKED : closingStatus;

      if (_this._isMounted) {
        _this.setState({
          isVisible: false
        }, function () {
          if (onClose) onClose({
            status: status
          });
        });
      }
    });

    _config.translations = _config.translations || {};
    _config.language = _config.translations[_config.language] || _i18n.default[_config.language] ? _config.language : 'en';
    _config.theme = _config.theme || {};
    _config.theme.colors = _config.theme.colors || {};
    _config.theme.fonts = _config.theme.fonts || _config2.STANDARD_FONTS;
    _config.colorScheme = _config.colorScheme || 'dark';
    _config.platform = _config.platform || 'filerobot';
    var isCustomColorScheme = _typeof(_config.colorScheme) === 'object';
    _this.state = {
      isVisible: show,
      src: _src,
      config: _this.processConfig(_config),
      t: _objectSpread(_objectSpread({}, _i18n.default[_config.language]), _config.translations[_config.language]),
      colorScheme: isCustomColorScheme ? 'custom' : _config.colorScheme || 'dark',
      theme: {
        colors: _objectSpread(_objectSpread({}, (isCustomColorScheme ? {
          colors: _config.colorScheme
        } : _config.colorScheme === 'light' ? _light.default : _dark.default).colors), _config.theme.colors),
        fonts: _config.theme.fonts
      }
    };
    return _this;
  }

  _createClass(ImageEditorWrapper, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this._isMounted = true;
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._isMounted = false;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (this.props.show !== prevProps.show) {
        if (this.props.show) {
          this.open(this.props.src);
        } else {
          this.close();
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
          isVisible = _this$state.isVisible,
          src = _this$state.src,
          config = _this$state.config,
          t = _this$state.t,
          theme = _this$state.theme;
      var _this$props = this.props,
          _this$props$onComplet = _this$props.onComplete,
          onComplete = _this$props$onComplet === void 0 ? function () {} : _this$props$onComplet,
          onBeforeComplete = _this$props.onBeforeComplete,
          _this$props$onError = _this$props.onError,
          onError = _this$props$onError === void 0 ? function () {} : _this$props$onError,
          closeOnLoad = _this$props.closeOnLoad;
      var _config$showInModal = config.showInModal,
          showInModal = _config$showInModal === void 0 ? true : _config$showInModal;
      if (!src || !isVisible || _isServerSide.isServerSide) return null;
      if (src instanceof Blob && config.processWithCloudimage) return null;
      var Inner = /*#__PURE__*/(0, _jsxRuntime.jsx)(_styledComponents.Container, {
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_ImageEditor.default, {
          src: src,
          config: config,
          onComplete: onComplete,
          onError: onError,
          onBeforeComplete: onBeforeComplete,
          onClose: this.close,
          closeOnLoad: closeOnLoad,
          t: t
        })
      });
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_styledComponents2.ThemeProvider, {
        theme: _objectSpread({}, theme),
        children: showInModal ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Modal.Modal, {
          noBorder: true,
          fullScreen: 'lg',
          isHideCloseBtn: true,
          style: {
            borderRadius: 5
          },
          onClose: this.close,
          configModalId: config.elementId,
          children: Inner
        }) : /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          className: _config2.CONTAINER_SELECTOR,
          id: _config2.CONTAINER_SELECTOR,
          style: {
            width: '100%',
            height: '100%'
          },
          children: Inner
        })
      });
    }
  }]);

  return ImageEditorWrapper;
}(_react.Component);

var _default = ImageEditorWrapper;
exports.default = _default;