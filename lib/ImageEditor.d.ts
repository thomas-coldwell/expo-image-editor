/// <reference types="react" />
export declare type Mode = 'full' | 'crop-only' | 'rotate-only';
export interface ImageEditorProps {
    visible: boolean;
    onCloseEditor: () => void;
    imageData: {
        uri: string | undefined;
        width: number;
        height: number;
    };
    fixedCropAspectRatio: number;
    minimumCropDimensions: {
        width: number;
        height: number;
    };
    onEditingComplete: (result: any) => void;
    lockAspectRatio: boolean;
    mode: Mode;
}
declare function ImageEditor(props: ImageEditorProps): JSX.Element;
export { ImageEditor };
//# sourceMappingURL=ImageEditor.d.ts.map