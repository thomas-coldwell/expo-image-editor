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
    onUpdateAccumulatedPan: (accumulatedPan: any) => void;
    cropSize: {
        width: number;
        height: number;
    };
    onUpdateCropSize: (size: any) => void;
}
declare function ImageCropOverlay(props: ImageCropOverlayProps): JSX.Element;
export { ImageCropOverlay };
//# sourceMappingURL=ImageCropOverlay.d.ts.map