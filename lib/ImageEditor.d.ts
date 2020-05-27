/// <reference types="react" />
export interface ImageEditorProps {
    visible: boolean;
    onCloseEditor: () => void;
    imageData: {
        uri: string | undefined;
        width: number;
        height: number;
    };
    fixedCropAspectRatio: number;
    onEditingComplete: (result: any) => void;
}
declare function ImageEditor(props: ImageEditorProps): JSX.Element;
export { ImageEditor };
//# sourceMappingURL=ImageEditor.d.ts.map