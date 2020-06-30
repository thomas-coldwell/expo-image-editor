/// <reference types="react" />
interface EditingWindowProps {
    imageData: {
        uri: string | undefined;
        width: number;
        height: number;
    };
    fixedCropAspectRatio: number;
    lockAspectRatio: boolean;
    imageBounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    minimumCropDimensions: {
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
    onUpdatePanAndSize: ({ size, accumulatedPan }: {
        size: any;
        accumulatedPan: any;
    }) => void;
    isCropping: boolean;
}
declare function EditingWindow(props: EditingWindowProps): JSX.Element;
export { EditingWindow };
//# sourceMappingURL=EditingWindow.d.ts.map