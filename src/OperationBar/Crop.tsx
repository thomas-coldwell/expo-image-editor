import * as React from "react";
import { StyleSheet, View, Text, Platform, Alert } from "react-native";
import { useRecoilState } from "recoil";
import { IconButton } from "../components/IconButton";
import {
  accumulatedPanState,
  cropSizeState,
  editingModeState,
  imageBoundsState,
  imageDataState,
  imageScaleFactorState,
  processingState,
  textTranslateOptionsState
} from "../Store";
import * as ImageManipulator from "expo-image-manipulator";

export function Crop() {
  const [accumulatedPan] = useRecoilState(accumulatedPanState);
  const [imageBounds] = useRecoilState(imageBoundsState);
  const [imageScaleFactor] = useRecoilState(imageScaleFactorState);
  const [cropSize] = useRecoilState(cropSizeState);
  const [, setProcessing] = useRecoilState(processingState);
  const [imageData, setImageData] = useRecoilState(imageDataState);
  const [, setEditingMode] = useRecoilState(editingModeState);
  const [textTranslateOptions] = useRecoilState(textTranslateOptionsState);

  const onPerformCrop = async () => {
    // Calculate cropping bounds
    const croppingBounds = {
      originX: Math.round(
        (accumulatedPan.x - imageBounds.x) * imageScaleFactor
      ),
      originY: Math.round(
        (accumulatedPan.y - imageBounds.y) * imageScaleFactor
      ),
      width: Math.round(cropSize.width * imageScaleFactor),
      height: Math.round(cropSize.height * imageScaleFactor),
    };
    // Set the editor state to processing and perform the crop
    setProcessing(true);
    const cropResult = await ImageManipulator.manipulateAsync(imageData.uri, [
      { crop: croppingBounds },
    ]);
    // Check if on web - currently there is a weird bug where it will keep
    // the canvas from ImageManipualtor at originX + width and so we'll just crop
    // the result again for now if on web - TODO write github issue!
    if (Platform.OS == "web") {
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
  };

  return (
    <View style={styles.container}>
      <IconButton
        iconID="close"
        text={textTranslateOptions.cancel}
        onPress={() => setEditingMode("operation-select")}
      />
      <Text style={styles.prompt}>Adjust window to crop</Text>
      <IconButton
        iconID="check"
        text={textTranslateOptions.done}
        onPress={() =>
          onPerformCrop().catch(() => {
            // If there's an error dismiss the the editor and alert the user
            setProcessing(false);
            Alert.alert("An error occurred while editing.");
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "2%",
  },
  prompt: {
    color: "#fff",
    fontSize: 21,
    textAlign: "center",
  },
});
