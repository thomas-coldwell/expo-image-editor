type ImageSize = { width: number, height: number }

export interface ImageEditorProps {
    visible: boolean;
    imageUri: string;
    availableAspectRatios: number[]
    lockAspectRatio?: number;
    dimensionByAspectRatios: ImageSize[]
    translations?: {
        cancel?: string;
        validate?: string;
    }
    onEditingComplete: (result: any) => void;
    onCloseEditor: () => void;
}
