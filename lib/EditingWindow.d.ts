/// <reference types="react" />
interface EditingWindowProps {
    fixedCropAspectRatio: number;
    lockAspectRatio: boolean;
    minimumCropDimensions: {
        width: number;
        height: number;
    };
}
declare function EditingWindow(props: EditingWindowProps): JSX.Element;
export { EditingWindow };
//# sourceMappingURL=EditingWindow.d.ts.map