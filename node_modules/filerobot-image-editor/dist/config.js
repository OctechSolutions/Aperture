"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CONTAINER_SELECTOR = exports.ORIGINAL_CANVAS_ID = exports.CANVAS_ID = exports.ON_CLOSE_STATUSES = exports.DEFAULT_IMG_URL = exports.SHAPES_VARIANTS = exports.WATERMARK_CLOUDIMAGE_FONTS = exports.STANDARD_FONTS = exports.WATERMARK_POSITIONS_PRESET = exports.WATERMARK_UNIQUE_KEY = exports.WATERMARK_POSITIONS = exports.CLOUDIMAGE_OPERATIONS = exports.UPLOADER = exports.FILTERS = exports.EFFECTS = exports.TOOLS = exports.PREVIEW_CANVAS_ID = exports.MODAL_ID = exports.DEFAULT_WATERMARK = void 0;
var CONTAINER_SELECTOR = 'filerobot-image-editor-root'; // The library modal ID.

exports.CONTAINER_SELECTOR = CONTAINER_SELECTOR;
var MODAL_ID = 'filerobot-image-editor-modal'; // ID for preview canvas (canvas contains watermark, shapes...etc).

exports.MODAL_ID = MODAL_ID;
var PREVIEW_CANVAS_ID = 'filerobot-shapes-edit-box';
exports.PREVIEW_CANVAS_ID = PREVIEW_CANVAS_ID;
var CANVAS_ID = 'filerobot-image-edit-box';
exports.CANVAS_ID = CANVAS_ID;
var ORIGINAL_CANVAS_ID = 'filerobot-image-edit-box-original'; // 'effects', 'filters', 'adjust', 'crop', 'resize', 'rotate'

exports.ORIGINAL_CANVAS_ID = ORIGINAL_CANVAS_ID;
var TOOLS = ['adjust', 'effects', 'filters', 'rotate', 'crop', 'resize', 'watermark', 'shapes', 'image', 'text']; // 'clarity', 'edge_enhance', 'emboss', 'grungy', 'hazy', 'lomo', 'noise', 'old_paper', 'posterize', 'radial_blur',
//   'sin_city', 'tilt_shift'

exports.TOOLS = TOOLS;
var EFFECTS = ['edge_enhance', 'emboss', 'grungy', 'hazy', 'lomo', 'radial_blur', 'sin_city', 'tilt_shift']; // 'colorize', 'contrast', 'cross_process', 'glow_sun', 'hdr_effect', 'jarques', 'love', 'old_boot',
//   'orange_peel', 'pin_hole', 'pleasant', 'sepia', 'sun_rise', 'vintage'

exports.EFFECTS = EFFECTS;
var FILTERS = ['cross_process', 'glow_sun', 'jarques', 'love', 'old_boot', 'orange_peel', 'pin_hole', 'sepia', 'sun_rise', 'vintage'];
exports.FILTERS = FILTERS;
var CLOUDIMAGE_OPERATIONS = ['crop', 'resize', 'rotate', 'watermark', 'focus_point'];
exports.CLOUDIMAGE_OPERATIONS = CLOUDIMAGE_OPERATIONS;
var WATERMARK_POSITIONS = ["left-top", "center-top", "right-top", "left-center", "center", "right-center", "left-bottom", "center-bottom", "right-bottom"]; // possible positions ["corners", "star", "center", "top-row", "center-row", "bottom-row"]

