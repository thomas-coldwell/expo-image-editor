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

const operations = {
  transform: [
    {
      title: "Crop",
      iconID: "crop",
    },
    {
      title: "Rotate",
      iconID: "rotate-90-degrees-ccw",
    },
  ],
  adjust: [
    {
      title: "Blur",
      iconID: "blur-on",
    },
  ],
};

export function OperationBar() {
  //
  const [selectedOperation, setSelectedOperation] = React.useState<
    "transform" | "adjust"
  >("transform");

  return (
    <View style={styles.container}>
      <ScrollView style={styles.opRow} horizontal>
        {operations[selectedOperation].map((item, index) => (
          <View style={styles.opContainer}>
            <IconButton text={item.title} iconID={item.iconID} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 160,
    width: "100%",
    backgroundColor: "#333",
  },
  opRow: {
    flex: 1,
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
    flex: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  modeButton: {
    height: 70,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222",
  },
});
