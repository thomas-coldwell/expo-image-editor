"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minimumCropDimensionsState = exports.lockAspectRatioState = exports.fixedCropAspectRatioState = exports.editingModeState = exports.cropSizeState = exports.accumulatedPanState = exports.processingState = exports.readyState = exports.imageBoundsState = exports.imageScaleFactorState = exports.imageDataState = void 0;
const recoil_1 = require("recoil");
exports.imageDataState = recoil_1.atom({
    key: "imageDataState",
    default: {
        uri: undefined,
        width: 0,
        height: 0,
    },
});
exports.imageScaleFactorState = recoil_1.atom({
    key: "imageScaleFactorState",
    default: 1,
});
exports.imageBoundsState = recoil_1.atom({
    key: "imageBoundsState",
    default: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    },
});
exports.readyState = recoil_1.atom({
    key: "readyState",
    default: false,
});
exports.processingState = recoil_1.atom({
    key: "processingState",
    default: false,
});
exports.accumulatedPanState = recoil_1.atom({
    key: "accumulatedPanState",
    default: {
        x: 0,
        y: 0,
    },
});
exports.cropSizeState = recoil_1.atom({
    key: "cropSizeState",
    default: {
        width: 0,
        height: 0,
    },
});
exports.editingModeState = recoil_1.atom({
    key: "editingModeState",
    default: "operation-select",
});
exports.fixedCropAspectRatioState = recoil_1.atom({
    key: "fixedCropAspectRatioState",
    default: 1,
});
exports.lockAspectRatioState = recoil_1.atom({
    key: "lockAspectRatioState",
    default: false,
});
exports.minimumCropDimensionsState = recoil_1.atom({
    key: "minimumCropDimensionsState",
    default: {
        width: 0,
        height: 0,
    },
});
//# sourceMappingURL=Store.js.map