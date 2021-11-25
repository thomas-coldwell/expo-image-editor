import * as React from "react";
import {EditorContextType} from "../types";

export const EditorContext = React.createContext<EditorContextType>({
    throttleBlur: true,
    minimumCropDimensions: {
        width: 0,
        height: 0,
    },
    fixedAspectRatio: [ 0.8, 1, 1.91 ],
    lockAspectRatio: false,
    mode: "full",
    onCloseEditor: () => {
    },
    onEditingComplete: () => {
    },
});
