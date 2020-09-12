import * as React from "react";
import { View, StyleSheet } from "react-native";
import _ from "lodash";
import { Mode } from "./ImageEditor";
import { useRecoilState } from "recoil";
import { editingModeState } from "./Store";
import { IconButton } from "./components/IconButton";

interface ControlBarProps {
  onPressBack: () => void;
  onPerformCrop: () => void;
  onRotate: (angle: number) => void;
  onFinishEditing: () => void;
  mode: Mode;
}

function ControlBar(props: ControlBarProps) {
  //
  const [editingMode] = useRecoilState(editingModeState);

  return (
    <View style={styles.container}>
      <IconButton
        iconID="arrow-back"
        text="Back"
        onPress={() => props.onPressBack()}
      />
      <IconButton
        iconID="done"
        text="Done"
        onPress={() => props.onFinishEditing()}
        disabled={editingMode == "operation-select"}
      />
    </View>
  );
}

export { ControlBar };

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 64,
    backgroundColor: "#333",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
  },
});
