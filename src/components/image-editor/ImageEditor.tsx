import {RecoilRoot} from "recoil";
import * as React from "react";
import {ImageEditorCore} from "./ImageEditorCore";
import {ImageEditorProps} from "../../types";

export function ImageEditor(props: ImageEditorProps) {
    return (
        <RecoilRoot>
            <ImageEditorCore {...props} />
        </RecoilRoot>
    );
}
