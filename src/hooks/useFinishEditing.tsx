import {useContext} from "react";
import {useRecoilState} from "recoil";
import {EditorContext} from "../constants";
import {cropRatioState, processingState} from "../store";
import {useResizeToDesiredDimensions} from "./useResizeToDesiredDimensions";

export const useFinishEditing = () => {
    const resizeToDesiredDimensions = useResizeToDesiredDimensions()
    const [ratio] = useRecoilState(cropRatioState)
    const [_, setProcessing] = useRecoilState(processingState);
    const {onCloseEditor, onEditingComplete} = useContext(EditorContext)

    return async () => {
        const data = await resizeToDesiredDimensions()
        onEditingComplete({ ...data, ratio })
        setProcessing(false)
        return onCloseEditor()
    }
}
