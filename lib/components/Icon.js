import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
export function Icon(props) {
    return (React.createElement(View, { style: styles.container },
        React.createElement(MaterialIcons, { name: props.iconID, size: 26, color: props.disabled ? "grey" : "white" }),
        React.createElement(Text, { style: [styles.text, props.disabled && { color: "grey" }] }, props.text)));
}
const styles = StyleSheet.create({
    container: {
        height: 64,
        width: 80,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
    },
    text: {
        color: "#fff",
        textAlign: "center",
    },
});
