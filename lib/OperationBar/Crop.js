import * as React from "react";
import { StyleSheet, View, Text } from "react-native";
import { useRecoilState } from "recoil";
import { IconButton } from "../components/IconButton";
import { editingModeState } from "../Store";
import { usePerformCrop } from "../customHooks/usePerformCrop";
export function Crop() {
    const [, setEditingMode] = useRecoilState(editingModeState);
    const onPerformCrop = usePerformCrop();
    return (React.createElement(View, { style: styles.container },
        React.createElement(IconButton, { iconID: "close", text: "Cancel", onPress: () => setEditingMode("operation-select") }),
        React.createElement(Text, { style: styles.prompt }, "Adjust window to crop"),
        React.createElement(IconButton, { iconID: "check", text: "Done", onPress: onPerformCrop })));
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
