import * as React from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Icon } from "../components/Icon";
import { IconButton } from "../components/IconButton";
import { editingModeState, EditingModes } from "../Store";
import { useRecoilState } from "recoil";
import { OperationSelection } from "./OperationSelection";

interface Operation {
  title: string;
  iconID: string;
  operationID: EditingModes;
}

interface Operations {
  transform: Operation[];
  adjust: Operation[];
}

const operations: Operations = {
  transform: [
    {
      title: "Crop",
      iconID: "crop",
      operationID: "crop",
    },
    {
      title: "Rotate",
      iconID: "rotate-90-degrees-ccw",
      operationID: "rotate",
    },
  ],
  adjust: [
    {
      title: "Blur",
      iconID: "blur-on",
      operationID: "blur",
    },
  ],
};

export function OperationBar() {
  //
  const [editingMode] = useRecoilState(editingModeState);

  const getOperationWindow = () => {
    switch (editingMode) {
      case "operation-select":
        return <OperationSelection />;
      default:
        return null;
    }
  };

  return (
    <Animated.View style={styles.container}>
      {getOperationWindow()}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 160,
    width: "100%",
    backgroundColor: "#333",
  },
});
