import * as React from "react";
import {
    StyleSheet,
    View,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import {useRecoilState} from "recoil";
import {useContext, useMemo} from "react";
import {Icon, IconButton} from "../icon";
import {editingModeState} from "../../store";
import {
    AdjustmentOperations,
    EditingOperations,
    TransformOperations,
} from "../../types";
import {EditorContext} from "../../constants";

interface Operation<T> {
    title: string;
    iconID: React.ComponentProps<typeof Icon>["iconID"];
    operationID: T;
}

interface Operations {
    transform: Operation<TransformOperations>[];
    adjust: Operation<AdjustmentOperations>[];
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
    const {allowedTransformOperations, allowedAdjustmentOperations} = useContext(EditorContext);

    const isTransformOnly = allowedTransformOperations && !allowedAdjustmentOperations;
    const isAdjustmentOnly = allowedAdjustmentOperations && !allowedTransformOperations;

    const [selectedOperationGroup, setSelectedOperationGroup] = React.useState<"transform" | "adjust">(
        isAdjustmentOnly ? "adjust" : "transform"
    );
    const [, setEditingMode] = useRecoilState(editingModeState);

    const filteredOperations = useMemo(() => {
        // If neither are specified then allow the full range of operations
        if (!allowedTransformOperations && !allowedAdjustmentOperations) {
            return operations;
        }
        const filteredTransforms = allowedTransformOperations
            ? operations.transform.filter((op) =>
                allowedTransformOperations.includes(op.operationID)
            )
            : operations.transform;
        const filteredAdjustments = allowedAdjustmentOperations
            ? operations.adjust.filter((op) =>
                allowedAdjustmentOperations.includes(op.operationID)
            )
            : operations.adjust;
        if (isTransformOnly) {
            return {transform: filteredTransforms, adjust: []};
        }
        if (isAdjustmentOnly) {
            return {adjust: filteredAdjustments, transform: []};
        }
        return {transform: filteredTransforms, adjust: filteredAdjustments};
    }, [
        allowedTransformOperations,
        allowedAdjustmentOperations,
        isTransformOnly,
        isAdjustmentOnly,
    ]);

    return (
        <>
            <ScrollView style={styles.opRow} horizontal>
                {
                    //@ts-ignore
                    filteredOperations[selectedOperationGroup].map(
                        (item: Operation<EditingOperations>, index: number) => (
                            <View style={styles.opContainer} key={item.title}>
                                <IconButton
                                    text={item.title}
                                    iconID={item.iconID}
                                    onPress={() => setEditingMode(item.operationID)}
                                />
                            </View>
                        )
                    )
                }
            </ScrollView>
            {!isTransformOnly && !isAdjustmentOnly ? (
                <View style={styles.modeRow}>
                    <TouchableOpacity
                        style={[
                            styles.modeButton,
                            selectedOperationGroup === "transform" && {
                                backgroundColor: "#333",
                            },
                        ]}
                        onPress={() => setSelectedOperationGroup("transform")}
                    >
                        <Icon iconID="transform" text="Transform"/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.modeButton,
                            selectedOperationGroup === "adjust" && {
                                backgroundColor: "#333",
                            },
                        ]}
                        onPress={() => setSelectedOperationGroup("adjust")}
                    >
                        <Icon iconID="tune" text="Adjust"/>
                    </TouchableOpacity>
                </View>
            ) : null}
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
