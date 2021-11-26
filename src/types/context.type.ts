import {ImageDimensions} from "../store";
import {Result} from "./result.type";

export type EditorContextType = {
    availableAspectRatios: number[];
    lockAspectRatio?: number;
    dimensionByAspectRatios: ImageDimensions[];
    translations?: {
        cancel?: string
        validate?: string
    }
    onEditingComplete: (result: Result) => void;
    onCloseEditor: () => void;
};
