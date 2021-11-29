import {useRecoilState} from "recoil";
import * as ImageManipulator from "expo-image-manipulator";
import {Alert, Platform} from "react-native";
import {
    accumulatedPanState,
    cropSizeState,
    editingModeState,
    imageBoundsState,
    imageDataState,
    imageScaleFactorState,
    processingState,
} from "../store";

export const usePerformCrop = () => {
    const [accumulatedPan] = useRecoilState(accumulatedPanState);
    const [imageBounds] = useRecoilState(imageBoundsState);
    const [imageScaleFactor] = useRecoilState(imageScaleFactorState);
    const [cropSize] = useRecoilState(cropSizeState);
    const [, setProcessing] = useRecoilState(processingState);
    const [imageData, setImageData] = useRecoilState(imageDataState);
    const [, setEditingMode] = useRecoilState(editingModeState);

    return async () => {
        try {
            let originX: number

            const {x, y} = accumulatedPan

            const isXEqualToZero = x === 0
            const isXEqualToCropAreaX = x === cropSize.x
            const isXBetweenZeroAndCropAreaX = x > 0 && x < cropSize.x
            const isEndOfImage = Math.abs(x) === cropSize.x

            // The image hasn't moved at all
            if (isXEqualToZero) {
                originX = cropSize.x
            // The image has moved to the limit of the crop area x
            } else if (isXEqualToCropAreaX) {
                originX = 0
            // The image has moved between zero and the limit of the crop area x
            } else if (isXBetweenZeroAndCropAreaX) {
                originX = cropSize.x - x
            // The image has moved and his end is at the right limit of the crop area x
            } else if(isEndOfImage) {
                originX = Math.abs(x) * 2
            // The image has moved and x is negative, we get his absolute value + the crop area x value
            } else {
                originX = Math.abs(x) + cropSize.x
            }

            console.log(y)

            // Calculate cropping bounds
            const croppingBounds = {
                originX: Math.round(originX * imageScaleFactor),
                originY: 0,
                width: Math.round(cropSize.width * imageScaleFactor),
                height: Math.round(cropSize.height * imageScaleFactor),
            };

            // Set the editor state to processing and perform the crop
            setProcessing(true);
            const cropResult = await ImageManipulator.manipulateAsync(imageData.uri, [
                {crop: croppingBounds},
            ]);
            // Check if on web - currently there is a weird bug where it will keep
            // the canvas from ImageManipualtor at originX + width and so we'll just crop
            // the result again for now if on web - TODO write github issue!
            if (Platform.OS === "web") {
                const webCorrection = await ImageManipulator.manipulateAsync(
                    cropResult.uri,
                    [{
                        resize: {  },
                        crop: {...croppingBounds},
                    }]
                );
                const {uri, width, height} = webCorrection;
                setImageData({uri, width, height});
            } else {
                const {uri, width, height} = cropResult;
                setImageData({uri, width, height});
            }
            setProcessing(false);
            setEditingMode("operation-select");
        } catch (error) {
            // If there's an error dismiss the the editor and alert the user
            setProcessing(false);
            Alert.alert("An error occurred while editing.");
        }
    };
};
