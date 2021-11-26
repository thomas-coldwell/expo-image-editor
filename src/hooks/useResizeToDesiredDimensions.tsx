import React from "react";
import {useRecoilState} from "recoil";
import * as ImageManipulator from "expo-image-manipulator";
import {SaveFormat} from "expo-image-manipulator";
import {cropRatioState, imageDataState} from "../store";
import {EditorContext} from "../constants";

export const useResizeToDesiredDimensions = () => {
    const { availableAspectRatios, dimensionByAspectRatios } = React.useContext(EditorContext)
    const [ ratio ] = useRecoilState(cropRatioState)
    const [imageData] = useRecoilState(imageDataState);


    return async () => {
        const ratioIndex = availableAspectRatios.findIndex(r => r === ratio);
        const desiredDimensions = dimensionByAspectRatios[ratioIndex]

        if (desiredDimensions.width !== imageData.width || desiredDimensions.height !== imageData.height) {
            return await ImageManipulator.manipulateAsync(
                imageData.uri,
                [{resize: {width: desiredDimensions.width, height: desiredDimensions.height}}],
                {format: SaveFormat.JPEG, compress: 0.7}
            )
        }

        return imageData
    }

}
