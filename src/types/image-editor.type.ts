import {Result} from "./result.type";

export type ImageDimensions = {
    width: number;
    height: number;
}

export interface ImageEditorProps {
    visible: boolean;
    imageUri: string;
    backIcon?: Element
    doneIcon?: Element
    cropIcon?: Element
    rotateIcon?: Element
    rotateLeftIcon?: Element
    rotateRightIcon?: Element
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
