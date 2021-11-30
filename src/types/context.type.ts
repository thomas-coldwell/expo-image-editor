import {Result} from "./result.type";
import {ImageDimensions} from "./image-editor.type";

export type EditorContextType = {
    backIcon?: Element
    doneIcon?: Element
    cropIcon?: Element
    rotateIcon?: Element
    rotateLeftIcon?: Element
    rotateRightIcon?: Element
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
