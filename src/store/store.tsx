import { atom } from "recoil";
import {LayoutRectangle} from "react-native";
import {EditingOperations} from "../types";

export interface ImageData {
  uri: string;
  height: number;
  width: number;
}

export const imageDataState = atom<ImageData>({
  key: "imageDataState",
  default: {
    uri: "",
    width: 0,
    height: 0,
  },
});

export const imageScaleFactorState = atom<number>({
  key: "imageScaleFactorState",
  default: 1,
});

export interface ImageBounds {
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

export interface AccumulatedPan {
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

export const cropSizeState = atom<LayoutRectangle>({
  key: "cropSizeState",
  default: {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  },
});

export const cropRatioState = atom<number>({
  key: "cropRatioState",
  default: 1,
})

export type EditingModes = "operation-select" | EditingOperations;

export const editingModeState = atom<EditingModes>({
  key: "editingModeState",
  default: "operation-select",
});
