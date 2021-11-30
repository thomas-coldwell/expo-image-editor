import * as React from "react";
import {StyleSheet, View,} from "react-native";
import {useRecoilState} from "recoil";
import {Icon, IconButton} from "../icon";
import {editingModeState} from "../../store";
import {
    EditingOperations,
    TransformOperations,
} from "../../types";
import {useContext} from "react";
import {EditorContext} from "../../constants";

interface Operation<T> {
    title: string;
    iconID: React.ComponentProps<typeof Icon>["iconID"];
    operationID: T;
}

const operations: Operation<TransformOperations>[] = [
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
    ]

export function OperationSelection() {
    const { cropIcon, rotateIcon } = useContext(EditorContext)
    const [, setEditingMode] = useRecoilState(editingModeState);

    const getIcon = (operation: Operation<TransformOperations>) => {
        switch (operation.operationID) {
            case "crop":
                return cropIcon
            case "rotate":
                return rotateIcon
            default:
                return undefined
        }
    }

    return (
        <View style={styles.opRow}>
            {
                operations.map(
                    (item: Operation<EditingOperations>) => (
                        <IconButton
                            key={item.title}
                            icon={getIcon(item)}
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
