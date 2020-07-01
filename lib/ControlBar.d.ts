/// <reference types="react" />
import { Mode } from "./ImageEditor";
declare type EditingMode = "operation-select" | "crop";
interface ControlBarProps {
    onPressBack: () => void;
    onPerformCrop: () => void;
    editingMode: EditingMode;
    onChangeMode: (mode: EditingMode) => void;
    onRotate: (angle: number) => void;
    onFinishEditing: () => void;
    mode: Mode;
}
declare function ControlBar(props: ControlBarProps): JSX.Element;
export { ControlBar };
//# sourceMappingURL=ControlBar.d.ts.map