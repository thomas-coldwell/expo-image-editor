/// <reference types="react" />
import { Mode } from "./ImageEditor";
interface ControlBarProps {
    onPressBack: () => void;
    onFinishEditing: () => void;
    mode: Mode;
}
declare function ControlBar(props: ControlBarProps): JSX.Element;
export { ControlBar };
//# sourceMappingURL=ControlBar.d.ts.map