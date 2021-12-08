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

export interface Image {
    height: number
    width: number
    uri: string
}