exports.WATERMARK_POSITIONS = WATERMARK_POSITIONS;
var WATERMARK_POSITIONS_PRESET = {
  "corners": [1, 0, 1, 0, 0, 0, 1, 0, 1],
  "star": [0, 1, 0, 1, 1, 1, 0, 1, 0],
  "center": [0, 0, 0, 0, 1, 0, 0, 0, 0],
  "top-row": [1, 1, 1, 0, 0, 0, 0, 0, 0],
  "center-row": [0, 0, 0, 1, 1, 1, 0, 0, 0],
  "bottom-row": [0, 0, 0, 0, 0, 0, 1, 1, 1]
};
exports.WATERMARK_POSITIONS_PRESET = WATERMARK_POSITIONS_PRESET;
var DEFAULT_WATERMARK = {
  opacity: 0.7,
  position: 'center',
  url: '',
  applyByDefault: false
};
exports.DEFAULT_WATERMARK = DEFAULT_WATERMARK;
var WATERMARK_UNIQUE_KEY = 'watermark-layer';
exports.WATERMARK_UNIQUE_KEY = WATERMARK_UNIQUE_KEY;
var cropPresets = [{
  name: 'original',
  value: 0
}, {
  name: 'square',
  value: 1
}, {
  name: 'banner',
  value: 7.8
}, {
  name: 'round',
  value: 1,
  radius: 50
}, {
  name: '5 : 4',
  value: 1.25
}, {
  name: '4 : 3',
  value: 1.33333
}, {
  name: '6 : 4',
  value: 1.5
}, {
  name: '16 : 9',
  value: 1.7777
}];
var resizePresets = [{
  name: 'big square',
  width: 600,
  height: 600,
  ratio: 1
}, {
  name: 'middle square',
  width: 400,
  height: 400,
  ratio: 1
}, {
  name: 'small square',
  width: 200,
  height: 200,
  ratio: 1
}, {
  name: 'small size',
  width: 1200,
  height: 960,
  ratio: 1.25
}, {
  name: 'better quality',
  width: 1920,
  height: 1536,
  ratio: 1.25
}, {
  name: 'small size',
  width: 1200,
  height: 900,
  ratio: 1.33333
}, {
  name: 'better quality',
  width: 1920,
  height: 1440,
  ratio: 1.33333
}, {
  name: 'small size',
  width: 1200,
  height: 800,
  ratio: 1.5
}, {
  name: 'better quality',
  width: 1920,
  height: 1280,
  ratio: 1.5
}, {
  name: 'small size',
  width: 1200,
  height: 675,
  ratio: 1.7777
}, {
  name: 'better quality',
  width: 1920,
  height: 1080,
  ratio: 1.7777
}, {
  name: 'small banner',
  width: 468,
  height: 60,
  ratio: 7.8
}, {
  name: 'big banner',
  width: 936,
  height: 120,
  ratio: 7.8
}];
var STANDARD_FONTS = [{
  label: 'Arial',
  value: 'Arial'
}, {
  label: 'Tahoma',
  value: 'Tahoma'
}, {
  label: 'Times New Roman',
  value: 'Times New Roman'
}, {
  label: 'Courier',
  value: 'Courier'
}, {
  label: 'Courier New',
  value: 'Courier New'
}, {
  label: 'Verdana',
  value: 'Verdana'
}, {
  label: 'Georgia',
  value: 'Georgia'
}, {
  label: 'Palatino',
  value: 'Palatino'
}, {
  label: 'Garamond',
  value: 'Garamond'
}, {
  label: 'Bookman',
  value: 'Bookman'
}, {
  label: 'Comic Sans MS',
  value: 'Comic Sans MS'
}, {
  label: 'Candara',
  value: 'Candara'
}, {
  label: 'Impact',
  value: 'Impact'
}];
exports.STANDARD_FONTS = STANDARD_FONTS;
var WATERMARK_CLOUDIMAGE_FONTS = [{
  label: 'Arial',
  value: 'Arial'
}, {
  label: 'Arial Bold',
  value: 'Arial-Bold'
}, {
  label: 'Arial Black',
  value: 'Arial-Black'
}, {
  label: 'AvantGarde Book',
  value: 'AvantGarde-Book'
}, {
  label: 'Bitstream Charter',
  value: 'Bitstream-Charter'
}, {
  label: 'Bitstream Charter Bold',
  value: 'Bitstream-Charter-Bold'
}, {
  label: 'Bookman Demi',
  value: 'Bookman-Demi'
}, {
  label: 'Comic Sans MS',
  value: 'Comic-Sans-MS'
}, {
  label: 'Courier',
  value: 'Courier'
}, {
  label: 'Courier Bold',
  value: 'Courier-Bold'
}, {
  label: 'Courier New',
  value: 'Courier-New	'
}, {
  label: 'Courier New Bold',
  value: 'Courier-New-bold'
}, {
  label: 'DejaVu Sans',
  value: 'DejaVu-Sans'
}, {
  label: 'DejaVu Sans Bold',
  value: 'DejaVu-Sans-bold'
}, {
  label: 'Dingbats',
  value: 'Dingbats'
}, {
  label: 'fixed',
  value: 'fixed'
}, {
  label: 'FreeMono',
  value: 'FreeMono'
}, {
  label: 'FreeMono Bold',
  value: 'FreeMono-Bold'
}, {
  label: 'FreeSans',
  value: 'FreeSans-Bold'
}, {
  label: 'Halvetica',
  value: 'Halvetica'
}, {
  label: 'Georgia',
  value: 'Georgia'
}, {
  label: 'Impact',
  value: 'Impact'
}, {
  label: 'Noto mono',
  value: 'Noto-Mono'
}];
exports.WATERMARK_CLOUDIMAGE_FONTS = WATERMARK_CLOUDIMAGE_FONTS;
var SHAPES_VARIANTS = {
  RECT: 'rect',
  SQUARE: 'square',
  CIRCLE: 'circle',
  IMAGE: 'image',
  TEXT: 'text'
};
exports.SHAPES_VARIANTS = SHAPES_VARIANTS;
var DEFAULT_IMG_URL = 'https://image.flaticon.com/icons/svg/916/916762.svg';
exports.DEFAULT_IMG_URL = DEFAULT_IMG_URL;
var UPLOADER = {
  hideCloudimageSwitcher: true,
  processWithCloudimage: false,
  uploadWithCloudimageLink: false,
  elementId: null,
  isLowQualityPreview: true,
  reduceBeforeEdit: {
    mode: 'manual',
    widthLimit: 2000,
    heightLimit: 2000
  },
  cropBeforeEdit: null,
  cropPresets: cropPresets,
  resizePresets: resizePresets
};
exports.UPLOADER = UPLOADER;
var ON_CLOSE_STATUSES = {
  CLOSE_BTN_CLICKED: 'close-button-clicked',
  TOOLBAR_CANCEL_BTN_CLICKED: 'toolbar-cancel-button-clicked',
  ESC_KEY_PRESSED: 'esc-key-pressed',
  MODAL_OVERLAY_CLICKED: 'modal-overlay-clicked',
  IMAGE_EDITS_COMPLETED: 'image-edits-completed',
  IMAGE_DOWNLOADED: 'image-downloaded',
  IMAGE_UPLOADED_FILEROBOT: 'image-uploaded-filerobot',
  IMAGE_UPLOADED_CLOUDIMAGE: 'image-uploaded-cloudimage',
  IMAGE_UPLOADING_FAIL_FILEROBOT: 'image-uploading-fail-filerobot'
};
exports.ON_CLOSE_STATUSES = ON_CLOSE_STATUSES;