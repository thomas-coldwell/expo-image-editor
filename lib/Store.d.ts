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
interface CropSize {
    width: number;
    height: number;
}
export declare const cropSizeState: import("recoil").RecoilState<CropSize>;
export declare const editingModeState: import("recoil").RecoilState<"crop" | "operation-select">;
export {};
//# sourceMappingURL=Store.d.ts.map