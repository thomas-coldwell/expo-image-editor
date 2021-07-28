import { atom } from "recoil";
export const imageDataState = atom({
    key: "imageDataState",
    default: {
        uri: "",
        width: 0,
        height: 0,
    },
});
export const imageScaleFactorState = atom({
    key: "imageScaleFactorState",
    default: 1,
});
export const imageBoundsState = atom({
    key: "imageBoundsState",
    default: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    },
});
export const readyState = atom({
    key: "readyState",
    default: false,
});
export const processingState = atom({
    key: "processingState",
    default: false,
});
export const accumulatedPanState = atom({
    key: "accumulatedPanState",
    default: {
        x: 0,
        y: 0,
    },
});
export const cropSizeState = atom({
    key: "cropSizeState",
    default: {
        width: 0,
        height: 0,
    },
});
export const editingModeState = atom({
    key: "editingModeState",
    default: "operation-select",
});
export const glContextState = atom({
    key: "glContextState",
    default: null,
});
export const glProgramState = atom({
    key: "glProgramState",
    default: null,
});
