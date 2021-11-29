import {Result} from "./result.type";
import {ImageDimensions} from "./image-editor.type";

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
