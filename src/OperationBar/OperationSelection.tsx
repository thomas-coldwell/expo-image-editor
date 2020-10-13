import * as React from "react";
import {
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

export function OperationSelection() {
  //
  const [selectedOperation, setSelectedOperation] = React.useState<
    "transform" | "adjust"
  >("transform");

  const [, setEditingMode] = useRecoilState(editingModeState);

  return (
    <>
      <ScrollView style={styles.opRow} horizontal>
        {operations[selectedOperation].map((item, index) => (
          <View style={styles.opContainer} key={item.title}>
            <IconButton
              text={item.title}
              iconID={item.iconID}
              onPress={() => setEditingMode(item.operationID)}
            />
          </View>
        ))}
      </ScrollView>
      <View style={styles.modeRow}>
        <TouchableOpacity
          style={[
            styles.modeButton,
            selectedOperation === "transform" && { backgroundColor: "#333" },
          ]}
          onPress={() => setSelectedOperation("transform")}
        >
          <Icon iconID="transform" text="Transform" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modeButton,
            selectedOperation === "adjust" && { backgroundColor: "#333" },
          ]}
          onPress={() => setSelectedOperation("adjust")}
        >
          <Icon iconID="tune" text="Adjust" />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  opRow: {
    height: 80,
    width: "100%",
    backgroundColor: "#333",
  },
  opContainer: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
  },
  modeRow: {
    height: 80,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  modeButton: {
    height: 80,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222",
  },
});
