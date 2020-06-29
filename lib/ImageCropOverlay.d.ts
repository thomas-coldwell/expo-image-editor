/// <reference types="react" />
interface ImageCropOverlayProps {
    imageBounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    fixedAspectRatio: number;
    accumulatedPan: {
        x: number;
        y: number;
    };
    minimumCropDimensions: {
        width: number;
        height: number;
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
}
declare function ImageCropOverlay(props: ImageCropOverlayProps): JSX.Element;
export { ImageCropOverlay };
//# sourceMappingURL=ImageCropOverlay.d.ts.map