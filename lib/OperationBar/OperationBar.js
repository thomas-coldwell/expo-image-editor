import * as React from "react";
import { StyleSheet, View } from "react-native";
import { editingModeState } from "../Store";
import { useRecoilState } from "recoil";
import { OperationSelection } from "./OperationSelection";
import { Crop } from "./Crop";
import { Rotate } from "./Rotate";
import { Blur } from "./Blur";
export function OperationBar() {
    //
    const [editingMode] = useRecoilState(editingModeState);
    const getOperationWindow = () => {
        switch (editingMode) {
            case "crop":
                return React.createElement(Crop, null);
            case "rotate":
                return React.createElement(Rotate, null);
            case "blur":
                return React.createElement(Blur, null);
            default:
                return null;
        }
    };
    return (React.createElement(View, { style: styles.container },
        React.createElement(OperationSelection, null),
        editingMode !== "operation-select" && (React.createElement(View, { style: [styles.container, { position: "absolute" }] }, getOperationWindow()))));
}
const styles = StyleSheet.create({
    container: {
        height: 160,
        width: "100%",
        backgroundColor: "#333",
        justifyContent: "center",
    },
});
