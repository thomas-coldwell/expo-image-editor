import { ExpoWebGLRenderingContext } from "expo-gl";
import { EditingOperations } from "expo-image-editor";
import { atom } from "recoil";
import create from "zustand";

export interface ImageData {
  uri: string;
  height: number;
  width: number;
}
export interface ImageDataStore extends ImageData {
  setImageData: (data: ImageData) => void;
}

export const useImageData = create<ImageDataStore>((set) => ({
  uri: "",
  width: 0,
  height: 0,
  setImageData: (data) => set(data),
}));

export interface ImageBounds {
  x: number;
  y: number;
  height: number;
  width: number;
}

export interface ImageLayoutStore {
  bounds: ImageBounds;
  scaleFactor: number;
  setImageBounds: (bounds: ImageBounds) => void;
  setScaleFactor: (sf: number) => void;
}

export const useImageLayout = create<ImageLayoutStore>((set) => ({
  bounds: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
  scaleFactor: 1,
  setImageBounds: (bounds) => set({ bounds }),
  setScaleFactor: (sf) => set({ scaleFactor: sf }),
}));

export const imageBoundsState = atom<ImageBounds>({
  key: "imageBoundsState",
  default: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
});

export type EditingModes = "operation-select" | EditingOperations;

export const editingModeState = atom<EditingModes>({
  key: "editingModeState",
  default: "operation-select",
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

export interface ImageDimensions {
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

interface GLContext {
  gl: ExpoWebGLRenderingContext | null;
  program: WebGLProgram;
  verts: Float32Array;
}

export const glContextState = atom<GLContext["gl"]>({
  key: "glContextState",
  default: null,
});

export const glProgramState = atom<GLContext["program"] | null>({
  key: "glProgramState",
  default: null,
});
