import * as React from "react";
import { ImageDimensions } from "./Store";
declare type EditorContextType = {
    throttleBlur: boolean;
    minimumCropDimensions: ImageDimensions;
    fixedAspectRatio: number;
    lockAspectRatio: boolean;
    mode: Mode;
    onCloseEditor: () => void;
    onEditingComplete: (result: any) => void;
    allowedTransformOperations?: TransformOperations[];
    allowedAdjustmentOperations?: AdjustmentOperations[];
};
export declare const EditorContext: React.Context<EditorContextType>;
export declare type Mode = "full" | "crop-only";
export declare type TransformOperations = "crop" | "rotate";
export declare type AdjustmentOperations = "blur";
export declare type EditingOperations = TransformOperations | AdjustmentOperations;
export interface ImageEditorProps {
    visible: boolean;
    onCloseEditor: () => void;
    imageUri: string | undefined;
    fixedCropAspectRatio?: number;
    minimumCropDimensions?: {
        width: number;
        height: number;
    };
    onEditingComplete: (result: any) => void;
    lockAspectRatio?: boolean;
    throttleBlur?: boolean;
    mode?: Mode;
    allowedTransformOperations?: TransformOperations[];
    allowedAdjustmentOperations?: AdjustmentOperations[];
}
export declare function ImageEditorView(props: ImageEditorProps): JSX.Element;
export declare function ImageEditor(props: ImageEditorProps): JSX.Element;
export {};
//# sourceMappingURL=ImageEditor.d.ts.map