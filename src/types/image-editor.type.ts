import {Mode} from "./mode.type";
import {TransformOperations} from "./operation.type";

export interface ImageEditorProps {
    visible: boolean;
    onCloseEditor: () => void;
    imageUri: string | undefined;
    availableAspectRatios: number[]
    minimumCropDimensions?: { width: number; height: number; };
    onEditingComplete: (result: any) => void;
    lockAspectRatio?: number;
    mode?: Mode;
    allowedTransformOperations?: TransformOperations[];
    asView?: boolean;
    translations?: {
        cancel?: string;
        validate?: string;
    }
}
