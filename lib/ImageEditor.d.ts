/// <reference types="react" />
export declare type Mode = "full" | "crop-only" | "rotate-only";
export interface ImageEditorProps {
    visible: boolean;
    onCloseEditor: () => void;
    imageUri: string | undefined;
    fixedCropAspectRatio: number;
    minimumCropDimensions: {
        width: number;
        height: number;
    };
    onEditingComplete: (result: any) => void;
    lockAspectRatio: boolean;
    throttleBlur?: boolean;
}
export declare function ImageEditor(props: ImageEditorProps): JSX.Element;
//# sourceMappingURL=ImageEditor.d.ts.map