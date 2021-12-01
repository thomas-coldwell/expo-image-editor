import {useRecoilState} from "recoil";
import * as React from "react";
import {cropRatioState, imageDataState} from "../store";
import {EditorContext} from "../constants";

export const useFoundCropRatio = () => {
    const { availableAspectRatios } = React.useContext(EditorContext)
    const [_, setCropRatio] = useRecoilState(cropRatioState)
    const [imageData] = useRecoilState(imageDataState);

    return () => {
        console.log('calcul ratio')
        let ratio: number
        if (imageData.width > imageData.height) {
            ratio = imageData.width / imageData.height
        } else {
            ratio = imageData.height / imageData.width
        }
        const usedRatio = availableAspectRatios.reduce(function(prev, curr) {
            return (Math.abs(curr - ratio) < Math.abs(prev - ratio) ? curr : prev);
        })

        setCropRatio(usedRatio)
    }
}
