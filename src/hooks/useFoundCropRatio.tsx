import {useRecoilState} from "recoil";
import * as React from "react";
import {cropRatioState, imageDataState} from "../store";
import {EditorContext} from "../constants";

export const useFoundCropRatio = () => {
    const { availableAspectRatios, lockAspectRatio } = React.useContext(EditorContext)
    const [_, setCropRatio] = useRecoilState(cropRatioState)
    const [imageData] = useRecoilState(imageDataState);

    return () => {
        if (lockAspectRatio) {
            return setCropRatio(lockAspectRatio)
        }

        let ratio: number
        if (imageData.width > imageData.height) {
            ratio = imageData.width / imageData.height
        } else {
            ratio = imageData.height / imageData.width
            if (ratio > 1) {
                ratio = ratio - 1
            }
        }
        const usedRatio = availableAspectRatios.reduce(function(prev, curr) {
            return (Math.abs(curr - ratio) < Math.abs(prev - ratio) ? curr : prev);
        })

        setCropRatio(usedRatio)
    }
}
