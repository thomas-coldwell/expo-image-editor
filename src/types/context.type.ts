import {ImageDimensions} from "../store/store";
import {AdjustmentOperations, TransformOperations} from "./operation.type";
import {Mode} from "./mode.type";

export type EditorContextType = {
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
