/// <reference types="react" />
interface EditingWindowProps {
    imageData: {
        uri: string | undefined;
        width: number;
        height: number;
    };
    fixedCropAspectRatio: number;
    imageBounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    onUpdateImageBounds: (bounds: any) => void;
    accumulatedPan: {
        x: number;
        y: number;
    };
    onUpdateAccumulatedPan: (accumulatedPan: any) => void;
    cropSize: {
        width: number;
        height: number;
    };
    onUpdateCropSize: (size: any) => void;
}
declare function EditingWindow(props: EditingWindowProps): JSX.Element;
export { EditingWindow };
//# sourceMappingURL=EditingWindow.d.ts.map