import * as React from "react";
import { StyleSheet, View, TouchableOpacity, ScrollView, } from "react-native";
import { Icon } from "../components/Icon";
import { IconButton } from "../components/IconButton";
import { editingModeState } from "../Store";
import { useRecoilState } from "recoil";
import { useContext } from "react";
import { EditorContext, } from "../ImageEditor";
import { useMemo } from "react";
const operations = {
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
    const { allowedTransformOperations, allowedAdjustmentOperations, } = useContext(EditorContext);
    const isTransformOnly = allowedTransformOperations && !allowedAdjustmentOperations;
    const isAdjustmentOnly = allowedAdjustmentOperations && !allowedTransformOperations;
    const [selectedOperationGroup, setSelectedOperationGroup] = React.useState(isAdjustmentOnly ? "adjust" : "transform");
    const [, setEditingMode] = useRecoilState(editingModeState);
    const filteredOperations = useMemo(() => {
        // If neither are specified then allow the full range of operations
        if (!allowedTransformOperations && !allowedAdjustmentOperations) {
            return operations;
        }
        const filteredTransforms = allowedTransformOperations
            ? operations.transform.filter((op) => allowedTransformOperations.includes(op.operationID))
            : operations.transform;
        const filteredAdjustments = allowedAdjustmentOperations
            ? operations.adjust.filter((op) => allowedAdjustmentOperations.includes(op.operationID))
            : operations.adjust;
        if (isTransformOnly) {
            return { transform: filteredTransforms, adjust: [] };
        }
        if (isAdjustmentOnly) {
            return { adjust: filteredAdjustments, transform: [] };
        }
        return { transform: filteredTransforms, adjust: filteredAdjustments };
    }, [
        allowedTransformOperations,
        allowedAdjustmentOperations,
        isTransformOnly,
        isAdjustmentOnly,
    ]);
    return (React.createElement(React.Fragment, null,
        React.createElement(ScrollView, { style: styles.opRow, horizontal: true }, filteredOperations[selectedOperationGroup].map((item, index) => (React.createElement(View, { style: styles.opContainer, key: item.title },
            React.createElement(IconButton, { text: item.title, iconID: item.iconID, onPress: () => setEditingMode(item.operationID) }))))),
        !isTransformOnly && !isAdjustmentOnly ? (React.createElement(View, { style: styles.modeRow },
            React.createElement(TouchableOpacity, { style: [
                    styles.modeButton,
                    selectedOperationGroup === "transform" && {
                        backgroundColor: "#333",
                    },
                ], onPress: () => setSelectedOperationGroup("transform") },
                React.createElement(Icon, { iconID: "transform", text: "Transform" })),
            React.createElement(TouchableOpacity, { style: [
                    styles.modeButton,
                    selectedOperationGroup === "adjust" && {
                        backgroundColor: "#333",
                    },
                ], onPress: () => setSelectedOperationGroup("adjust") },
                React.createElement(Icon, { iconID: "tune", text: "Adjust" })))) : null));
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
