import {ImageDimensions} from "../store/store";
import {TransformOperations} from "./operation.type";
import {Mode} from "./mode.type";

type Result = {
    ratio: number
    height: number
    width: number
    uri: string
}

export type EditorContextType = {
    minimumCropDimensions: ImageDimensions;
    availableAspectRatios: number[];
    lockAspectRatio?: number;
    mode: Mode;
    onCloseEditor: () => void;
    onEditingComplete: (result: Result) => void;
    allowedTransformOperations?: TransformOperations[];
    translations?: {
        cancel?: string
        validate?: string
    }
};
