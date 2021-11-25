import * as React from "react";
import {EditorContextType} from "../types";

export const EditorContext = React.createContext<EditorContextType>({
    minimumCropDimensions: {
        width: 0,
        height: 0,
    },
    fixedAspectRatio: 1.6,
    lockAspectRatio: false,
    mode: "full",
    onCloseEditor: () => {
    },
    onEditingComplete: () => {
    },
});
