import * as React from "react";
import {StyleSheet, View,} from "react-native";
import {useRecoilState} from "recoil";
import {useContext, useMemo} from "react";
import {Icon, IconButton} from "../icon";
import {editingModeState} from "../../store";
import {
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
};

export function OperationSelection() {
    const {allowedTransformOperations} = useContext(EditorContext);

    const isTransformOnly = allowedTransformOperations

    const selectedOperationGroup = "transform"
    const [, setEditingMode] = useRecoilState(editingModeState);

    const filteredOperations = useMemo(() => {
        // If neither are specified then allow the full range of operations
        if (!allowedTransformOperations) {
            return operations;
        }
        const filteredTransforms = allowedTransformOperations
            ? operations.transform.filter((op) =>
                allowedTransformOperations.includes(op.operationID)
            )
            : operations.transform;
        if (isTransformOnly) {
            return {transform: filteredTransforms, adjust: []};
        }
        return {transform: filteredTransforms};
    }, [
        allowedTransformOperations,
        isTransformOnly,
    ]);

    return (
        <View style={styles.opRow}>
            {
                //@ts-ignore
                filteredOperations[selectedOperationGroup].map(
                    (item: Operation<EditingOperations>) => (
                        <IconButton
                            key={item.title}
                            text={item.title}
                            iconID={item.iconID}
                            style={styles.modeButton}
                            onPress={() => setEditingMode(item.operationID)}
                        />
                    )
                )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    opRow: {
        paddingTop: 8,
        flexDirection: 'row',
        backgroundColor: "#000",
    },
    modeButton: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
