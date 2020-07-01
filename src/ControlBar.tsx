import * as React from "react";
import { View, StyleSheet, TouchableOpacity, Text, Platform } from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import _ from "lodash";
import { Mode } from "./ImageEditor";

type EditingMode = "operation-select" | "crop";

interface ControlBarProps {
  onPressBack: () => void;
  onPerformCrop: () => void;
  editingMode: EditingMode;
  onChangeMode: (mode: EditingMode) => void;
  onRotate: (angle: number) => void;
  onFinishEditing: () => void;
  mode: Mode;
}

function ControlBar(props: ControlBarProps) {

  const onPressDone = async () => {
    // handle what action should be performed when the user press done
    if (props.mode == 'full') {
      if (props.editingMode == 'crop') {
        props.onPerformCrop();
      }
      else {
        props.onFinishEditing();
      }
    }
    else if (props.mode == 'crop-only') {
      props.onPerformCrop();
    }
    else {
      props.onFinishEditing();
    }
  }

  return (
    <View style={styles.container}>
      <Button
        iconID="md-arrow-back"
        source="ion"
        onPress={() => props.onPressBack()}
      />
      <View style={styles.buttonRow}>
        {
          props.mode == 'full' && props.editingMode == 'operation-select' ? 
            <Button
                iconID="crop"
                source="md"
                onPress={() => props.onChangeMode("crop")}
              />
          :
            null
        }
        {
          props.mode != 'crop-only' && props.editingMode != 'crop' ?
            <>
              <Button
                iconID="rotate-left"
                source="md"
                onPress={() => props.onRotate(Platform.OS == 'web' ? 90 : -90)}
              />
              <Button
                iconID="rotate-right"
                source="md"
                onPress={() => props.onRotate(Platform.OS == 'web' ? -90 : 90)}
              />
            </>
          :
            null
        }
        <Button
          iconID="md-checkmark"
          source="ion"
          onPress={() => onPressDone()}
        />
      </View>
    </View>
  );
}

export { ControlBar };

interface ControlBarButtonProps {
  onPress: () => void;
  iconID: string;
  source: "ion" | "md";
}

function Button(props: ControlBarButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={() => props.onPress()}>
      {props.source == "ion" ? (
        <Ionicons name={props.iconID} size={32} color="#fff" />
      ) : (
        <MaterialIcons name={props.iconID} size={32} color="#fff" />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 64,
    backgroundColor: "#333",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    height: 64,
    width: 64,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonRow: {
    flexShrink: 1,
    flexDirection: "row",
  },
});
