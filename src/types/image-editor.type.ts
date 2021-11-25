import {Mode} from "./mode.type";
import {TransformOperations} from "./operation.type";

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
    mode?: Mode;
    allowedTransformOperations?: TransformOperations[];
    asView?: boolean;
}
