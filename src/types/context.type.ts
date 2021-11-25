import {ImageDimensions} from "../store/store";
import {TransformOperations} from "./operation.type";
import {Mode} from "./mode.type";

export type EditorContextType = {
    minimumCropDimensions: ImageDimensions;
    availableAspectRatios: number[];
    lockAspectRatio?: number;
    mode: Mode;
    onCloseEditor: () => void;
    onEditingComplete: (result: any) => void;
    allowedTransformOperations?: TransformOperations[];
};
