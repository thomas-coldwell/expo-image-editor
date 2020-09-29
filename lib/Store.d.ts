interface ImageData {
    uri: string;
    height: number;
    width: number;
}
export declare const imageDataState: import("recoil").RecoilState<ImageData>;
export declare const imageScaleFactorState: import("recoil").RecoilState<number>;
interface ImageBounds {
    x: number;
    y: number;
    height: number;
    width: number;
}
export declare const imageBoundsState: import("recoil").RecoilState<ImageBounds>;
export declare const readyState: import("recoil").RecoilState<boolean>;
export declare const processingState: import("recoil").RecoilState<boolean>;
interface AccumulatedPan {
    x: number;
    y: number;
}
export declare const accumulatedPanState: import("recoil").RecoilState<AccumulatedPan>;
interface ImageDimensions {
    width: number;
    height: number;
}
export declare const cropSizeState: import("recoil").RecoilState<ImageDimensions>;
export declare type EditingModes = "operation-select" | "crop" | "rotate" | "blur";
export declare const editingModeState: import("recoil").RecoilState<EditingModes>;
export declare const fixedCropAspectRatioState: import("recoil").RecoilState<number>;
export declare const lockAspectRatioState: import("recoil").RecoilState<boolean>;
export declare const minimumCropDimensionsState: import("recoil").RecoilState<ImageDimensions>;
export {};
//# sourceMappingURL=Store.d.ts.map