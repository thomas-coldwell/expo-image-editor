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
} from "../Store";
import * as ImageManipulator from "expo-image-manipulator";

export function Rotate() {
  //
  const [, setProcessing] = useRecoilState(processingState);
  const [imageData, setImageData] = useRecoilState(imageDataState);
  const [, setEditingMode] = useRecoilState(editingModeState);

  const [originalImageData] = React.useState(imageData);

  const [rotation, setRotation] = React.useState(0);

  React.useEffect(() => {
    if (rotation !== 0) {
      onRotate(rotation);
    } else {
      setImageData(originalImageData);
    }
  }, [rotation]);

  const onRotate = async (angle: number) => {
    setProcessing(true);
    // Rotate the image by the specified angle
    // To get rid of thing white line caused by context its being painted onto
    // crop 1 px border off https://github.com/expo/expo/issues/7325
    const {
      uri: rotateUri,
      width: rotateWidth,
      height: rotateHeight,
    } = await ImageManipulator.manipulateAsync(originalImageData.uri, [
      { rotate: angle },
    ]);
    const { uri, width, height } = await ImageManipulator.manipulateAsync(
      rotateUri,
      [
        {
          crop: {
            originX: 1,
            originY: 1,
            width: rotateWidth - 2,
            height: rotateHeight - 2,
          },
        },
      ]
    );
    setImageData({ uri, width, height });
    setProcessing(false);
  };

  const onClose = () => {
    // If closing reset the image back to its original
    setImageData(originalImageData);
    setEditingMode("operation-select");
  };

  return (
    <View style={styles.container}>
      <View style={[styles.row, { paddingHorizontal: 200 }]}>
        <IconButton
          iconID="rotate-left"
          text="Rotate -90"
          onPress={() =>
            setRotation(rotation + (Platform.OS === "web" ? 90 : -90))
          }
        />
        <IconButton
          iconID="rotate-right"
          text="Rotate +90"
          onPress={() =>
            setRotation(rotation - (Platform.OS === "web" ? 90 : -90))
          }
        />
      </View>
      <View style={styles.row}>
        <IconButton iconID="close" text="Cancel" onPress={() => onClose()} />
        <Text style={styles.prompt}>Rotate</Text>
        <IconButton
          iconID="check"
          text="Done"
          onPress={() => setEditingMode("operation-select")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  prompt: {
    color: "#fff",
    fontSize: 24,
    textAlign: "center",
  },
  row: {
    width: "100%",
    height: 80,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
  },
});
