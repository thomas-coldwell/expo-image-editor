/// <reference types="react" />
declare type Mode = 'operation-select' | 'crop';
interface ControlBarProps {
    onPressBack: () => void;
    onPerformCrop: () => void;
    mode: Mode;
    onChangeMode: (mode: Mode) => void;
    onRotate: (angle: number) => void;
}
declare function ControlBar(props: ControlBarProps): JSX.Element;
export { ControlBar };
//# sourceMappingURL=ControlBar.d.ts.map