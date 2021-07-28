import { ExpoWebGLRenderingContext } from "expo-gl";
import { EditingOperations } from "expo-image-editor";
export interface ImageData {
    uri: string;
    height: number;
    width: number;
}
export declare const imageDataState: import("recoil").RecoilState<ImageData>;
export declare const imageScaleFactorState: import("recoil").RecoilState<number>;
export interface ImageBounds {
    x: number;
    y: number;
    height: number;
    width: number;
}
export declare const imageBoundsState: import("recoil").RecoilState<ImageBounds>;
export declare const readyState: import("recoil").RecoilState<boolean>;
export declare const processingState: import("recoil").RecoilState<boolean>;
export interface AccumulatedPan {
    x: number;
    y: number;
}
export declare const accumulatedPanState: import("recoil").RecoilState<AccumulatedPan>;
export interface ImageDimensions {
    width: number;
    height: number;
}
export declare const cropSizeState: import("recoil").RecoilState<ImageDimensions>;
export declare type EditingModes = "operation-select" | EditingOperations;
export declare const editingModeState: import("recoil").RecoilState<EditingModes>;
export declare const glContextState: import("recoil").RecoilState<ExpoWebGLRenderingContext | null>;
export declare const glProgramState: import("recoil").RecoilState<WebGLProgram | null>;
//# sourceMappingURL=Store.d.ts.map