import { useCallback } from "react";
import { useRecoilState } from "recoil";
import {
  accumulatedPanState,
  cropSizeState,
  editingModeState,
  processingState,
  useImageData,
  useImageLayout,
} from "../Store";
import * as ImageManipulator from "expo-image-manipulator";
import { Alert, Platform } from "react-native";

export const usePerformCrop = () => {
  const [accumulatedPan] = useRecoilState(accumulatedPanState);
  const [bounds, scaleFactor] = useImageLayout(({ bounds, scaleFactor }) => [
    bounds,
    scaleFactor,
  ]);
  const [cropSize] = useRecoilState(cropSizeState);
  const [, setProcessing] = useRecoilState(processingState);
  const { setImageData, ...imageData } = useImageData();
  const [, setEditingMode] = useRecoilState(editingModeState);
  const onPerformCrop = async () => {
    try {
      // Calculate cropping bounds
      const croppingBounds = {
        originX: Math.round((accumulatedPan.x - bounds.x) * scaleFactor),
        originY: Math.round((accumulatedPan.y - bounds.y) * scaleFactor),
        width: Math.round(cropSize.width * scaleFactor),
        height: Math.round(cropSize.height * scaleFactor),
      };
      // Set the editor state to processing and perform the crop
      setProcessing(true);
      const cropResult = await ImageManipulator.manipulateAsync(imageData.uri, [
        { crop: croppingBounds },
      ]);
      // Check if on web - currently there is a weird bug where it will keep
      // the canvas from ImageManipualtor at originX + width and so we'll just crop
      // the result again for now if on web - TODO write github issue!
      if (Platform.OS === "web") {
        const webCorrection = await ImageManipulator.manipulateAsync(
          cropResult.uri,
          [{ crop: { ...croppingBounds, originX: 0, originY: 0 } }]
        );
        const { uri, width, height } = webCorrection;
        setImageData({ uri, width, height });
      } else {
        const { uri, width, height } = cropResult;
        setImageData({ uri, width, height });
      }
      setProcessing(false);
      setEditingMode("operation-select");
    } catch (error) {
      // If there's an error dismiss the the editor and alert the user
      setProcessing(false);
      Alert.alert("An error occurred while editing.");
    }
  };
  return onPerformCrop;
};
