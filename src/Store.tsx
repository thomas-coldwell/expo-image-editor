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

interface CropSize {
  width: number;
  height: number;
}

export const cropSizeState = atom<CropSize>({
  key: "cropSizeState",
  default: {
    width: 0,
    height: 0,
  },
});

export const editingModeState = atom<"crop" | "operation-select">({
  key: "editingModeState",
  default: "operation-select",
});
