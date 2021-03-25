"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var _Shapes = require("../../styledComponents/Shapes.ui");

var _config = require("../../config");

var _styledComponents = require("../../styledComponents");

var _Range = _interopRequireDefault(require("../Range"));

var _Select = _interopRequireDefault(require("../Shared/Select"));

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

var Add = /*#__PURE__*/function (_Component) {
  _inherits(Add, _Component);

  var _super = _createSuper(Add);

  function Add() {
    var _this;

    _classCallCheck(this, Add);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "renderSettings", function (selectedShape) {
      var _this$props = _this.props,
          shapeOperations = _this$props.shapeOperations,
          t = _this$props.t;
      var variant = selectedShape.variant,
          opacity = selectedShape.opacity,
          color = selectedShape.color,
          _selectedShape$stroke = selectedShape.stroke,
          stroke = _selectedShape$stroke === void 0 ? {} : _selectedShape$stroke;

      var updateOpacity = function updateOpacity(newVal) {
        return shapeOperations.updateShape({
          opacity: newVal
        });
      };

      var updateStroke = function updateStroke(property, value) {
        return shapeOperations.updateShape({
          stroke: _objectSpread(_objectSpread({}, stroke), {}, _defineProperty({}, property, value))
        });
      };

      var updatePropertyFromEvent = function updatePropertyFromEvent(e) {
        return shapeOperations.updateShape(_defineProperty({}, e.target.name, e.target.value));
      };

      var defaultSettings = /*#__PURE__*/(0, _jsxRuntime.jsxs)(_react.Fragment, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Range.default, {
          label: t['common.opacity'],
          min: 0,
          max: 1,
          step: 0.05,
          range: opacity,
          updateRange: updateOpacity,
          labelBefore: true
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Shapes.FieldGroup, {
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Shapes.FieldCustomLabel, {
            children: "Stroke Color"
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_styledComponents.FieldInput, {
            value: stroke.color || '#000000',
            type: "color",
            style: {
              width: 30,
              padding: 0,
              background: 'transparent',
              boxShadow: 'none'
            },
            onChange: function onChange(_ref) {
              var value = _ref.target.value;
              return updateStroke('color', value);
            }
          })]
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Shapes.FieldGroup, {
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Shapes.FieldCustomLabel, {
            children: "Stroke width"
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_styledComponents.FieldInput, {
            value: stroke.width || 0,
            type: "number",
            style: {
              width: 60
            },
            onChange: function onChange(_ref2) {
              var value = _ref2.target.value;
              return updateStroke('width', value);
            },
            min: 0
          })]
        })]
      }, "default-settings");
      var commonSettings = /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Shapes.FieldGroup, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Shapes.FieldCustomLabel, {
          children: "Fill Color"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_styledComponents.FieldInput, {
          value: color || '#000',
          type: "color",
          style: {
            width: 30,
            padding: 0,
            background: 'transparent',
            boxShadow: 'none'
          },
          name: "color",
          onChange: updatePropertyFromEvent
        }, "shape-color")]
      }, "common-settings-fields");
      var shownSettings = [defaultSettings];

      switch (variant) {
        case _config.SHAPES_VARIANTS.RECT:
        case _config.SHAPES_VARIANTS.SQUARE:
        case _config.SHAPES_VARIANTS.CIRCLE:
          shownSettings.push(commonSettings);
          break;

        case _config.SHAPES_VARIANTS.TEXT:
          var textFontField = /*#__PURE__*/(0, _jsxRuntime.jsxs)(_react.Fragment, {
            children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_Shapes.FieldGroup, {
              children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Shapes.FieldCustomLabel, {
                children: "Text"
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_styledComponents.FieldInput, {
                id: "text",
                value: selectedShape.text || 'Text',
                name: "text",
                style: {
                  minWidth: 111
                },
                onChange: updatePropertyFromEvent
              })]
            }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Shapes.FieldGroup, {
              children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Shapes.FieldCustomLabel, {
                children: "Font family"
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Select.default, {
                list: _config.STANDARD_FONTS,
                valueProp: "value",
                id: "textFont",
                value: selectedShape.textFont || 'Arial',
                style: {
                  width: 111
                },
                onChange: function onChange(value) {
                  return updatePropertyFromEvent({
                    target: {
                      name: 'textFont',
                      value: value
                    }
                  });
                },
                color: "text-font",
                notRelativePosition: true
              })]
            }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Shapes.FieldGroup, {
              children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Shapes.FieldCustomLabel, {
                children: "Font size"
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_styledComponents.FieldInput, {
                value: selectedShape.textSize,
                type: "number",
                style: {
                  width: 60
                },
                name: "textSize",
                onChange: updatePropertyFromEvent,
                min: 0
              })]
            })]
          }, "text-group-fields");
          shownSettings.unshift(textFontField, commonSettings);
          break;

        case _config.SHAPES_VARIANTS.IMAGE:
          var urlField = /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Shapes.FieldGroup, {
            children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Shapes.FieldCustomLabel, {
              children: "URL"
            }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_styledComponents.FieldInput, {
              id: "img",
              value: _typeof(selectedShape.img) === 'object' ? selectedShape.img.src : selectedShape.img || '',
              name: "img",
              style: {
                minWidth: 111
              },
              onChange: updatePropertyFromEvent
            })]
          }, "url-field");
          shownSettings.unshift(urlField);
          break;

        default:
          break;
      }

      return shownSettings;
    });

    return _this;
  }

  _createClass(Add, [{
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          availableShapes = _this$props2.availableShapes,
          _this$props2$selected = _this$props2.selectedShape,
          selectedShape = _this$props2$selected === void 0 ? {} : _this$props2$selected;
      var isShapeSelected = Object.keys(selectedShape).length;
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Shapes.AddWrapper, {
        children: isShapeSelected === 0 ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Shapes.ItemsWrapper, {
          children: availableShapes.map(function (_ref3) {
            var label = _ref3.label,
                content = _ref3.content,
                iconStyles = _ref3.iconStyles,
                drawFn = _ref3.drawFn,
                iconUrl = _ref3.iconUrl;
            return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Shapes.ItemGroup, {
              onClick: function onClick() {
                return drawFn();
              },
              children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Shapes.ItemIcon, {
                style: iconStyles,
                isIconNotProvided: !Boolean(content || iconUrl || iconStyles),
                children: content || iconUrl && /*#__PURE__*/(0, _jsxRuntime.jsx)("img", {
                  src: iconUrl,
                  alt: "".concat(label, " icon")
                })
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
                children: label
              })]
            }, label);
          })
        }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_Shapes.SettingsWrapper, {
          children: this.renderSettings(selectedShape)
        })
      });
    }
  }]);

  return Add;
}(_react.Component);

exports.default = Add;