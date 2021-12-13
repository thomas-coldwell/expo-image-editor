import {ReactElement} from "react";

export type Translations = {
    [key: string]: string;
};

export interface ImageEditorProps {
    visible: boolean
    onClose: () => void
    uri: string
    translations: Translations
    RenderBackIcon: ReactElement
    RenderCheckIcon: ReactElement
    RenderRotateComponent: ReactElement

}

export interface Ratio {
    value: number
    label: string
    exampleSize: { width: number, height: number }
}

export interface ImageLayout {
    height: number
    width: number
    x?: number
    y?: number
    uri?: string
}

export type AnimatedContext = {
    startX: number
    startY: number
}

export enum RotateValues {
    ROTATE_0 = 0,
    ROTATE_90 = -90,
    ROTATE_180 = -180,
    ROTATE_270 = -270
}
