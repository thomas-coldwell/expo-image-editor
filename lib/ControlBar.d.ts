/// <reference types="react" />
import { Mode } from "./ImageEditor";
interface ControlBarProps {
    onPressBack: () => void;
    onPerformCrop: () => void;
    onRotate: (angle: number) => void;
    onFinishEditing: () => void;
    mode: Mode;
}
declare function ControlBar(props: ControlBarProps): JSX.Element;
export { ControlBar };
//# sourceMappingURL=ControlBar.d.ts.map