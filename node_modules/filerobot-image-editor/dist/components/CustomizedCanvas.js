"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var _styledComponents = require("../styledComponents");

var _utils = require("../utils");

var _config = require("../config");

require("../utils/canvas-round");

var _jsxRuntime = require("react/jsx-runtime");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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

var CustomizedCanvas = /*#__PURE__*/function (_Component) {
  _inherits(CustomizedCanvas, _Component);

  var _super = _createSuper(CustomizedCanvas);

  function CustomizedCanvas(props) {
    var _this;

    _classCallCheck(this, CustomizedCanvas);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "_canvas", void 0);

    _defineProperty(_assertThisInitialized(_this), "_context", void 0);

    _defineProperty(_assertThisInitialized(_this), "_initArgs", {
      hidden: false
    });

    _defineProperty(_assertThisInitialized(_this), "_allowedTabs", ['shapes', 'image', 'text', 'watermark']);

    _defineProperty(_assertThisInitialized(_this), "prepareFinalCanvas", function (originalCanvasDimensions) {
      var width = originalCanvasDimensions.width,
          height = originalCanvasDimensions.height;
      var shapes = _this.props.shapes;
      var newCanvas = document.createElement('canvas');
      newCanvas.width = width;
      newCanvas.height = height;

      _this._canvas.parentNode.insertBefore(newCanvas, _this._canvas);

      var oldCanvas = _this._canvas;
      _this._canvas = newCanvas;
      _this._context = newCanvas.getContext('2d');
      shapes.map(function (shape) {
        // Mapping both (X & WIDTH), (Y & HEIGHT) of shape from old to new canvas with final dimnesions.
        shape.x = shape.x.mapNumber(0, oldCanvas.width, 0, width);
        shape.y = shape.y.mapNumber(0, oldCanvas.height, 0, height);

        if (shape.variant !== _config.SHAPES_VARIANTS.TEXT) {
          shape.width = shape.width.mapNumber(0, oldCanvas.width, 0, width);
          shape.height = shape.height.mapNumber(0, oldCanvas.height, 0, height);
        } else {
          shape.textSize = parseInt(shape.textSize).mapNumber(0, oldCanvas.width, 0, width);
        }

        _this.drawShapeThroughVariant(shape);
      });
      return _this._canvas;
    });

    _defineProperty(_assertThisInitialized(_this), "updateState", function (data) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
      var updateState = _this.props.updateState;
      updateState(data, callback);
    });

    _defineProperty(_assertThisInitialized(_this), "pushShapeToShapes", function (newShape, otherStates) {
      var shapes = _this.props.shapes;
      var shapeIndex = shapes.length;

      _this.updateState(_objectSpread({
        shapes: [].concat(_toConsumableArray(shapes), [_objectSpread(_objectSpread({}, newShape), {}, {
          index: shapeIndex
        })])
      }, otherStates));

      return shapeIndex;
    });

    _defineProperty(_assertThisInitialized(_this), "targettedShape", function () {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
      return index || index === 0 ? _this.props.shapes[index] : _this.props.selectedShape;
    });

    _defineProperty(_assertThisInitialized(_this), "onSelect", function (event) {
      var _this$props = _this.props,
          shapes = _this$props.shapes,
          activeTab = _this$props.activeTab;

      if (!_this._allowedTabs.includes(activeTab)) {
        return;
      }

      var offsetX = event.offsetX,
          offsetY = event.offsetY;
      var foundShape = false;
      shapes.forEach(function (shape) {
        if (!shape.hidden && offsetX >= shape.x && offsetX <= shape.x + shape.width && offsetY >= shape.y && offsetY <= shape.y + shape.height && shape.tab === activeTab) {
          foundShape = true;

          _this.updateState({
            selectedShape: _objectSpread(_objectSpread({}, shape), {}, {
              resizingBox: true,
              startEdgeOffset: {
                x: offsetX - shape.x,
                y: offsetY - shape.y
              }
            })
          });

          _this.activateResizingActions();

          _this._canvas.addEventListener('keyup', _this.activateShapeDeleting);

          _this._canvas.addEventListener('mousemove', _this.startDragging);

          _this._canvas.addEventListener('touchmove', _this.startDragging);

          document.addEventListener('mouseup', _this.endDragging);
          document.addEventListener('touchend', _this.endDragging);
        }
      }); // Remove the old event listeners incase clicked on no shapes after clicking on one before.

      if (!foundShape) {
        _this.updateState({
          selectedShape: {}
        });

        _this.disableResizingActions();

        _this._canvas.removeEventListener('keyup', _this.activateShapeDeleting);

        _this._canvas.removeEventListener('mousemove', _this.startDragging);

        _this._canvas.removeEventListener('touchmove', _this.startDragging);

        document.removeEventListener('mouseup', _this.endDragging);
        document.removeEventListener('touchend', _this.endDragging);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "activateShapeDeleting", function (_ref) {
      var key = _ref.key;
      var selectedShape = _this.props.selectedShape;

      if ((key === 'Delete' || key === 'Backspace') && selectedShape) {
        _this.deleteShapeByKeyOrIndex({
          index: selectedShape.index
        });

        _this.updateState({
          selectedShape: {}
        });

        _this.disableResizingActions();

        _this._canvas.removeEventListener('keyup', _this.activateShapeDeleting);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "activateResizingActions", function () {
      var selectedShape = _this.props.selectedShape;

      if (selectedShape.lockScaleToPercentage) {
        return;
      }

      Array.from(document.getElementsByClassName('shape-resizing-control')).forEach(function (control) {
        control.addEventListener('mousedown', _this.trackShapeResize);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "trackShapeResize", function (_ref2) {
      var target = _ref2.target;

      _this.setState({
        resizeControlTarget: target
      });

      document.addEventListener('mousemove', _this.handleShapeResizing);
      document.addEventListener('touchmove', _this.handleShapeResizing);
      document.addEventListener('mouseup', _this.disableResizingActions);
      document.addEventListener('touchend', _this.disableResizingActions);
    });

    _defineProperty(_assertThisInitialized(_this), "handleShapeResizing", function (_ref3) {
      var movementX = _ref3.movementX,
          movementY = _ref3.movementY,
          shiftKey = _ref3.shiftKey;
      var resizeControlTarget = _this.state.resizeControlTarget;
      var _this$props2 = _this.props,
          selectedShape = _this$props2.selectedShape,
          processWithCloudimage = _this$props2.processWithCloudimage;
      var index = selectedShape.index,
          width = selectedShape.width,
          height = selectedShape.height,
          x = selectedShape.x,
          y = selectedShape.y,
          variant = selectedShape.variant,
          originalWidth = selectedShape.originalWidth,
          originalHeight = selectedShape.originalHeight;

      if (!resizeControlTarget || variant === _config.SHAPES_VARIANTS.TEXT) {
        return;
      }

      var oldHeight = height;
      var direction = resizeControlTarget.dataset.direction;

      if (processWithCloudimage) {
        var notAllowedWithCloudImage = ['e', 'w', 'n', 's'];

        if (notAllowedWithCloudImage.includes(direction)) {
          return;
        }

        shiftKey = true;
      }

      var keepShapeRatio = function keepShapeRatio(sameAxesIncSign) {
        var ratio = width / height;

        if (Math.abs(movementX) >= Math.abs(movementY)) {
          var tempHeight = Math.abs(height - (width + movementX) / ratio);
          movementY = (!sameAxesIncSign ? -1 : 1) * Math.sign(movementX) * tempHeight;
        } else {
          var tempWidth = Math.abs(width - (height + movementY) * ratio);
          movementX = (!sameAxesIncSign ? -1 : 1) * Math.sign(movementY) * tempWidth;
        }
      };

      var eastHandle = function eastHandle() {
        width += movementX;
      };

      var southHandle = function southHandle() {
        height += movementY;
      };

      var westHandle = function westHandle() {
        width -= movementX;
        x += movementX;
      };

      var northHandle = function northHandle() {
        height -= movementY;
        y += movementY;
      };

      switch (direction) {
        case 'e':
          eastHandle();
          break;

        case 'w':
          westHandle();
          break;

        case 'n':
          northHandle();
          break;

        case 's':
          southHandle();
          break;

        case 'ne':
          if (shiftKey) {
            keepShapeRatio(false);
          }

          eastHandle();

          if (width >= _this._canvas.width && shiftKey) {
            break;
          }

          northHandle();
          break;

        case 'nw':
          if (shiftKey) {
            keepShapeRatio(true);
          }

          westHandle();

          if (width >= _this._canvas.width && shiftKey) {
            break;
          }

          northHandle();
          break;

        case 'se':
          if (shiftKey) {
            keepShapeRatio(true);
          }

          eastHandle();

          if (width >= _this._canvas.width && shiftKey) {
            break;
          }

          southHandle();
          break;

        case 'sw':
          if (shiftKey) {
            keepShapeRatio(false);
          }

          westHandle();

          if (width >= _this._canvas.width && shiftKey) {
            break;
          }

          southHandle();
          break;

        default:
          return;
      }

      if (variant === _config.SHAPES_VARIANTS.SQUARE || variant === _config.SHAPES_VARIANTS.CIRCLE) {
        if (height !== oldHeight) {
          width = height;
        } else {
          height = width;
        }
      } // In cloudimage process f max width or height don't increase any of them.


      if (processWithCloudimage && (width >= originalWidth || height >= originalHeight)) {
        return;
      }

      var minWidthAndHeight = 15;

      if (height <= minWidthAndHeight || width <= minWidthAndHeight) {
        return;
      } // Limiting the dragging to be inside the canvas only.


      if (x < 0) {
        x = 0;
      }

      if (y < 0) {
        y = 0;
      }

      if (x + width > _this._canvas.width) {
        x = _this._canvas.width - width;
      }

      if (y + height > _this._canvas.height) {
        y = _this._canvas.height - height;
      }

      if (width > _this._canvas.width) {
        width = _this._canvas.width;
      }

      if (height > _this._canvas.height) {
        height = _this._canvas.height;
      }

      var updatedShape = {
        width: width,
        height: height,
        x: x,
        y: y
      };

      _this.updateShape(updatedShape, index, {
        selectedShape: _objectSpread(_objectSpread({}, selectedShape), updatedShape)
      });
    });

    _defineProperty(_assertThisInitialized(_this), "disableResizingActions", function (e) {
      document.removeEventListener('mousemove', _this.handleShapeResizing);
      document.removeEventListener('mouseup', _this.disableResizingActions);

      _this.updateState({
        selectedShape: {}
      });

      _this.setState({
        resizeControlTarget: null
      });
    });

    _defineProperty(_assertThisInitialized(_this), "removeResizingBox", function (_ref4) {
      var offsetX = _ref4.offsetX,
          offsetY = _ref4.offsetY;
      var selectedShape = _this.props.selectedShape;

      if (offsetX < selectedShape.x || offsetX > selectedShape.x + selectedShape.width || offsetY < selectedShape.y || offsetY > selectedShape.y + selectedShape.height) {
        _this.updateState({
          selectedShape: _objectSpread(_objectSpread({}, selectedShape), {}, {
            resizingBox: false
          })
        });

        _this._canvas.removeEventListener('click', _this.removeResizingBox);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "startDragging", function (event) {
      if (event.targetTouches && event.targetTouches[0]) {
        event.preventDefault();
        var _event$targetTouches$ = event.targetTouches[0],
            clientX = _event$targetTouches$.clientX,
            clientY = _event$targetTouches$.clientY;

        var _this$_canvas$getBoun = _this._canvas.getBoundingClientRect(),
            x = _this$_canvas$getBoun.x,
            y = _this$_canvas$getBoun.y;

        event.offsetX = clientX - x;
        event.offsetY = clientY - y;
      }

      var selectedShape = _this.props.selectedShape;
      var _selectedShape$startE = selectedShape.startEdgeOffset,
          startEdgeOffset = _selectedShape$startE === void 0 ? {} : _selectedShape$startE,
          width = selectedShape.width,
          height = selectedShape.height,
          index = selectedShape.index; // event.offsetX - startEdgeOffset.x for the shape's X from its starting point not the exact mouse position.

      var newX = event.offsetX - startEdgeOffset.x;
      var newY = event.offsetY - startEdgeOffset.y; // Limiting the dragging to be inside the canvas only.

      if (newX < 0) {
        newX = 0;
      }

      if (newY < 0) {
        newY = 0;
      }

      if (newX + width > _this._canvas.width) {
        newX = _this._canvas.width - width;
      }

      if (newY + height > _this._canvas.height) {
        newY = _this._canvas.height - height;
      }

      var newSelectedShape = _objectSpread(_objectSpread({}, selectedShape), {}, {
        x: newX,
        y: newY
      });

      _this.updateShape(newSelectedShape, index, {
        selectedShape: newSelectedShape
      });
    });

    _defineProperty(_assertThisInitialized(_this), "endDragging", function () {
      _this._canvas.removeEventListener('mousemove', _this.startDragging);

      _this._canvas.removeEventListener('mouseup', _this.endDragging);

      _this._canvas.removeEventListener('mouseleave', _this.endDragging);

      _this._canvas.addEventListener('click', _this.removeResizingBox);
    });

    _defineProperty(_assertThisInitialized(_this), "getCanvasCenter", function () {
      var reduceWidthBy = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var reduceHeightBy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var centeredX = _this._canvas.width / 2 - reduceWidthBy;
      var centeredY = _this._canvas.height / 2 - reduceHeightBy;
      return [centeredX, centeredY];
    });

    _defineProperty(_assertThisInitialized(_this), "draw", function (drawFn, _ref5) {
      var _ref5$opacity = _ref5.opacity,
          opacity = _ref5$opacity === void 0 ? 1.0 : _ref5$opacity,
          hidden = _ref5.hidden,
          color = _ref5.color,
          _ref5$stroke = _ref5.stroke,
          stroke = _ref5$stroke === void 0 ? {} : _ref5$stroke;

      if (hidden) {
        return;
      }

      _this._context.globalAlpha = +opacity;
      _this._context.fillStyle = color;
      _this._context.strokeStyle = stroke.color || 'transparent';
      _this._context.lineWidth = stroke.width || 1;
      drawFn(); // Make the new canvas rounded if the crop is rounded style.
      // round is a manually written protoype method from canvas-round file in utils.

      if (_this.props.round) {
        _this._context.round();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "redrawShape", function () {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
      var shapes = _this.props.shapes;

      _this.clearShape(0, 0, _this._canvas.width, _this._canvas.height);

      var shapesCount = shapes.length; // If the shape isn't the top shape (last in array) then re-order all the shapes and make the current as last one.
      // Then re-draw with the new order otherwise re-draw with the old order which has the current shape as last/top one.

      if (index && index !== shapesCount - 1) {
        var currentShape = _objectSpread(_objectSpread({}, shapes.splice(index, 1)[0]), {}, {
          index: shapesCount
        });

        shapes.splice(shapesCount, 0, currentShape);
        shapes = shapes.map(function (shape, currentIndex) {
          shape.index = currentIndex;

          _this.drawShapeThroughVariant(shape);

          return shape;
        });

        _this.updateState({
          shapes: shapes,
          selectedShape: currentShape
        });
      } else {
        shapes.forEach(function (shape) {
          return _this.drawShapeThroughVariant(shape);
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "drawShapeThroughVariant", function (shape) {
      switch (shape.variant) {
        case _config.SHAPES_VARIANTS.IMAGE:
          _this.drawImage(shape);

          break;

        case _config.SHAPES_VARIANTS.RECT:
        case _config.SHAPES_VARIANTS.SQUARE:
          _this.drawRect(shape);

          break;

        case _config.SHAPES_VARIANTS.CIRCLE:
          _this.drawCircle(shape);

          break;

        case _config.SHAPES_VARIANTS.TEXT:
          _this.drawText(shape);

        default:
          return;
      }
    });

    _defineProperty(_assertThisInitialized(_this), "drawRect", function (_ref6) {
      var x = _ref6.x,
          y = _ref6.y,
          width = _ref6.width,
          height = _ref6.height,
          stroke = _ref6.stroke,
          others = _objectWithoutProperties(_ref6, ["x", "y", "width", "height", "stroke"]);

      _this.draw(function () {
        _this._context.fillRect(x, y, width, height);

        if (stroke) {
          _this._context.strokeRect(x, y, width, height);
        }
      }, _objectSpread({
        stroke: stroke
      }, others));
    });

    _defineProperty(_assertThisInitialized(_this), "drawCircle", function (_ref7) {
      var x = _ref7.x,
          y = _ref7.y,
          radius = _ref7.radius,
          width = _ref7.width,
          height = _ref7.height,
          stroke = _ref7.stroke,
          others = _objectWithoutProperties(_ref7, ["x", "y", "radius", "width", "height", "stroke"]);

      _this.draw(function () {
        _this._context.roundRect(x, y, width, height);

        _this._context.fill();

        if (stroke) {
          _this._context.stroke();
        }
      }, _objectSpread({
        stroke: stroke
      }, others));
    });

    _defineProperty(_assertThisInitialized(_this), "drawImage", function (_ref8) {
      var img = _ref8.img,
          x = _ref8.x,
          y = _ref8.y,
          width = _ref8.width,
          height = _ref8.height,
          stroke = _ref8.stroke,
          others = _objectWithoutProperties(_ref8, ["img", "x", "y", "width", "height", "stroke"]);

      _this.draw(function () {
        _this._context.drawImage(img, x, y, width, height);

        if (stroke) {
          _this._context.strokeRect(x, y, width, height);
        }
      }, _objectSpread({
        stroke: stroke
      }, others));
    });

    _defineProperty(_assertThisInitialized(_this), "setTextStyle", function (_ref9) {
      var textSize = _ref9.textSize,
          textFont = _ref9.textFont;
      _this._context.textAlign = "start";
      _this._context.textBaseline = "top";
      _this._context.font = "".concat(textSize, "px ").concat(textFont);
    });

    _defineProperty(_assertThisInitialized(_this), "getTextWidthAndHeight", function (_ref10) {
      var text = _ref10.text,
          textSize = _ref10.textSize,
          textFont = _ref10.textFont;

      _this.setTextStyle({
        textSize: textSize,
        textFont: textFont
      });

      var metrics = _this._context.measureText(text);

      var width = metrics.width;
      var height = width === 0 ? 0 : metrics.actualBoundingBoxDescent - metrics.actualBoundingBoxAscent;
      return [width, height];
    });

    _defineProperty(_assertThisInitialized(_this), "drawText", function (_ref11) {
      var text = _ref11.text,
          textSize = _ref11.textSize,
          textFont = _ref11.textFont,
          x = _ref11.x,
          y = _ref11.y,
          stroke = _ref11.stroke,
          others = _objectWithoutProperties(_ref11, ["text", "textSize", "textFont", "x", "y", "stroke"]);

      _this.draw(function () {
        _this.setTextStyle({
          textSize: textSize,
          textFont: textFont
        });

        _this._context.fillText(text, x, y, _this._canvas.width);

        if (stroke) {
          _this._context.strokeText(text, x, y);
        }
      }, _objectSpread({
        stroke: stroke
      }, others));
    });

    _defineProperty(_assertThisInitialized(_this), "addRect", function () {
      var _ref12 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          x = _ref12.x,
          y = _ref12.y,
          _ref12$width = _ref12.width,
          width = _ref12$width === void 0 ? 100 : _ref12$width,
          _ref12$height = _ref12.height,
          height = _ref12$height === void 0 ? 75 : _ref12$height,
          _ref12$stroke = _ref12.stroke,
          stroke = _ref12$stroke === void 0 ? {} : _ref12$stroke,
          _ref12$color = _ref12.color,
          color = _ref12$color === void 0 ? '#000000' : _ref12$color,
          _ref12$opacity = _ref12.opacity,
          opacity = _ref12$opacity === void 0 ? 1.0 : _ref12$opacity,
          _ref12$variant = _ref12.variant,
          variant = _ref12$variant === void 0 ? _config.SHAPES_VARIANTS.RECT : _ref12$variant,
          _ref12$tab = _ref12.tab,
          tab = _ref12$tab === void 0 ? 'shapes' : _ref12$tab,
          others = _objectWithoutProperties(_ref12, ["x", "y", "width", "height", "stroke", "color", "opacity", "variant", "tab"]);

      var _this$getCanvasCenter = _this.getCanvasCenter(width / 2, height / 2),
          _this$getCanvasCenter2 = _slicedToArray(_this$getCanvasCenter, 2),
          centerX = _this$getCanvasCenter2[0],
          centerY = _this$getCanvasCenter2[1];

      var drawingArgs = {
        x: x || centerX,
        y: y || centerY,
        width: width,
        height: height,
        stroke: stroke,
        opacity: opacity,
        color: color
      };

      var allArgs = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, _this._initArgs), others), drawingArgs), {}, {
        variant: variant,
        tab: tab
      });

      if (others.key && _this.replaceShapeIfExisted(others.key, allArgs)) {
        return;
      }

      _this.drawRect(drawingArgs);

      var index = _this.pushShapeToShapes(allArgs);

      _this.updateState({
        selectedShape: _objectSpread(_objectSpread({}, allArgs), {}, {
          index: index,
          resizingBox: true
        })
      }, _this.activateResizingActions);
    });

    _defineProperty(_assertThisInitialized(_this), "addSquare", function (rectArgs) {
      if (!rectArgs.width) rectArgs.width = rectArgs.height = 75;
      rectArgs.variant = _config.SHAPES_VARIANTS.SQUARE;

      _this.addRect(rectArgs);
    });

    _defineProperty(_assertThisInitialized(_this), "addCircle", function () {
      var _ref13 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          x = _ref13.x,
          y = _ref13.y,
          _ref13$radius = _ref13.radius,
          radius = _ref13$radius === void 0 ? 50 : _ref13$radius,
          _ref13$stroke = _ref13.stroke,
          stroke = _ref13$stroke === void 0 ? {} : _ref13$stroke,
          _ref13$color = _ref13.color,
          color = _ref13$color === void 0 ? '#000000' : _ref13$color,
          _ref13$opacity = _ref13.opacity,
          opacity = _ref13$opacity === void 0 ? 1.0 : _ref13$opacity,
          _ref13$tab = _ref13.tab,
          tab = _ref13$tab === void 0 ? 'shapes' : _ref13$tab,
          others = _objectWithoutProperties(_ref13, ["x", "y", "radius", "stroke", "color", "opacity", "tab"]);

      var _this$getCanvasCenter3 = _this.getCanvasCenter(radius, radius),
          _this$getCanvasCenter4 = _slicedToArray(_this$getCanvasCenter3, 2),
          centerX = _this$getCanvasCenter4[0],
          centerY = _this$getCanvasCenter4[1];

      var widthAndHeight = radius * 2;
      var drawingArgs = {
        x: x || centerX,
        y: y || centerY,
        radius: radius,
        color: color,
        opacity: opacity,
        stroke: stroke,
        width: widthAndHeight,
        height: widthAndHeight
      };

      var allArgs = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, _this._initArgs), others), drawingArgs), {}, {
        tab: tab,
        variant: _config.SHAPES_VARIANTS.CIRCLE
      });

      if (others.key && _this.replaceShapeIfExisted(others.key, allArgs)) {
        return;
      }

      _this.drawCircle(drawingArgs);

      var index = _this.pushShapeToShapes(allArgs);

      _this.updateState({
        selectedShape: _objectSpread(_objectSpread({}, allArgs), {}, {
          index: index,
          resizingBox: true
        })
      }, _this.activateResizingActions);
    });

    _defineProperty(_assertThisInitialized(_this), "addImage", function () {
      var _ref14 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          img = _ref14.img,
          _ref14$x = _ref14.x,
          x = _ref14$x === void 0 ? undefined : _ref14$x,
          _ref14$y = _ref14.y,
          y = _ref14$y === void 0 ? undefined : _ref14$y,
          _ref14$opacity = _ref14.opacity,
          opacity = _ref14$opacity === void 0 ? 1.0 : _ref14$opacity,
          _ref14$tab = _ref14.tab,
          tab = _ref14$tab === void 0 ? 'image' : _ref14$tab,
          _ref14$stroke = _ref14.stroke,
          stroke = _ref14$stroke === void 0 ? {} : _ref14$stroke,
          otherStates = _ref14.otherStates,
          others = _objectWithoutProperties(_ref14, ["img", "x", "y", "opacity", "tab", "stroke", "otherStates"]);

      if (img) {
        var addIt = function addIt() {
          var _this$getSuitableImgD = _this.getSuitableImgDiemensions(img, others.lockScaleToPercentage),
              _this$getSuitableImgD2 = _slicedToArray(_this$getSuitableImgD, 2),
              originalWidth = _this$getSuitableImgD2[0],
              originalHeight = _this$getSuitableImgD2[1];

          var _this$getCanvasCenter5 = _this.getCanvasCenter((others.width || originalWidth) / 2, (others.height || originalHeight) / 2),
              _this$getCanvasCenter6 = _slicedToArray(_this$getCanvasCenter5, 2),
              centerX = _this$getCanvasCenter6[0],
              centerY = _this$getCanvasCenter6[1];

          var drawingArgs = {
            img: img,
            opacity: opacity,
            originalWidth: originalWidth,
            originalHeight: originalHeight,
            width: others.width || originalWidth,
            height: others.height || originalHeight,
            x: x || centerX,
            y: y || centerY,
            stroke: stroke
          };

          var allArgs = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, _this._initArgs), others), drawingArgs), {}, {
            variant: _config.SHAPES_VARIANTS.IMAGE,
            tab: tab
          });

          if (others.key && _this.replaceShapeIfExisted(others.key, allArgs, otherStates)) {
            return;
          }

          _this.drawImage(drawingArgs);

          var index = _this.pushShapeToShapes(allArgs);

          _this.updateState(_objectSpread({
            selectedShape: _objectSpread(_objectSpread({}, allArgs), {}, {
              index: index,
              resizingBox: true
            })
          }, otherStates), _this.activateResizingActions);
        };

        if (typeof img === 'string') {
          img = _this.makeImgElement(img, addIt);
        } else {
          addIt();
        }
      }
    });

    _defineProperty(_assertThisInitialized(_this), "addText", function () {
      var _ref15 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref15$text = _ref15.text,
          text = _ref15$text === void 0 ? 'Text' : _ref15$text,
          _ref15$textSize = _ref15.textSize,
          textSize = _ref15$textSize === void 0 ? 62 : _ref15$textSize,
          _ref15$color = _ref15.color,
          color = _ref15$color === void 0 ? "#000000" : _ref15$color,
          _ref15$textFont = _ref15.textFont,
          textFont = _ref15$textFont === void 0 ? 'Arial' : _ref15$textFont,
          _ref15$x = _ref15.x,
          x = _ref15$x === void 0 ? undefined : _ref15$x,
          _ref15$y = _ref15.y,
          y = _ref15$y === void 0 ? undefined : _ref15$y,
          _ref15$stroke = _ref15.stroke,
          stroke = _ref15$stroke === void 0 ? {} : _ref15$stroke,
          _ref15$opacity = _ref15.opacity,
          opacity = _ref15$opacity === void 0 ? 1.0 : _ref15$opacity,
          _ref15$tab = _ref15.tab,
          tab = _ref15$tab === void 0 ? 'text' : _ref15$tab,
          otherStates = _ref15.otherStates,
          others = _objectWithoutProperties(_ref15, ["text", "textSize", "color", "textFont", "x", "y", "stroke", "opacity", "tab", "otherStates"]);

      var _this$getTextWidthAnd = _this.getTextWidthAndHeight({
        text: text,
        textSize: textSize,
        textFont: textFont
      }),
          _this$getTextWidthAnd2 = _slicedToArray(_this$getTextWidthAnd, 2),
          width = _this$getTextWidthAnd2[0],
          height = _this$getTextWidthAnd2[1]; // Set text style here for measuring the text's width & hegiht before drawing.


      var _this$getCanvasCenter7 = _this.getCanvasCenter(width / 2, height / 2),
          _this$getCanvasCenter8 = _slicedToArray(_this$getCanvasCenter7, 2),
          centerX = _this$getCanvasCenter8[0],
          centerY = _this$getCanvasCenter8[1];

      if (text) {
        var drawingArgs = {
          text: text,
          textSize: textSize,
          textFont: textFont,
          x: x || centerX,
          y: y || centerY,
          opacity: opacity,
          stroke: stroke,
          color: color
        };

        var allArgs = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, _this._initArgs), others), drawingArgs), {}, {
          width: width,
          height: height,
          variant: _config.SHAPES_VARIANTS.TEXT,
          tab: tab
        });

        if (others.key && _this.replaceShapeIfExisted(others.key, allArgs, otherStates)) {
          return;
        }

        _this.drawText(drawingArgs);

        var index = _this.pushShapeToShapes(allArgs);

        _this.updateState(_objectSpread({
          selectedShape: _objectSpread(_objectSpread({}, allArgs), {}, {
            index: index,
            resizingBox: true
          })
        }, otherStates), _this.activateResizingActions);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "addAnyShape", function (shapeArgs, otherStates) {
      if (shapeArgs.index || shapeArgs.index === 0) {
        var shapes = _this.props.shapes;
        var shape = shapes[shapeArgs.index];

        if (!shapeArgs.variant || shape.variant === shapeArgs.variant) {
          _this.updateShape(shapeArgs, shapeArgs.index, otherStates);

          return;
        }
      }

      var args = _objectSpread(_objectSpread({}, shapeArgs), {}, {
        otherStates: otherStates
      });

      switch (shapeArgs.variant) {
        case _config.SHAPES_VARIANTS.IMAGE:
          _this.addImage(args);

          break;

        case _config.SHAPES_VARIANTS.RECT:
          _this.addRect(args);

          break;

        case _config.SHAPES_VARIANTS.SQUARE:
          _this.addSquare(args);

          break;

        case _config.SHAPES_VARIANTS.CIRCLE:
          _this.addCircle(args);

          break;

        case _config.SHAPES_VARIANTS.TEXT:
          _this.addText(args);

        default:
          return;
      }
    });

    _defineProperty(_assertThisInitialized(_this), "getSuitableImgDiemensions", function (img) {
      var lockScaleToPercentage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var width = img.width;
      var height = img.height; // Scaling down the image if it's bigger than the canvas

      if (height > _this._canvas.height) {
        var ratio = height / _this._canvas.height;
        height /= ratio;
        width /= ratio;
      }

      if (width > _this._canvas.width) {
        var _ratio = width / _this._canvas.width;

        height /= _ratio;
        width /= _ratio;
      }

      if (lockScaleToPercentage) {
        var scaleValue = lockScaleToPercentage / 100;
        width *= scaleValue;
        height *= scaleValue;
      }

      width = _this.fromLatestCanvasSizeValue(width, 'width');
      height = _this.fromLatestCanvasSizeValue(height, 'height');
      return [width, height];
    });

    _defineProperty(_assertThisInitialized(_this), "getShapeByKeyOrIndex", function (_ref16) {
      var shapeKey = _ref16.key,
          shapeIndex = _ref16.index;

      if (!shapeKey && !shapeIndex && shapeKey !== 0 && shapeIndex !== 0) {
        return false;
      }

      var shapes = _this.props.shapes;
      return shapeIndex ? shapes[shapeIndex] : shapes.filter(function (_ref17) {
        var key = _ref17.key;
        return key === shapeKey;
      })[0];
    });

    _defineProperty(_assertThisInitialized(_this), "replaceShapeIfExisted", function (key, args) {
      var otherStates = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

      var shape = _this.getShapeByKeyOrIndex({
        key: key
      });

      if (shape) {
        args = _objectSpread(_objectSpread({}, args), {}, {
          x: shape.x,
          y: shape.y,
          width: shape.width,
          height: shape.height
        });

        _this.updateShape(args, shape.index, otherStates);

        return true;
      }

      return false;
    });

    _defineProperty(_assertThisInitialized(_this), "setShapeVisibilityByKeyOrIndex", function (_ref18) {
      var key = _ref18.key,
          index = _ref18.index;
      var isHidden = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

      var shape = _this.getShapeByKeyOrIndex({
        key: key,
        index: index
      });

      if (shape && shape.hidden !== isHidden) {
        _this.updateShape({
          hidden: isHidden || !shape.hidden
        }, shape.index);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "getShapesIndexByAnyProp", function (propertyName, propertyValue) {
      var shapes = _this.props.shapes;

      if (shapes && shapes.length === 0) {
        return [];
      }

      var shapesIndicies = [];
      shapes.filter(function (_ref19, index) {
        var filterProp = _ref19[propertyName];

        if (filterProp === propertyValue || typeof filterProp === 'undefined' && Boolean(filterProp) === propertyValue) {
          shapesIndicies.push(index);
          return true;
        }

        return false;
      });
      return shapesIndicies;
    });

    _defineProperty(_assertThisInitialized(_this), "updateShapes", function (updatedData, otherStates) {
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
      var shapes = _this.props.shapes;
      shapes = shapes.map(function (s) {
        return _objectSpread(_objectSpread({}, s), updatedData);
      });

      _this.updateState(_objectSpread({
        shapes: shapes
      }, otherStates), callback);
    });

    _defineProperty(_assertThisInitialized(_this), "replaceAllShapes", function (newShapes) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

      _this.updateState({
        shapes: newShapes
      }, function () {
        _this.redrawShape();

        callback();
      });
    });

    _defineProperty(_assertThisInitialized(_this), "updateShape", function (updatedData, index) {
      var otherStatesToBeUpdated = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      var _this$props3 = _this.props,
          shapes = _this$props3.shapes,
          selectedShape = _this$props3.selectedShape;

      if (!updatedData || !index && index !== 0 && (!selectedShape || !selectedShape.index && selectedShape.index !== 0)) {
        return;
      }

      if (typeof updatedData.img === 'string') {
        _this.updateState({
          selectedShape: _objectSpread(_objectSpread({}, selectedShape), {}, {
            lockScaleToPercentage: updatedData.lockScaleToPercentage,
            img: updatedData.img
          })
        });

        _this.makeImgElement(updatedData.img, _this.updateShape, updatedData, index, otherStatesToBeUpdated);

        return;
      }

      var updates = {}; // if no index provided and selected shape would be updated then add the obj and update the stats' selectes shape.

      if (!index && index !== 0) {
        updates.selectedShape = _objectSpread(_objectSpread({}, selectedShape), updatedData);
      }

      index = index || index === 0 ? index : selectedShape.index;

      if (shapes[index]) {
        var latestShapes = shapes;

        if (updatedData.textSize && updatedData.textSize !== shapes[index].textSize || updatedData.text && updatedData.text !== shapes[index].text) {
          var targetShape = shapes[index];

          var _this$getTextWidthAnd3 = _this.getTextWidthAndHeight(_objectSpread(_objectSpread({}, targetShape), updatedData)),
              _this$getTextWidthAnd4 = _slicedToArray(_this$getTextWidthAnd3, 2),
              width = _this$getTextWidthAnd4[0],
              height = _this$getTextWidthAnd4[1];

          if (!updates.selectedShape) {
            updatedData.width = width;
            updatedData.height = height;
            updatedData.text = updatedData.text || targetShape.text;
          } else {
            updatedData.width = updates.selectedShape.width = width;
            updatedData.height = updates.selectedShape.height = height;
            updatedData.text = updates.selectedShape.text = updatedData.text || targetShape.text;
          }
        } else {
          var newData = _objectSpread({}, updatedData);

          if (typeof updatedData.x !== 'undefined' && typeof updatedData.y !== 'undefined') {
            newData.x = updatedData.x;
            newData.y = updatedData.y;
          }

          if (updatedData.stroke) {
            newData.stroke = updatedData.stroke;
          }

          if (updatedData.width && updatedData.height) {
            newData.width = updatedData.width;
            newData.height = updatedData.height;
          }

          if (updatedData.lockScaleToPercentage) {
            updatedData.lockScaleToPercentage = updatedData.lockScaleToPercentage;
          }

          updates.selectedShape = _objectSpread(_objectSpread({}, selectedShape), newData);
        }

        latestShapes[index] = _objectSpread(_objectSpread({}, latestShapes[index]), updatedData);

        _this.updateState(_objectSpread(_objectSpread({
          shapes: latestShapes
        }, updates), otherStatesToBeUpdated), function () {
          _this.redrawShape(index);
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "clearShape", function (x, y, width, height) {
      var stroke = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
      var strokeWidth = stroke.width;
      var strokeWidthConst = strokeWidth || 1;
      var clearFromX = x - strokeWidthConst;
      var clearFromY = y - strokeWidthConst;
      var clearWidth = width + strokeWidthConst;
      var clearHeight = height + strokeWidthConst;

      _this._context.clearRect(clearFromX, clearFromY, clearWidth, clearHeight);
    });

    _defineProperty(_assertThisInitialized(_this), "eraseAndRemoveShapeFromArray", function (index, shapes) {
      if (Object.keys(_this.targettedShape(index)).length === 0) {
        return;
      }

      _this.clearShape(0, 0, _this._canvas.width, _this._canvas.height);

      var newShapes = shapes.filter(function (shape) {
        if (shape.index === index) {
          return false;
        }

        if (shape.index > index) {
          shape.index -= 1;
        }

        ;

        _this.drawShapeThroughVariant(shape);

        return shape;
      });
      return newShapes;
    });

    _defineProperty(_assertThisInitialized(_this), "deleteShapeByKeyOrIndex", function (_ref20) {
      var index = _ref20.index,
          key = _ref20.key;
      var otherStates = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var selectedShape = _this.props.selectedShape;

      if (!index && index !== 0 && !key) {
        if (!selectedShape) {
          return;
        }

        index = selectedShape.index;
      }

      var shapes = _this.props.shapes;
      var shapeIndex = index || index === 0 ? index : (_this.getShapeByKeyOrIndex({
        key: key
      }) || {}).index;

      if (shapeIndex || shapeIndex === 0) {
        if (shapeIndex === selectedShape.index) {
          otherStates.selectedShape = {};
        }

        _this.updateState(_objectSpread({
          shapes: _this.eraseAndRemoveShapeFromArray(shapeIndex, shapes)
        }, otherStates));
      }
    });

    _defineProperty(_assertThisInitialized(_this), "deleteShapes", function () {
      var indicies = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var otherStates = arguments.length > 1 ? arguments[1] : undefined;
      var shapes = _this.props.shapes;
      indicies.forEach(function (i) {
        shapes = _this.eraseAndRemoveShapeFromArray(i, shapes);
      });

      _this.updateState(_objectSpread({
        shapes: shapes
      }, otherStates));
    });

    _defineProperty(_assertThisInitialized(_this), "deleteAllShapesOrByTypeOrIndicies", function (_ref21) {
      var type = _ref21.type,
          _ref21$all = _ref21.all,
          all = _ref21$all === void 0 ? false : _ref21$all,
          _ref21$applied = _ref21.applied,
          applied = _ref21$applied === void 0 ? false : _ref21$applied,
          _ref21$secured = _ref21.secured,
          secured = _ref21$secured === void 0 ? [] : _ref21$secured;

      if (!type && !all) {
        return;
      }

      if (all) {
        var watermarkIndex = (_this.getShapeByKeyOrIndex({
          key: _config.WATERMARK_UNIQUE_KEY
        }) || {}).index;

        var securedIndicies = _toConsumableArray(secured);

        if ((watermarkIndex || watermarkIndex === 0) && !securedIndicies.includes(watermarkIndex)) {
          securedIndicies.push(watermarkIndex);
        }

        var shapes = [];

        _this.clearShape(0, 0, _this._canvas.width, _this._canvas.height);

        if (!applied) {
          shapes = _this.props.shapes.filter(function (s) {
            if (s.applied || securedIndicies.includes(s.index)) {
              _this.drawShapeThroughVariant(s);

              return s;
            }

            return false;
          });
        }

        _this.updateState({
          shapes: shapes,
          selectedShape: {}
        });

        return;
      }

      var shapesIndicies = _this.getShapesIndexByAnyProp('type', type);

      if (shapesIndicies.length > 0) {
        _this.deleteShapes(shapesIndicies);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "makeImgElement", function (src, fn, dataObject) {
      for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        args[_key - 3] = arguments[_key];
      }

      if (!src) {
        return '';
      }

      _this.updateState({
        isShowSpinner: true
      });

      var img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = src.startsWith('data:image') ? src : "".concat(src, "?v=").concat(Math.random());

      img.onload = function () {
        if (dataObject) {
          var width, height;

          if (dataObject.position) {
            var x, y;

            var _getWatermarkSquaredP = (0, _utils.getWatermarkSquaredPosition)(dataObject.position, _this._canvas, img.width, img.height);

            var _getWatermarkSquaredP2 = _slicedToArray(_getWatermarkSquaredP, 4);

            x = _getWatermarkSquaredP2[0];
            y = _getWatermarkSquaredP2[1];
            width = _getWatermarkSquaredP2[2];
            height = _getWatermarkSquaredP2[3];
            dataObject.x = x;
            dataObject.y = y;
          }

          var _this$getSuitableImgD3 = _this.getSuitableImgDiemensions(img, dataObject.lockScaleToPercentage),
              _this$getSuitableImgD4 = _slicedToArray(_this$getSuitableImgD3, 2),
              originalWidth = _this$getSuitableImgD4[0],
              originalHeight = _this$getSuitableImgD4[1];

          dataObject.width = width || originalWidth;
          dataObject.originalWidth = originalWidth;
          dataObject.height = height || originalHeight;
          dataObject.originalHeight = originalHeight;
          fn.apply(void 0, [dataObject].concat(args));
        } else {
          fn.apply(void 0, args);
        }

        _this.updateState({
          isShowSpinner: false
        });
      };

      img.onerror = function () {
        _this.updateState({
          isShowSpinner: false
        });

        console.error('Error loading the image...');
      };

      if (dataObject) {
        dataObject.img = img;
      }

      return img;
    });

    _defineProperty(_assertThisInitialized(_this), "fromLatestCanvasSizeValue", function (number, property) {
      if (_this._canvas && _this.state.latestCanvasSize) {
        // property = width or height
        return number.mapNumber(0, _this.state.latestCanvasSize[property], 0, _this._canvas[property]);
      }

      return number;
    });

    _this.canvasRef = /*#__PURE__*/(0, _react.createRef)();
    _this.shapeResizingBoxRef = /*#__PURE__*/(0, _react.createRef)();
    _this.state = {
      resizeControlTarget: null,
      latestCanvasSize: null
    };
    return _this;
  }

  _createClass(CustomizedCanvas, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      if (this.canvasRef && this.canvasRef.current && !this._canvas) {
        var _this$props$theme, _this$props$theme$col;

        this._canvas = this.canvasRef.current;

        this._canvas.addEventListener('mousedown', this.onSelect);

        this._context = this._canvas.getContext('2d');
        var border = "1px solid ".concat(((_this$props$theme = this.props.theme) === null || _this$props$theme === void 0 ? void 0 : (_this$props$theme$col = _this$props$theme.colors) === null || _this$props$theme$col === void 0 ? void 0 : _this$props$theme$col.text) || (this.props.colorScheme === 'light' ? '#000' : '#fff'));
        var availableShapes = [{
          label: 'Rectangle',
          variant: _config.SHAPES_VARIANTS.RECT,
          iconStyles: {
            height: 50,
            width: 100,
            border: border
          },
          drawFn: this.addRect
        }, {
          label: 'Square',
          variant: _config.SHAPES_VARIANTS.SQUARE,
          iconStyles: {
            border: border
          },
          drawFn: function drawFn(props) {
            return _this2.addSquare(_objectSpread({
              width: 75,
              height: 75
            }, props));
          } // iconUrl: undefined,

        }, {
          label: 'Circle',
          variant: _config.SHAPES_VARIANTS.CIRCLE,
          iconStyles: {
            border: border,
            borderRadius: '50%'
          },
          drawFn: this.addCircle // iconUrl: undefined,

        }];
        this.props.updateState({
          shapeOperations: {
            addImage: this.addImage,
            addRect: this.addRect,
            addCircle: this.addCircle,
            addText: this.addText,
            addOrUpdate: this.addAnyShape,
            updateShape: this.updateShape,
            updateShapes: this.updateShapes,
            replaceAllShapes: this.replaceAllShapes,
            deleteShape: this.deleteShapeByKeyOrIndex,
            deleteShapes: this.deleteAllShapesOrByTypeOrIndicies,
            setShapeVisibility: this.setShapeVisibilityByKeyOrIndex,
            getShape: this.getShapeByKeyOrIndex,
            getShapesIndicies: this.getShapesIndexByAnyProp,
            prepareFinalCanvas: this.prepareFinalCanvas
          },
          availableShapes: availableShapes
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._canvas.removeEventListener('mousedown', this.onSelect);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.width !== this.props.width || prevProps.height !== this.props.height) {
        this.redrawShape();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          parentCanvasHeight = _this$props4.height,
          parentCanvasWidth = _this$props4.width,
          _this$props4$selected = _this$props4.selectedShape,
          _this$props4$selected2 = _this$props4$selected.width,
          width = _this$props4$selected2 === void 0 ? 0 : _this$props4$selected2,
          _this$props4$selected3 = _this$props4$selected.height,
          height = _this$props4$selected3 === void 0 ? 0 : _this$props4$selected3,
          _this$props4$selected4 = _this$props4$selected.x,
          x = _this$props4$selected4 === void 0 ? 0 : _this$props4$selected4,
          _this$props4$selected5 = _this$props4$selected.y,
          y = _this$props4$selected5 === void 0 ? 0 : _this$props4$selected5,
          _this$props4$selected6 = _this$props4$selected.resizingBox,
          resizingBox = _this$props4$selected6 === void 0 ? false : _this$props4$selected6,
          _this$props4$selected7 = _this$props4$selected.lockScaleToPercentage,
          lockScaleToPercentage = _this$props4$selected7 === void 0 ? 0 : _this$props4$selected7,
          processWithCloudimage = _this$props4.processWithCloudimage,
          wrapperId = _this$props4.wrapperId;
      var resizingBoxLines = ['e', 'n', 'w', 's'];
      var resizingBoxPoints = ['ne', 'nw', 'sw', 'se'];

      if (!processWithCloudimage) {
        resizingBoxPoints.splice(0, 0, 'e', 'n', 'w', 's');
      }

      var left = (this._canvas ? this._canvas.offsetLeft : 0) + x;
      var top = (this._canvas ? this._canvas.offsetTop : 0) + y;
      var mutualStyles = {
        pointerEvents: 'all'
      };
      return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_styledComponents.PreviewCanvas, {
          ref: this.canvasRef,
          id: "".concat(wrapperId, "_").concat(_config.PREVIEW_CANVAS_ID),
          width: parentCanvasWidth,
          height: parentCanvasHeight,
          tabIndex: 1
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          ref: this.shapeResizingBoxRef,
          className: "cropper-crop-box",
          style: {
            display: resizingBox && !lockScaleToPercentage ? 'block' : 'none',
            width: width,
            height: height,
            left: left,
            top: top,
            pointerEvents: 'none'
          },
          children: [resizingBoxLines.map(function (l) {
            return /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
              className: "cropper-line line-".concat(l, " shape-resizing-control"),
              "data-direction": l,
              style: mutualStyles
            }, l);
          }), resizingBoxPoints.map(function (p) {
            return /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
              className: "cropper-point point-".concat(p, " shape-resizing-control"),
              "data-direction": p,
              style: mutualStyles
            }, p);
          })]
        })]
      });
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      return _objectSpread(_objectSpread({}, state), {}, {
        latestCanvasSize: props.latestCanvasSize || {
          width: 0,
          height: 0
        }
      });
    }
  }]);

  return CustomizedCanvas;
}(_react.Component);

exports.default = CustomizedCanvas;