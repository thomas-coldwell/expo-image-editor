import {ImageDimensions} from "../store";
import {Result} from "./result.type";

export interface ImageEditorProps {
    visible: boolean;
    imageUri: string;
    availableAspectRatios: number[]
    lockAspectRatio?: number;
    dimensionByAspectRatios: ImageDimensions[]
    translations?: {
        cancel?: string;
        validate?: string;
    }
    onEditingComplete: (result: Result) => void;
    onCloseEditor: () => void;
}
