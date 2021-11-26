import * as React from "react";
import {EditorContextType} from "../types";

export const EditorContext = React.createContext<EditorContextType>({
    minimumCropDimensions: {width: 0, height: 0,},
    availableAspectRatios: [ 1 ],
    lockAspectRatio: undefined,
    mode: "full",
    translations: {
        cancel: "Cancel",
        validate: "Validate"
    },
    onCloseEditor: () => {},
    onEditingComplete: () => {},
});
