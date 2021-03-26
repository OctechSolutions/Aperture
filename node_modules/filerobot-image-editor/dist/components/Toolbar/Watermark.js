"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var _styledComponents = require("../../styledComponents");

var _throttleDebounce = require("throttle-debounce");

var _Range = _interopRequireDefault(require("../Range"));

var _Select = _interopRequireDefault(require("../Shared/Select"));

var _config = require("../../config");

var _utils = require("../../utils");

var _jsxRuntime = require("react/jsx-runtime");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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

  function _default(props) {
    var _urls, _urls$;

    var _this;

    _classCallCheck(this, _default);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "changeOpacity", function (opacity) {
      _this.updateWatermarkProperty({
        opacity: opacity
      });
    });

    _defineProperty(_assertThisInitialized(_this), "updateWatermarkProperty", function (data, shapeData, watermarkObjectData) {
      var _this$props = _this.props,
          shapeOperations = _this$props.shapeOperations,
          _this$props$watermark = _this$props.watermark.lockScaleToPercentage,
          lockScaleToPercentage = _this$props$watermark === void 0 ? 0 : _this$props$watermark;

      if (!shapeData) {
        shapeData = data;
      }

      if (!watermarkObjectData) {
        watermarkObjectData = data;
      }

      var watermark = _this.getWatermarkLayer() || {};

      _this.setState(data, function () {
        shapeOperations.addOrUpdate(_objectSpread(_objectSpread({}, shapeData), {}, {
          lockScaleToPercentage: lockScaleToPercentage,
          key: _config.WATERMARK_UNIQUE_KEY,
          index: watermark.index,
          tab: 'watermark'
        }), {
          watermark: _objectSpread(_objectSpread({}, _this.props.watermark), watermarkObjectData)
        });
      });
    });

    _defineProperty(_assertThisInitialized(_this), "getWatermarkLayer", function () {
      var shapeOperations = _this.props.shapeOperations;
      return shapeOperations.getShape({
        key: _config.WATERMARK_UNIQUE_KEY
      });
    });

    _defineProperty(_assertThisInitialized(_this), "changeURL", function (event) {
      var shapeData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var nextValue = event.target.value;

      if (_this.props.watermark.text) {
        _this.initWatermarkImage(nextValue);

        return;
      }

      var position = _this.state.position;

      _this.updateWatermarkProperty({
        url: nextValue,
        position: position
      }, _objectSpread({
        img: nextValue,
        position: position
      }, shapeData), {
        url: '',
        text: false
      });
    });

    _defineProperty(_assertThisInitialized(_this), "changeTextProperty", function (event) {
      var updatedProperty = _defineProperty({}, event.target.name, event.target.value);

      if (_this.props.watermark.text) {
        _this.updateWatermarkProperty(updatedProperty);

        return;
      }

      var _this$state = _this.state,
          text = _this$state.text,
          color = _this$state.color,
          textSize = _this$state.textSize,
          textFont = _this$state.textFont,
          opacity = _this$state.opacity;

      var newWatermarkData = _objectSpread({
        text: text,
        color: color,
        textSize: textSize,
        textFont: textFont,
        opacity: opacity,
        variant: _config.SHAPES_VARIANTS.TEXT,
        tab: 'watermark'
      }, updatedProperty);

      _this.updateWatermarkProperty(_objectSpread({}, updatedProperty), _objectSpread(_objectSpread({}, newWatermarkData), {}, {
        resizingBox: true
      }), {
        text: _objectSpread(_objectSpread({}, _this.props.watermark.text), newWatermarkData)
      });
    });

    _defineProperty(_assertThisInitialized(_this), "readFile", function (event) {
      var config = _this.props.config; // Disable uploading file processing if it's through cloudimage

      if (config.processWithCloudimage) return null;
      var input = event.target;

      if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
          _this.changeURL({
            target: {
              value: e.target.result
            }
          }, {
            variant: _config.SHAPES_VARIANTS.IMAGE
          });
        };

        reader.readAsDataURL(input.files[0]);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "getWatermarkDimensionsByPosString", function (positionString, width, height) {
      return (0, _utils.getWatermarkSquaredPosition)(positionString, (0, _utils.getCanvasNode)(_this.props.config.elementId), width, height);
    });

    _defineProperty(_assertThisInitialized(_this), "onPositionChange", function (value) {
      var _ref = _this.getWatermarkLayer() || {},
          width = _ref.width,
          height = _ref.height;

      if (!width && !height) {
        return;
      }

      var _this$getWatermarkDim = _this.getWatermarkDimensionsByPosString(value, width, height),
          _this$getWatermarkDim2 = _slicedToArray(_this$getWatermarkDim, 4),
          x = _this$getWatermarkDim2[0],
          y = _this$getWatermarkDim2[1],
          scaledWidth = _this$getWatermarkDim2[2],
          scaledHeight = _this$getWatermarkDim2[3];

      _this.updateWatermarkProperty({
        position: value,
        width: scaledWidth,
        height: scaledHeight
      }, {
        x: x,
        y: y,
        width: scaledWidth,
        height: scaledHeight
      }, {
        position: value,
        x: x,
        y: y,
        width: scaledWidth,
        height: scaledHeight
      });
    });

    _defineProperty(_assertThisInitialized(_this), "initWatermarkImage", (0, _throttleDebounce.debounce)(500, function (url) {
      var updateState = _this.props.updateState;
      var logoImage = null;
      updateState({
        isShowSpinner: true
      });

      var watermarkImageState = function watermarkImageState(newImage) {
        return {
          logoImage: newImage,
          isShowSpinner: false,
          watermark: _objectSpread(_objectSpread({}, _this.props.watermark), {}, {
            url: newImage.src
          })
        };
      };

      if (url) {
        var _this$props2 = _this.props,
            shapeOperations = _this$props2.shapeOperations,
            _this$props2$watermar = _this$props2.watermark,
            _this$props2$watermar2 = _this$props2$watermar.lockScaleToPercentage,
            lockScaleToPercentage = _this$props2$watermar2 === void 0 ? 0 : _this$props2$watermar2,
            position = _this$props2$watermar.position;
        var opacity = _this.state.opacity;
        logoImage = new Image();
        logoImage.setAttribute('crossOrigin', 'Anonymous');

        logoImage.onload = function () {
          var imageFilter = _this.props.watermark.imageFilter;
          var watermarkImageStateObj;

          if (imageFilter && typeof imageFilter === 'function') {
            logoImage.onload = null;
            watermarkImageStateObj = watermarkImageState(imageFilter(logoImage));
          } else {
            watermarkImageStateObj = watermarkImageState(logoImage);
          }

          var index = (_this.getWatermarkLayer() || {}).index;

          var _this$getWatermarkDim3 = _this.getWatermarkDimensionsByPosString(position, logoImage.width, logoImage.height),
              _this$getWatermarkDim4 = _slicedToArray(_this$getWatermarkDim3, 4),
              x = _this$getWatermarkDim4[0],
              y = _this$getWatermarkDim4[1],
              width = _this$getWatermarkDim4[2],
              height = _this$getWatermarkDim4[3];

          shapeOperations.addOrUpdate({
            img: logoImage,
            opacity: opacity,
            index: index,
            x: x,
            y: y,
            width: width,
            height: height,
            variant: _config.SHAPES_VARIANTS.IMAGE,
            key: _config.WATERMARK_UNIQUE_KEY,
            tab: 'watermark',
            lockScaleToPercentage: lockScaleToPercentage
          }, watermarkImageStateObj);
        };

        logoImage.onerror = function () {
          updateState({
            isShowSpinner: false
          });
        };

        if (url.match(/^https?:\/\/./)) {
          // if the url is a HTTP URL add a cache breaker
          logoImage.src = url + '?' + new Date().getTime();
        } else {
          logoImage.src = url;
        }
      } else {
        updateState({
          isShowSpinner: false
        });
      }
    }));

    _defineProperty(_assertThisInitialized(_this), "showWatermarkList", function () {
      _this.setState({
        showWaterMarkList: true
      });
    });

    _defineProperty(_assertThisInitialized(_this), "hideWatermarkList", function () {
      _this.setState({
        showWaterMarkList: false
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onChangeWatermark", function (url) {
      _this.changeURL({
        target: {
          value: url
        }
      });

      _this.hideWatermarkList();
    });

    _defineProperty(_assertThisInitialized(_this), "handleInputTypeChange", function (_ref2) {
      var target = _ref2.target;
      var _this$props3 = _this.props,
          updateState = _this$props3.updateState,
          config = _this$props3.config;
      updateState({
        isShowSpinner: true
      });

      _this.setState({
        selectedInputType: target.value
      });

      if (target.value === 'text') {
        _this.changeTextProperty({
          target: {
            name: 'text',
            value: (config.watermark || {}).defaultText || 'Your text'
          }
        });

        updateState({
          isShowSpinner: false
        });
      } else {
        updateState({
          watermark: _objectSpread(_objectSpread({}, _this.props.watermark), {}, {
            text: null
          })
        });

        _this.initWatermarkImage(_this.props.watermark.url || '');
      }
    });

    var _props$watermark = props.watermark,
        _opacity = _props$watermark.opacity,
        _position = _props$watermark.position,
        _url = _props$watermark.url,
        applyByDefault = _props$watermark.applyByDefault,
        activePositions = _props$watermark.activePositions,
        handleOpacity = _props$watermark.handleOpacity;
    var _props$watermark2 = props.watermark,
        urls = _props$watermark2.urls,
        fonts = _props$watermark2.fonts;
    var setActivePositions = [];
    var activePosition = _position || 'right-top'; // check if a preset was selected

    if (typeof activePositions === 'string' && _config.WATERMARK_POSITIONS_PRESET.hasOwnProperty(activePositions)) {
      setActivePositions = _config.WATERMARK_POSITIONS_PRESET[activePositions];
    } // check if activePositons is an array
    else if (Array.isArray(activePositions)) {
        var fullPos = Array(9).fill(0); // merge with an default of 9 to prevent errors when the length is lower 9

        activePositions.map(function (val, i) {
          return fullPos[i] = val;
        });
        setActivePositions = fullPos; // return the default that all positions are active
      } else {
        setActivePositions = Array(9).fill(1);
      } // check if position is active else set the first upcomming active as the new active position


    if (setActivePositions[_config.WATERMARK_POSITIONS.indexOf(activePosition)] !== 1) {
      activePosition = _config.WATERMARK_POSITIONS[setActivePositions.indexOf(1)];
    }

    if (urls) {
      urls = urls.map(function () {
        var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        if (typeof url === 'string') {
          var splittedURL = url.split('/');
          return {
            url: url,
            label: splittedURL[splittedURL.length - 1]
          };
        } else {
          return url;
        }
      });
    }

    _this.initWatermarkImage(_url || ((_urls = urls) === null || _urls === void 0 ? void 0 : (_urls$ = _urls[0]) === null || _urls$ === void 0 ? void 0 : _urls$.url));

    _this.state = {
      isBlockRatio: false,
      opacity: _opacity || 0.7,
      handleOpacity: typeof handleOpacity === 'boolean' ? handleOpacity : true,
      position: activePosition,
      url: _url || (urls && urls.length > 1 ? urls[0] && urls[0].url : ''),
      urls: urls || [],
      activePositions: setActivePositions,
      isWatermarkList: urls && urls.length > 1,
      applyByDefault: applyByDefault || false,
      showWaterMarkList: false,
      selectedInputType: urls && urls.length > 1 ? 'gallery' : 'text',
      text: '',
      color: '#000000',
      textSize: 62,
      textFont: 'Arial',
      fonts: fonts || _this.props.config.theme.fonts
    };
    return _this;
  }

  _createClass(_default, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var nextProps = this.props; // check if position has ben modified and update

      if (nextProps.watermark.position !== this.state.position) {
        this.onPositionChange(this.state.position);
      }

      if (nextProps.watermark.applyByDefault !== prevProps.watermark.applyByDefault) {
        if (this.getWatermarkLayer()) {
          this.updateWatermarkProperty({
            applyByDefault: false
          }, {
            hidden: true,
            resizingBox: false
          }, {
            applyByDefault: false
          });
        } else {
          this.setState({
            applyByDefault: nextProps.watermark.applyByDefault
          });
        }

        if (nextProps.watermark.applyByDefault) {
          if (!this.getWatermarkLayer()) {
            this.initWatermarkImage(nextProps.watermark.url);
          } else {
            this.updateWatermarkProperty({
              applyByDefault: true
            }, {
              hidden: false,
              resizingBox: true
            }, {
              applyByDefault: true
            });
          }
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$state2 = this.state,
          isWatermarkList = _this$state2.isWatermarkList,
          url = _this$state2.url,
          urls = _this$state2.urls,
          opacity = _this$state2.opacity,
          handleOpacity = _this$state2.handleOpacity,
          position = _this$state2.position,
          activePositions = _this$state2.activePositions,
          applyByDefault = _this$state2.applyByDefault,
          showWaterMarkList = _this$state2.showWaterMarkList,
          selectedInputType = _this$state2.selectedInputType,
          text = _this$state2.text,
          color = _this$state2.color,
          textFont = _this$state2.textFont,
          textSize = _this$state2.textSize,
          fonts = _this$state2.fonts;
      var config = this.props.config;
      var fileUploadInput = selectedInputType === 'upload';
      var galleryInput = selectedInputType === 'gallery';
      var urlInput = selectedInputType === 'url';
      var textInput = selectedInputType === 'text';
      var t = this.props.t;
      return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_styledComponents.WatermarkWrapper, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_styledComponents.WatermarkInputTypes, {
          children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("label", {
            children: [t['common.gallery'], /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
              type: "radio",
              value: "gallery",
              checked: selectedInputType === 'gallery',
              onChange: this.handleInputTypeChange
            }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {})]
          }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("label", {
            style: {
              cursor: config.processWithCloudimage ? 'not-allowed' : undefined
            },
            children: [t['common.upload'], /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
              type: "radio",
              value: "upload",
              checked: selectedInputType === 'upload',
              disabled: config.processWithCloudimage,
              onChange: !config.processWithCloudimage ? this.handleInputTypeChange : undefined
            }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {})]
          }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("label", {
            children: [t['common.url'], /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
              type: "radio",
              value: "url",
              checked: selectedInputType === 'url',
              onChange: this.handleInputTypeChange
            }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {})]
          }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("label", {
            children: [t['common.text'], /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
              type: "radio",
              value: "text",
              checked: selectedInputType === 'text',
              onChange: this.handleInputTypeChange
            }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {})]
          })]
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_styledComponents.WatermarkInputs, {
          children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_styledComponents.WrapperForURL, {
            children: [galleryInput && /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
              children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
                htmlFor: "url",
                children: "Watermark Gallery"
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Select.default, {
                width: "100%",
                list: urls,
                valueProp: "url",
                id: "gallery",
                value: url,
                style: {
                  width: 'calc(100% - 120px)'
                },
                onChange: function onChange(url) {
                  _this2.changeURL({
                    target: {
                      value: url
                    }
                  });
                }
              })]
            }), urlInput && /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
              children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
                htmlFor: "url",
                children: "Watermark URL"
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_styledComponents.FieldInput, {
                id: "url",
                value: url,
                style: {
                  width: 'calc(100% - 120px)'
                },
                onChange: this.changeURL
              })]
            }), fileUploadInput && /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
              children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
                htmlFor: "image-upload",
                children: "Watermark Image"
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_styledComponents.FileInput, {
                id: "image-upload",
                style: {
                  width: 'calc(100% - 120px)'
                },
                onChange: this.readFile
              })]
            }), textInput && /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
              children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
                htmlFor: "text",
                children: "Watermark Text"
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_styledComponents.FieldInput, {
                id: "text",
                value: text,
                style: {
                  width: 'calc(65% - 135px)',
                  minWidth: 120
                },
                name: "text",
                onChange: this.changeTextProperty
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Select.default, {
                list: config.processWithCloudimage ? _config.WATERMARK_CLOUDIMAGE_FONTS : fonts,
                valueProp: "value",
                id: "textFont",
                value: textFont,
                style: {
                  width: 111,
                  display: 'inline-block',
                  marginLeft: 8
                },
                onChange: function onChange(value) {
                  return _this2.changeTextProperty({
                    target: {
                      name: 'textFont',
                      value: value
                    }
                  });
                }
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_styledComponents.FieldInput, {
                value: textSize,
                type: "number",
                name: "textSize",
                style: {
                  width: 60,
                  marginLeft: 8
                },
                onChange: this.changeTextProperty
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_styledComponents.FieldInput, {
                value: color,
                type: "color",
                style: {
                  width: 30,
                  marginLeft: 8,
                  padding: 0,
                  background: 'transparent',
                  boxShadow: 'none'
                },
                name: "color",
                onChange: this.changeTextProperty
              })]
            })]
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_styledComponents.WrapperForControls, {
            switcherPosition: handleOpacity ? 'right' : 'left',
            children: handleOpacity && /*#__PURE__*/(0, _jsxRuntime.jsxs)(_styledComponents.WrapperForOpacity, {
              children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
                htmlFor: "opacity",
                style: {
                  minWidth: 80
                },
                children: "Opacity"
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Range.default, {
                label: t['common.opacity'],
                min: 0,
                max: 1,
                step: 0.05,
                range: opacity,
                updateRange: this.changeOpacity
              })]
            })
          })]
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_styledComponents.WatermarkPositionWrapper, {
          children: _config.WATERMARK_POSITIONS.map(function (value, index) {
            return /*#__PURE__*/(0, _jsxRuntime.jsx)(_styledComponents.PositionSquare, {
              value: value,
              active: value === position,
              clickable: activePositions[index],
              onClick: function onClick() {
                if (activePositions[index]) {
                  _this2.onPositionChange(value);
                }
              }
            }, value);
          })
        }), isWatermarkList && showWaterMarkList && /*#__PURE__*/(0, _jsxRuntime.jsx)(_styledComponents.Watermarks, {
          children: urls.map(function (url) {
            return /*#__PURE__*/(0, _jsxRuntime.jsx)(_styledComponents.WatermarkIcon, {
              src: url,
              onClick: function onClick() {
                _this2.onChangeWatermark(url);
              }
            }, url);
          })
        })]
      });
    }
  }]);

  return _default;
}(_react.Component);

exports.default = _default;