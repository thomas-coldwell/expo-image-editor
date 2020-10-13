import * as React from "react";
import { View, StyleSheet } from "react-native";
import _ from "lodash";
import { useRecoilState } from "recoil";
import { editingModeState } from "./Store";
import { IconButton } from "./components/IconButton";

interface ControlBarProps {
  onPressBack: () => void;
  onFinishEditing: () => void;
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
        disabled={editingMode !== "operation-select"}
      />
    </View>
  );
}

export { ControlBar };

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 80,
    backgroundColor: "#333",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
  },
});
