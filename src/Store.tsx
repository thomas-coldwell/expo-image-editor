import { ExpoWebGLRenderingContext } from "expo-gl";
import { atom } from "recoil";

interface ImageData {
  uri: string;
  height: number;
  width: number;
}

export const imageDataState = atom<ImageData>({
  key: "imageDataState",
  default: {
    uri: undefined,
    width: 0,
    height: 0,
  },
});

export const imageScaleFactorState = atom<number>({
  key: "imageScaleFactorState",
  default: 1,
});

interface ImageBounds {
  x: number;
  y: number;
  height: number;
  width: number;
}

export const imageBoundsState = atom<ImageBounds>({
  key: "imageBoundsState",
  default: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
});

export const readyState = atom<boolean>({
  key: "readyState",
  default: false,
});

export const processingState = atom<boolean>({
  key: "processingState",
  default: false,
});

interface AccumulatedPan {
  x: number;
  y: number;
}

export const accumulatedPanState = atom<AccumulatedPan>({
  key: "accumulatedPanState",
  default: {
    x: 0,
    y: 0,
  },
});

interface ImageDimensions {
  width: number;
  height: number;
}

export const cropSizeState = atom<ImageDimensions>({
  key: "cropSizeState",
  default: {
    width: 0,
    height: 0,
  },
});

export type EditingModes = "operation-select" | "crop" | "rotate" | "blur";

export const editingModeState = atom<EditingModes>({
  key: "editingModeState",
  default: "operation-select",
});

export const fixedCropAspectRatioState = atom<number>({
  key: "fixedCropAspectRatioState",
  default: 1,
});

export const lockAspectRatioState = atom<boolean>({
  key: "lockAspectRatioState",
  default: false,
});

export const minimumCropDimensionsState = atom<ImageDimensions>({
  key: "minimumCropDimensionsState",
  default: {
    width: 0,
    height: 0,
  },
});

interface GLContext {
  gl: ExpoWebGLRenderingContext | null;
  program: WebGLProgram;
  verts: Float32Array;
}

export const glContextState = atom<GLContext["gl"]>({
  key: "glContextState",
  default: null,
});

export const glProgramState = atom<GLContext["program"]>({
  key: "glProgramState",
  default: null,
});
