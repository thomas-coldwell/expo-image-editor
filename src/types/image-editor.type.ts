import {Mode} from "./mode.type";
import {AdjustmentOperations, TransformOperations} from "./operation.type";

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
    asView?: boolean;
}
