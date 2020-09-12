import * as React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Icon } from "./components/Icon";

export function OperationBar() {
  //
  const [selectedOperation, setSelectedOperation] = React.useState("transform");

  return (
    <View style={styles.container}>
      <View style={styles.opRow}></View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 140,
    width: "100%",
    backgroundColor: "#333",
  },
  opRow: {
    height: 70,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#333",
  },
  modeRow: {
    height: 70,
    width: Platform.OS == "web" ? "100vw" : "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  modeButton: {
    height: 70,
    width: Platform.OS == "web" ? "50vw" : "50%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222",
  },
});
