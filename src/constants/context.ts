import * as React from "react";
import {EditorContextType} from "../types";

export const EditorContext = React.createContext<EditorContextType>({
    dimensionByAspectRatios: [ { width: 1600, height: 1600 } ],
    availableAspectRatios: [ 1 ],
    lockAspectRatio: undefined,
    translations: {
        cancel: "Cancel",
        validate: "Validate"
    },
    onCloseEditor: () => {},
    onEditingComplete: () => {},
});
